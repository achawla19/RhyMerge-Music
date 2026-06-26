import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

/**
 * All uploads go straight to Cloudinary — no local disk at all.
 * Disk storage meant every redeploy wiped uploaded files. Cloudinary
 * gives us a CDN URL, format transforms, and persistence for free.
 *
 * Required env vars:
 *   CLOUDINARY_CLOUD_NAME
 *   CLOUDINARY_API_KEY
 *   CLOUDINARY_API_SECRET
 *
 * Install: npm install cloudinary multer-storage-cloudinary
 */

cloudinary.config(process.env.CLOUDINARY_URL);

const AUDIO_MIME = new Set([
  "audio/mpeg",
  "audio/wav",
  "audio/x-wav",
  "audio/ogg",
  "audio/mp4",
  "audio/x-m4a",
  "audio/flac",
  "audio/webm",
]);

const IMAGE_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const MAX_AUDIO_BYTES = 50 * 1024 * 1024; // 50 MB
const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB

// ─── AUDIO uploader (stems + message attachments) ──────────────────────────
const audioStorage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => ({
    folder: "rhymerge/stems",
    resource_type: "video", // Cloudinary uses "video" for audio
    use_filename: false,
    unique_filename: true,
    format: undefined, // keep original format
  }),
});

const audioFilter = (req, file, cb) => {
  AUDIO_MIME.has(file.mimetype)
    ? cb(null, true)
    : cb(new Error("Only audio files are allowed (mp3, wav, ogg, m4a, flac)"));
};

export const audioUploader = multer({
  storage: audioStorage,
  fileFilter: audioFilter,
  limits: { fileSize: MAX_AUDIO_BYTES },
});

// ─── IMAGE uploader (avatars, project covers) ──────────────────────────────
const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => ({
    folder: "rhymerge/images",
    resource_type: "image",
    transformation: [
      { width: 800, height: 800, crop: "limit", quality: "auto" },
    ],
    use_filename: false,
    unique_filename: true,
    format: "webp", // always serve webp — smaller + universal
  }),
});

const imageFilter = (req, file, cb) => {
  IMAGE_MIME.has(file.mimetype)
    ? cb(null, true)
    : cb(new Error("Only image files are allowed (jpg, png, webp, gif)"));
};

export const imageUploader = multer({
  storage: imageStorage,
  fileFilter: imageFilter,
  limits: { fileSize: MAX_IMAGE_BYTES },
});

/**
 * Delete a file from Cloudinary by its public_id.
 * Used by delete endpoints so we don't leave orphaned assets.
 */
export const deleteFromCloudinary = async (
  publicId,
  resourceType = "video",
) => {
  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
  } catch (err) {
    // Log but don't throw — a failed CDN delete should never block the
    // DB delete. The asset will eventually be cleaned by Cloudinary's
    // unused-resource sweep.
    console.error("Cloudinary delete failed:", err.message);
  }
};

// Legacy default export kept so any import that does `import upload from ...`
// still works without changes. Points to audio uploader (most common case).
export default audioUploader;
