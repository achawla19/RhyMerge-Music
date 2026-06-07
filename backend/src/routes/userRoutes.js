import express from "express";
import {
  searchUsers,
  getAllUsers,
  getUserByUsername,
  updateMyProfile,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Search users
router.get("/search", searchUsers);

// Get all users
router.get("/all", getAllUsers);

// Get single user profile by username
router.get("/:username", getUserByUsername);

// Update logged-in user's profile
router.put("/profile", protect, updateMyProfile);

// Optional legacy route
router.get("/", getAllUsers);

export default router;
