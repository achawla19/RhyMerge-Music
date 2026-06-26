import express from "express";
import {
  getProjectFiles,
  uploadProjectFile,
  deleteProjectFile,
} from "../controllers/projectFileController.js";
import { protect } from "../middleware/authMiddleware.js";
import { audioUploader } from "../middleware/upload.js";
import { uploadRateLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.get("/:projectId", getProjectFiles);

router.post(
  "/:projectId",
  protect,
  uploadRateLimiter,
  (req, res, next) => {
    audioUploader.single("file")(req, res, (err) => {
      if (err) {
        const msg =
          err.code === "LIMIT_FILE_SIZE"
            ? "File too large — max 50MB"
            : err.message || "Upload failed";
        return res.status(400).json({ msg });
      }
      next();
    });
  },
  uploadProjectFile,
);

router.delete("/:fileId", protect, deleteProjectFile);

export default router;
