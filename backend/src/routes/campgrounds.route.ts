import { Router } from "express";
import {
  createCampground,
  getCampgrounds,
  getCampgroundById,
  updateCampground,
  deleteCampground,
} from "../controllers/campground.controller";
import { validateCampground } from "../validation/campgroundSchema";
import reviewRouter from "./reviews.route";
import { validateReview } from "../validation/reviewSchema";
import { authenticateUser } from "../utils/auth";
import { isAuthor } from "../utils/isAuthor";

const router = Router();

router
  .route("/")
  .get(getCampgrounds)
  .post(authenticateUser, validateCampground, createCampground);
router
  .route("/:id")
  .get(getCampgroundById)
  .put(authenticateUser, validateCampground, isAuthor, updateCampground)
  .delete(authenticateUser, isAuthor, deleteCampground);
router.use("/:id/reviews", validateReview, reviewRouter);

export default router;
