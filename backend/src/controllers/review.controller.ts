import { Request, Response } from "express";
import Review from "../models/review.model";
import { AppError } from "../utils/AppError";
import Campground from "../models/campground.model";

export async function getReviews(req: Request, res: Response) {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground) {
    throw new AppError({ message: "Campground not found", httpCode: 404 });
  }
  const reviews = campground.reviews;
  res.status(200).json({ reviews });
}

export async function createReview(req: Request, res: Response) {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground) {
    throw new AppError({ message: "Campground not found", httpCode: 404 });
  }
  const review = new Review(req.body.review);
  review.author = req.user._id;
  campground?.reviews.push(review._id);
  await review.save();
  await campground?.save();
  await review.populate("author");
  res
    .status(201)
    .json({ message: "Review created", review: review.toObject() });
}

export async function deleteReview(req: Request, res: Response) {
  const { id, reviewId } = req.params;
  await Campground.findByIdAndUpdate(id, {
    $pull: { reviews: reviewId },
  });
  const review = await Review.findByIdAndDelete(reviewId);
  if (!review)
    throw new AppError({ message: "Review not found", httpCode: 404 });
  res.status(200).json({ message: "Review deleted successfully" });
}
