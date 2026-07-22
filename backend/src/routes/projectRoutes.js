import express from "express";
import {
  createProject,
  updateProject,
  deleteProject,
  updateProjectCover,
  removeCollaborator,
  getProjects,
  getProjectById,
  getProjectsByUsername,
  searchProjects,
} from "../controllers/projectController.js";
import { protect, optionalAuth } from "../middleware/authMiddleware.js";
import { imageUploader } from "../middleware/upload.js";
import { uploadRateLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.get("/", getProjects);
router.get("/search", searchProjects);
router.get("/user/:username", optionalAuth, getProjectsByUsername);
router.get("/:id", getProjectById);

router.post("/", protect, createProject);
router.patch("/:id", protect, updateProject);
router.delete("/:id", protect, deleteProject);

// Cover image upload — rate limited separately (bandwidth cost)
router.patch(
  "/:id/cover",
  protect,
  uploadRateLimiter,
  (req, res, next) => {
    imageUploader.single("cover")(req, res, (err) => {
      if (err)
        return res.status(400).json({ msg: err.message || "Upload failed" });
      next();
    });
  },
  updateProjectCover,
);

router.delete("/:id/collaborators/:userId", protect, removeCollaborator);

export default router;
