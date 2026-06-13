import User from "../models/user.js";
import Project from "../models/project.js";

export const globalSearch = async (req, res) => {
  try {
    const q = req.query.q || "";

    if (!q.trim()) {
      return res.json({
        users: [],
        projects: [],
      });
    }

    const users = await User.find({
      $or: [
        { username: { $regex: q, $options: "i" } },
        { name: { $regex: q, $options: "i" } },
        { role: { $regex: q, $options: "i" } },
      ],
    })
      .select("username name avatar role")
      .limit(5);

    const projects = await Project.find({
      $or: [
        {
          title: {
            $regex: q,
            $options: "i",
          },
        },
        {
          genre: {
            $regex: q,
            $options: "i",
          },
        },
      ],
    })
      .populate("owner", "username avatar")
      .limit(5);

    res.json({
      users,
      projects,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      msg: "Search failed",
    });
  }
};
