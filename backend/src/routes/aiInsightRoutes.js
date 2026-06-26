import express from "express";
import { getAIInsights } from "../controllers/aiInsightController.js";
import { protect } from "../middleware/authMiddleware.js";
import { generalRateLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

// Rate limit AI calls — each call costs tokens
router.get("/:projectId", protect, generalRateLimiter, getAIInsights);

export default router;
