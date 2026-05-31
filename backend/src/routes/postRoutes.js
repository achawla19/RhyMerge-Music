import express from "express";

import {
  createPost,
  getPosts,
  toggleLike,
  addComment,
} from "../controllers/postController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getPosts);

router.post("/", protect, createPost);

router.put("/:id/like", protect, toggleLike);

router.post("/:id/comment", protect, addComment);

export default router;
