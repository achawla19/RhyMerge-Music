import User from "../models/user.js";

export const searchUsers = async (req, res) => {
  try {
    const { q, role, genre } = req.query;

    let query = {};

    if (q) {
      query.$or = [
        { username: { $regex: q, $options: "i" } },
        { role: { $regex: q, $options: "i" } },
      ];
    }

    if (role) {
      query.role = role;
    }

    if (genre) {
      query.genres = genre;
    }

    const users = await User.find(query).select("-password");

    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};
