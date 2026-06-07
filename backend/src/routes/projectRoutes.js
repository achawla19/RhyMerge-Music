import express from "express";

import {
  createProject,
  getProjects,
  getProjectsByUsername,
  searchProjects,
} from "../controllers/projectController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getProjects);

router.post("/", protect, createProject);
router.get("/search", searchProjects);

router.get("/user/:username", getProjectsByUsername);

// router.get("/:id", getProjectById);

export default router;
