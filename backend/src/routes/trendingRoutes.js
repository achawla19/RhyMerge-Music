import express from "express";
import { getTrendingCreators } from "../controllers/trendingController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
router.get("/creators", protect, getTrendingCreators);
export default router;