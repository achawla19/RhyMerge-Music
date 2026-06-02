import express from "express";

import {
  sendRequest,
  acceptRequest,
  rejectRequest,
  getConnections,
  getRequests,
} from "../controllers/connectionController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/send/:id", protect, sendRequest);

router.post("/accept/:id", protect, acceptRequest);

router.post("/reject/:id", protect, rejectRequest);

router.get("/connections", protect, getConnections);

router.get("/requests", protect, getRequests);

export default router;
