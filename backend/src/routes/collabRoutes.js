import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { generalRateLimiter } from "../middleware/rateLimiter.js";
import {
  createCollabPost,
  getCollabPosts,
  getCollabPostById,
  getMyCollabPosts,
  updateCollabPost,
  deleteCollabPost,
  respondToCollab,
  getCollabResponses,
  getMyResponseStatus,
  acceptResponse,
  declineResponse,
} from "../controllers/collabController.js";

const router = express.Router();

// Static routes before /:id so "mine" never gets swallowed as an id param
router.get("/mine", protect, getMyCollabPosts);

router.get("/", getCollabPosts);
router.post("/", protect, generalRateLimiter, createCollabPost);

router.get("/:id", getCollabPostById);
router.put("/:id", protect, updateCollabPost);
router.delete("/:id", protect, deleteCollabPost);

router.post("/:id/respond", protect, generalRateLimiter, respondToCollab);
router.get("/:id/responses", protect, getCollabResponses);
router.get("/:id/my-response", protect, getMyResponseStatus);

router.patch("/responses/:id/accept", protect, acceptResponse);
router.patch("/responses/:id/decline", protect, declineResponse);

export default router;
