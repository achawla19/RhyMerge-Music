import express from "express";

import { protect } from "../middleware/authMiddleware.js";

import {
  toggleSavedProject,
  getSavedProjects,
} from "../controllers/savedProjectController.js";

const router = express.Router();

router.post("/toggle", protect, toggleSavedProject);
router.get("/", protect, getSavedProjects);

export default router;
