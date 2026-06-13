import express from "express";

import {
  createProject,
  getProjects,
  getProjectsByUsername,
  searchProjects,
  getProjectById,
} from "../controllers/projectController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getProjects);

router.get("/search", searchProjects);

router.get("/user/:username", getProjectsByUsername);
router.get("/:id", getProjectById);
router.post("/", protect, createProject);

export default router;
