import express from "express";
import {
  getConversations,
  getMessagesWithUser,
} from "../controllers/messageController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/conversations", protect, getConversations);
router.get("/:userId", protect, getMessagesWithUser);

export default router;
