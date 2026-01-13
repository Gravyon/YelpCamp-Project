import { NextFunction, Request, Response } from "express";
import { AppError } from "./AppError";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = err;

  // Mongoose CastError (invalid ID, invalid types, etc)
  if (err.name === "CastError") {
    const msg = `Invalid value for ${err.path}: ${err.value}`;
    error = new AppError({ message: msg, httpCode: 400 });
  }

  // Mongoose ValidationError
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((val: any) => val.message);
    const msg = `Invalid input data: ${messages.join(".")}`;
    error = new AppError({ message: msg, httpCode: 400, details: err.errors });
  }
  // duplicated key
  if (err.code === 11000) {
    const msg = `That ${Object.keys(err.keyValue)[0]} is already taken`;
    error = new AppError({ message: msg, httpCode: 400 });
  }

  let statusCode = error.httpCode || 500;
  let message = error.message || "Internal Server Error";

  // standard AppError
  if (err instanceof AppError) {
    statusCode = error.httpCode;
    message = error.message;
  }

  if (error.isOperational) {
    return res.status(statusCode).json({
      success: false,
      message: message,
      ...(error.details && { errors: error.details }),
    });
  }

  console.error("Error", err);
  return res.status(500).json({ success: false, message: message });
};
