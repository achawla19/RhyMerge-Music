import multer from "multer";
import fs from "fs";
import path from "path";
import crypto from "crypto";

// Audio formats only — this is a music collaboration platform, not
// general file storage. Widening this list later is easy; starting
// permissive is not, since that's an open door for arbitrary content
// disguised as a "track".
const ALLOWED_MIME_TYPES = new Set([
  "audio/mpeg", // .mp3
  "audio/wav",
  "audio/x-wav",
  "audio/ogg",
  "audio/mp4", // .m4a
  "audio/x-m4a",
  "audio/flac",
  "audio/webm",
]);

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB

/**
 * Builds a multer instance scoped to its own upload subfolder, sharing
 * the same validation rules. Used for message attachments AND project
 * stems — separate folders keep the two clearly distinct on disk.
 */
export const createUploader = (subfolder) => {
  const uploadDir = path.join("uploads", subfolder);
  fs.mkdirSync(uploadDir, { recursive: true });

  const storage = multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => {
      // Random filename + sanitized extension only — never trust
      // file.originalname directly in a filesystem path (path traversal /
      // injection risk), and it also avoids collisions between uploads.
      const ext = path
        .extname(file.originalname)
        .toLowerCase()
        .replace(/[^a-z0-9.]/g, "");
      const randomName = crypto.randomBytes(16).toString("hex");
      cb(null, `${Date.now()}-${randomName}${ext}`);
    },
  });

  const fileFilter = (req, file, cb) => {
    if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
      return cb(
        new Error("Only audio files are supported (mp3, wav, ogg, m4a, flac)"),
      );
    }
    cb(null, true);
  };

  return multer({ storage, fileFilter, limits: { fileSize: MAX_FILE_SIZE } });
};

// Default export kept for backward compatibility with existing imports.
export default createUploader("messages");
