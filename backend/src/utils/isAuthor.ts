import { NextFunction, Request, Response } from "express";
import Campground from "../models/campground.model";
import { AppError } from "./AppError";
export const isAuthor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground?.author?.equals(req.user._id)) {
    throw new AppError({ message: "Not authorized", httpCode: 403 });
  }
  next();
};
