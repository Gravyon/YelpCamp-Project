import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";



export const validateReview = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const reviewSchema = Joi.object({
    review: Joi.object({
      rating: Joi.number().required().min(1).max(5),
      body: Joi.string().required().trim(),
    }).required(),
  });

  const { error } = reviewSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });
  if (error) {
    const msg = error.details.map((e) => e.message).join(", ");
    throw new AppError({ message: msg, httpCode: 400 });
  } else {
    next();
  }
};
