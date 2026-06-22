import express from "express";
import {
  getProjectFiles,
  uploadProjectFile,
  deleteProjectFile,
} from "../controllers/projectFileController.js";
import { protect } from "../middleware/authMiddleware.js";
import { createUploader } from "../middleware/upload.js";

const router = express.Router();
const upload = createUploader("stems");

router.get("/:projectId", getProjectFiles);

router.post(
  "/:projectId",
  protect,
  (req, res, next) => {
    upload.single("file")(req, res, (err) => {
      if (err) {
        const msg =
          err.code === "LIMIT_FILE_SIZE"
            ? "File is too large — max 25MB"
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
