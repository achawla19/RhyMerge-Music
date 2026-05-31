import express from "express";

import {
  login,
  register,
  refresh,
  logout,
  getMe,
} from "../controllers/authController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// AUTH
router.post("/login", login);

router.post("/register", register);

router.post("/refresh", refresh);

router.post("/logout", logout);

// CURRENT USER
router.get("/me", protect, getMe);

export default router;
