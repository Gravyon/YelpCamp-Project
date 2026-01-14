import { Request, Response } from "express";
import Campground from "../models/campground.model";
import { AppError } from "../utils/AppError";
import { utapi } from "../uploadthing/utapi";
import axios from "axios";

////////////////////////
// GET ALL CAMPGROUNDS
////////////////////////

export async function getCampgrounds(req: Request, res: Response) {
  const page = parseInt(req.query.page as string) || 1;
  const limit = 20;
  const skip = (page - 1) * limit;
  const search = req.query.search as string;
  let query = {};
  if (search) {
    query = {
      $or: [
        { title: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ],
    };
  }
  const totalDocs = await Campground.countDocuments(query);
  const campgrounds = await Campground.find(query)
    .sort({ _id: -1 }) // Show newest first
    .limit(limit)
    .skip(skip);
  res.status(200).json({
    campgrounds,
    currentPage: page,
    totalPages: Math.ceil(totalDocs / limit),
    totalItems: totalDocs,
  });
}

////////////////////////
// POST CAMPGROUND
////////////////////////

export async function createCampground(req: Request, res: Response) {
  const geoData = await axios.get(
    `https://api.maptiler.com/geocoding/${encodeURIComponent(
      req.body.location
    )}.json?key=${process.env.MAPTILER_KEY}&limit=1`
  );
  const geometry = geoData.data.features[0].geometry;
  const campground = new Campground({ ...req.body, geometry: geometry });
  campground.author = req.user._id;
  await campground.save();
  res
    .status(201)
    .json({ message: `Campground created successfully`, campground });
}

////////////////////////
// FIND CAMPGROUND BY ID
////////////////////////

export async function getCampgroundById(req: Request, res: Response) {
  const campground = await Campground.findById(req.params.id)
    .populate({
      path: "reviews",
      populate: { path: "author" },
    })
    .populate("author");
  if (!campground)
    throw new AppError({ message: "Campground not found", httpCode: 404 });
  res.status(200).json(campground);
}

////////////////////////
// PUT CAMPGROUND
////////////////////////

export async function updateCampground(req: Request, res: Response) {
  const { images, imagesToDelete, ...textFields } = req.body;
  const campground = await Campground.findById(req.params.id);
  if (!campground) {
    throw new AppError({ message: "Campground not found", httpCode: 404 });
  }
  // --- 1. CALCULATE LIMITS ---
  const currentImageCount = (campground.images || []).length;
  const newImagesToUpload = images && Array.isArray(images) ? images.length : 0;
  const deleteCount =
    imagesToDelete && Array.isArray(imagesToDelete) ? imagesToDelete.length : 0;
  const newTotalImages = currentImageCount + newImagesToUpload - deleteCount;
  if (newTotalImages > 15) {
    throw new AppError({
      message: `Limit exceeded. You have ${currentImageCount}, adding ${newImagesToUpload}, deleting ${deleteCount}. Result: ${newTotalImages} (Max 15)`,
      httpCode: 400,
    });
  }
  // --- 2. APPLY UPDATES (Text + Additions) ---
  Object.assign(campground, textFields);
  if (newImagesToUpload > 0) {
    if (!campground.images) campground.images = [] as any;
    campground.images.push(...images);
  }
  // Save additions and text changes first
  await campground.save();
  // --- 3. HANDLE DELETIONS ---
  if (deleteCount > 0) {
    // A. Delete from UploadThing (Fire and forget, or log errors)
    utapi
      .deleteFiles(imagesToDelete)
      .catch((err: any) => console.error("UTApi Delete Error:", err));

    // B. Delete from Database
    await campground.updateOne({
      $pull: { images: { filename: { $in: imagesToDelete } } },
    });
  }
  // --- 4. RETURN FRESH DATA ---
  const updatedCampground = await Campground.findById(req.params.id);
  res.status(200).json({ campground: updatedCampground });
}

////////////////////////
// DELETE CAMPGROUND
////////////////////////

export async function deleteCampground(req: Request, res: Response) {
  const campground = await Campground.findById(req.params.id);
  if (!campground)
    throw new AppError({ message: "Campground not found", httpCode: 404 });

  // 2. Extract keys/filenames
  const imageKeys = campground.images
    .map((img) => img.filename)
    .filter((key): key is string => !!key); //<--- This filters null/undefined AND fixes the type

  if (imageKeys.length > 0) {
    await utapi
      .deleteFiles(imageKeys)
      .catch((err) => console.error("UT Delete Error", err));
  }

  await Campground.findByIdAndDelete(req.params.id);

  res.status(200).json({
    message: `Campground deleted successfully`,
  });
}
