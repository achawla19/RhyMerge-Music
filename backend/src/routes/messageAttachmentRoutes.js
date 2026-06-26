import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { protect } from "../middleware/authMiddleware.js";
import { uploadRateLimiter } from "../middleware/rateLimiter.js";
import { uploadMessageAttachment } from "../controllers/messageAttachmentController.js";

// Replace cloudinary.config(process.env.CLOUDINARY_URL) with this:
const cloudinaryUrl = process.env.CLOUDINARY_URL;

const router = express.Router();

// Memory storage — we stream directly to Cloudinary from buffer
// This avoids any disk dependency and any field-name / stream issues
const memStorage = multer.memoryStorage();

const uploader = multer({
  storage: memStorage,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ok =
      file.mimetype.startsWith("audio/") ||
      file.mimetype.startsWith("image/") ||
      file.mimetype === "application/pdf";
    ok ? cb(null, true) : cb(new Error("Only audio, image, or PDF allowed"));
  },
});

router.post(
  "/",
  protect,
  uploadRateLimiter,
  (req, res, next) => {
    uploader.single("file")(req, res, (err) => {
      if (err)
        return res.status(400).json({ msg: err.message || "Upload failed" });
      if (!req.file) return res.status(400).json({ msg: "No file received" });
      next();
    });
  },
  async (req, res) => {
    try {
      // Determine resource type for Cloudinary
      const resourceType = req.file.mimetype.startsWith("image/")
        ? "image"
        : "video";

      // Upload buffer directly to Cloudinary
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "rhymerge/message-attachments",
            resource_type: resourceType,
            use_filename: false,
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          },
        );
        stream.end(req.file.buffer);
      });

      res.json({
        url: result.secure_url,
        publicId: result.public_id,
        name: req.file.originalname,
        type: req.file.mimetype,
        size: req.file.size,
      });
    } catch (err) {
      console.error("Cloudinary upload error:", err);
      res.status(500).json({ msg: "Upload to cloud failed" });
    }
  },
);

export default router;
