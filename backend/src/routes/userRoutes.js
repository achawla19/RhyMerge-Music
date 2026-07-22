import express from "express";
import {
  searchUsers,
  getAllUsers,
  getUserByUsername,
  updateMyProfile,
  uploadAvatar,
  unsyncConnection,
  updatePreferences,
} from "../controllers/userController.js";
import { protect, optionalAuth } from "../middleware/authMiddleware.js";
import { imageUploader } from "../middleware/upload.js";
import { uploadRateLimiter } from "../middleware/rateLimiter.js";
import { getUserAudioReel } from "../controllers/projectFileController.js";

const router = express.Router();

router.get("/search", searchUsers);
router.get("/all", getAllUsers);
router.get("/:username", optionalAuth, getUserByUsername);
router.get("/:username/audio-reel", optionalAuth, getUserAudioReel);

router.put("/profile", protect, updateMyProfile);
router.put("/preferences", protect, updatePreferences);

router.post(
  "/avatar",
  protect,
  uploadRateLimiter,
  (req, res, next) => {
    imageUploader.single("avatar")(req, res, (err) => {
      if (err)
        return res.status(400).json({ msg: err.message || "Upload failed" });
      next();
    });
  },
  uploadAvatar,
);

router.delete("/unsync/:id", protect, unsyncConnection);

export default router;
