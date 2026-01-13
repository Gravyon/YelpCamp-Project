import { Router } from "express";
import {
  createUser,
  updateUser,
  getUserById,
  getUsers,
  deleteUser,
  login,
  logout,
  getAuthenticatedUser,
} from "../controllers/user.controller";
import { validateUserInput } from "../validation/userInput";
import { authenticateUser } from "../utils/auth";

const router = Router();

router.get("/", getUsers);
router.post("/register", validateUserInput, createUser);
router.post("/login", login);
router.post("/logout", authenticateUser, logout);
router.get("/me", authenticateUser, getAuthenticatedUser);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
