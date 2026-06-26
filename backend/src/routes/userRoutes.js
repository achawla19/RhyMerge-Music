import express from "express";
import {
  searchUsers,
  getAllUsers,
  getUserByUsername,
  updateMyProfile,
  uploadAvatar,
  unsyncConnection,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import { imageUploader } from "../middleware/upload.js";
import { uploadRateLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.get("/search", searchUsers);
router.get("/all", getAllUsers);
router.get("/:username", getUserByUsername);

router.put("/profile", protect, updateMyProfile);

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
