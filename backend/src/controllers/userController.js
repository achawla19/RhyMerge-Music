import User from "../models/user.js";

// GET /api/users/search?q=&role=&genre=
export const searchUsers = async (req, res) => {
  try {
    const { q = "", role, genre } = req.query;

    const query = {};

    // 🔍 text search
    if (q) {
      query.$text = { $search: q };
    }

    if (role) {
      query.role = role;
    }

    if (genre) {
      query.genres = genre;
    }

    const users = await User.find(query)
      .select("username name role avatar genres bio")
      .limit(20);

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Search failed" });
  }
};
