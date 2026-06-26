import User from "../models/user.js";
import Post from "../models/post.js";
import { escapeRegex } from "../utils/sanitize.js";
import { deleteFromCloudinary } from "../middleware/upload.js";

// ── GET ALL (paginated) ───────────────────────────────────────────────────────
export const getAllUsers = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 20);
    const users = await User.find()
      .select("-password")
      .skip((page - 1) * limit)
      .limit(limit);
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch users" });
  }
};

// ── SEARCH ────────────────────────────────────────────────────────────────────
export const searchUsers = async (req, res) => {
  try {
    const clean = (v) => (!v || v === "null" ? "" : v);
    const q = escapeRegex(clean(req.query.q));
    const role = clean(req.query.role);
    const genre = clean(req.query.genre);
    const availability = clean(req.query.availability);

    const filter = {};

    if (q.trim()) {
      filter.$or = [
        { username: { $regex: q, $options: "i" } },
        { name: { $regex: q, $options: "i" } },
        { role: { $regex: q, $options: "i" } },
      ];
    }
    if (role) filter.role = { $regex: escapeRegex(role), $options: "i" };
    if (genre) filter.genres = { $in: [new RegExp(escapeRegex(genre), "i")] };
    if (availability) filter.availability = availability;

    const users = await User.find(filter).select("-password").limit(60);
    res.json(users);
  } catch (err) {
    console.error("searchUsers:", err);
    res.status(500).json({ msg: "Search failed" });
  }
};

// ── GET BY USERNAME ───────────────────────────────────────────────────────────
export const getUserByUsername = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .select("-password")
      .populate("connections", "username name role avatar");

    if (!user) return res.status(404).json({ msg: "User not found" });

    const postsCount = await Post.countDocuments({ author: user._id });

    return res.json({
      user: {
        ...user.toObject(),
        connectionsCount: user.connections.length,
        postsCount,
        projectsCount: 0, // filled in by separate /projects/user/:username query
      },
    });
  } catch (err) {
    return res.status(500).json({ msg: "Failed to fetch user profile" });
  }
};

// ── UPDATE PROFILE ────────────────────────────────────────────────────────────
export const updateMyProfile = async (req, res) => {
  try {
    const {
      name,
      username,
      role,
      bio,
      genres,
      location,
      instruments,
      certificates,
      experienceLevel,
      availability,
    } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    // Username uniqueness check — only run if actually changing it
    if (username && username !== user.username) {
      const taken = await User.findOne({ username });
      if (taken) return res.status(400).json({ msg: "Username already taken" });
      user.username = username.trim();
    }

    if (name !== undefined) user.name = name.trim();
    if (role !== undefined) user.role = role;
    if (bio !== undefined) user.bio = bio.slice(0, 500);
    if (Array.isArray(genres)) user.genres = genres;
    if (location !== undefined) user.location = location;
    if (Array.isArray(instruments)) user.instruments = instruments;
    if (Array.isArray(certificates)) user.certificates = certificates;
    if (experienceLevel !== undefined) user.experienceLevel = experienceLevel;
    if (availability !== undefined) user.availability = availability;

    await user.save({ validateModifiedOnly: true });

    const updated = await User.findById(user._id).select("-password");
    return res.json({ user: updated });
  } catch (err) {
    console.error("updateMyProfile:", err);
    if (err.name === "ValidationError" || err.name === "CastError") {
      return res.status(400).json({ msg: "Invalid profile data" });
    }
    return res.status(500).json({ msg: "Failed to update profile" });
  }
};

// ── UPLOAD AVATAR ─────────────────────────────────────────────────────────────
export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ msg: "No image uploaded" });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    // Delete old avatar from Cloudinary
    if (user.avatarPublicId) {
      await deleteFromCloudinary(user.avatarPublicId, "image");
    }

    user.avatar = req.file.path; // Cloudinary secure URL
    user.avatarPublicId = req.file.filename; // public_id
    await user.save({ validateModifiedOnly: true });

    res.json({ avatar: user.avatar });
  } catch (err) {
    console.error("uploadAvatar:", err);
    res.status(500).json({ msg: "Failed to update avatar" });
  }
};

// ── UNSYNC (remove connection) ────────────────────────────────────────────────
export const unsyncConnection = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const targetId = req.params.id;

    if (currentUserId === targetId) {
      return res.status(400).json({ msg: "Cannot unsync with yourself" });
    }

    const [currentUser, targetUser] = await Promise.all([
      User.findById(currentUserId),
      User.findById(targetId),
    ]);

    if (!targetUser) return res.status(404).json({ msg: "User not found" });

    currentUser.connections = currentUser.connections.filter(
      (id) => id.toString() !== targetId,
    );
    targetUser.connections = targetUser.connections.filter(
      (id) => id.toString() !== currentUserId,
    );

    await Promise.all([
      currentUser.save({ validateModifiedOnly: true }),
      targetUser.save({ validateModifiedOnly: true }),
    ]);

    res.json({ msg: "Unsynced successfully" });
  } catch (err) {
    console.error("unsyncConnection:", err);
    res.status(500).json({ msg: "Failed to unsync" });
  }
};
