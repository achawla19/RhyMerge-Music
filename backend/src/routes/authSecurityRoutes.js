import express from "express";
import {
  changePassword,
  deleteAccount,
} from "../controllers/authSecurityController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authRateLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.put("/change-password", protect, authRateLimiter(), changePassword);
router.delete("/delete-account", protect, authRateLimiter(), deleteAccount);

export default router;
