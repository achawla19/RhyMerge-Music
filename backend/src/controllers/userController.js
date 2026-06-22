import User from "../models/user.js";
import Post from "../models/post.js";
import { escapeRegex } from "../utils/sanitize.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch users" });
  }
};

export const searchUsers = async (req, res) => {
  try {
    const clean = (v) => (!v || v === "null" ? "" : v);

    // Escaped before $regex — see escapeRegex for why (ReDoS protection)
    const q = escapeRegex(clean(req.query.q));
    const role = clean(req.query.role);
    const genre = clean(req.query.genre);

    const filter = {};

    if (q.trim()) {
      filter.$or = [
        { username: { $regex: q, $options: "i" } },
        { name: { $regex: q, $options: "i" } },
        { role: { $regex: q, $options: "i" } },
      ];
    }

    if (role) {
      filter.role = role;
    }

    if (genre) {
      filter.genres = { $in: [genre] };
    }

    const users = await User.find(filter).select("-password");

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Search failed" });
  }
};

export const getUserByUsername = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username })
      .select("-password")
      .populate("connections", "username name role avatar");

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const postsCount = await Post.countDocuments({ author: user._id });

    return res.json({
      user: {
        ...user.toObject(),
        connectionsCount: user.connections.length,
        postsCount,
        projectsCount: 0,
      },
    });
  } catch (err) {
    return res.status(500).json({ msg: "Failed to fetch user profile" });
  }
};

export const updateMyProfile = async (req, res) => {
  try {
    const {
      name,
      username,
      role,
      bio,
      genres,
      avatar,
      location,
      instruments,
      certificates,
      experienceLevel,
      availability,
    } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    if (username && username !== user.username) {
      const existing = await User.findOne({ username });
      if (existing) {
        return res.status(400).json({ msg: "Username already taken" });
      }
      user.username = username.trim();
    }

    if (name !== undefined) user.name = name.trim();
    if (role !== undefined) user.role = role;
    if (bio !== undefined) user.bio = bio;
    if (Array.isArray(genres)) user.genres = genres;
    if (avatar !== undefined) user.avatar = avatar;
    if (location !== undefined) user.location = location;
    if (Array.isArray(instruments)) user.instruments = instruments;

    if (Array.isArray(certificates)) user.certificates = certificates;

    if (experienceLevel !== undefined) user.experienceLevel = experienceLevel;

    if (availability !== undefined) user.availability = availability;
    // validateModifiedOnly: only re-validate fields this request actually
    // changed — a corrupted legacy value in an unrelated field (e.g. an old
    // bad connection-request entry) should never block a profile update.
    await user.save({ validateModifiedOnly: true });

    const updatedUser = await User.findById(user._id).select("-password");

    return res.json({ user: updatedUser });
  } catch (err) {
    // Full detail logged server-side only — never sent to the client.
    // Leaking raw Mongoose/CastError messages can expose internal field
    // names, schema structure, and document IDs to anyone calling the API.
    console.error("updateMyProfile error:", err);

    if (err.name === "ValidationError" || err.name === "CastError") {
      return res
        .status(400)
        .json({
          msg: "Some of your profile data could not be saved. Please try again or contact support.",
        });
    }

    return res.status(500).json({ msg: "Failed to update profile" });
  }
};
