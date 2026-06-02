import User from "../models/user.js";

export const searchUsers = async (req, res) => {
  try {
    const { q, role, genre } = req.query;

    let query = {};

    if (q) {
      query.$or = [
        { username: { $regex: q, $options: "i" } },
        { name: { $regex: q, $options: "i" } },
        { bio: { $regex: q, $options: "i" } },
      ];
    }

    if (role) query.role = role;
    if (genre) query.genres = genre;

    const users = await User.find(query).select("-password").limit(20);

    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: "Search failed" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};
