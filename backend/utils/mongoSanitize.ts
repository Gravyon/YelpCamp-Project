import { Request, Response, NextFunction } from "express";

// Recursive function to strip keys starting with '$' or containing '.'
const sanitize = (obj: any) => {
  if (obj && typeof obj === "object") {
    for (const key in obj) {
      if (key.startsWith("$") || key.includes(".")) {
        delete obj[key]; // Delete the dangerous key
      } else {
        sanitize(obj[key]); // Recursively check nested objects
      }
    }
  }
};

export const mongoSanitize = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Sanitize in-place (modifies the existing objects)
  if (req.body) sanitize(req.body);
  if (req.query) sanitize(req.query);
  if (req.params) sanitize(req.params);

  next();
};
