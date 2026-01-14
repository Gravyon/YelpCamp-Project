import BaseJoi from "joi";
import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";
import sanitizeHtml from "sanitize-html";

const extension = (joi: any) => ({
  type: "string",
  base: joi.string(),
  messages: {
    "string.escapeHTML": "{{#label}} must not include HTML!",
  },
  rules: {
    escapeHTML: {
      validate(value: string, helpers: any) {
        const clean = sanitizeHtml(value, {
          allowedTags: [],
          allowedAttributes: {},
        });
        if (clean !== value)
          return helpers.error("string.escapeHTML", { value });
        return clean;
      },
    },
  },
});

const Joi = BaseJoi.extend(extension);

export const validateReview = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const reviewSchema = Joi.object({
    review: Joi.object({
      rating: Joi.number().required().min(1).max(5),
      body: Joi.string().required().trim().escapeHTML(),
    }).required(),
  });

  const { error } = reviewSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });
  if (error) {
    const msg = error.details.map((e: any) => e.message).join(", ");
    throw new AppError({ message: msg, httpCode: 400 });
  } else {
    next();
  }
};
