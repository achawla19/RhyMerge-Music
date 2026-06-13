import express from "express";

import { protect } from "../middleware/authMiddleware.js";

import {
  createProjectRequest,
  getProjectRequests,
  acceptProjectRequest,
  rejectProjectRequest,
  getMyProjectRequest,
} from "../controllers/projectRequestController.js";

const router = express.Router();

router.post("/", protect, createProjectRequest);
router.get("/project/:projectId", protect, getProjectRequests);
router.get("/mine/:projectId", protect, getMyProjectRequest);
router.patch("/accept/:id", protect, acceptProjectRequest);
router.patch("/reject/:id", protect, rejectProjectRequest);

export default router;
