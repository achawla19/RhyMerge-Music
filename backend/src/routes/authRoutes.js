import express from "express";

import {
  login,
  register,
  refresh,
  logout,
  getMe,
} from "../controllers/authController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authRateLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

// Rate-limited: max 20 attempts per 15 minutes per IP, to slow down
// brute-force / credential-stuffing attempts against these two endpoints.
const loginLimiter = authRateLimiter({ windowMs: 15 * 60 * 1000, max: 20 });

// AUTH
router.post("/login", loginLimiter, login);

router.post("/register", loginLimiter, register);

router.post("/refresh", refresh);

router.post("/logout", logout);

// CURRENT USER
router.get("/me", protect, getMe);

export default router;
