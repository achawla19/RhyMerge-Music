import Project from "../models/project.js";
import User from "../models/user.js";

export const createProject = async (req, res) => {
  try {
    const { title, description, genre, neededRoles, lookingForCollaborators } =
      req.body;

    const project = await Project.create({
      title,
      description,
      genre,
      neededRoles: neededRoles || [],
      lookingForCollaborators:
        lookingForCollaborators !== undefined ? lookingForCollaborators : true,
      owner: req.user.id,
    });

    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({
      msg: "Failed to create project",
    });
  }
};

export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("owner", "username name avatar role")
      .populate("collaborators", "username name avatar role")
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (err) {
    res.status(500).json({
      msg: "Failed to fetch projects",
    });
  }
};

export const getProjectsByUsername = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({
        msg: "User not found",
      });
    }

    const projects = await Project.find({
      owner: user._id,
    })
      .populate("owner", "username name avatar")
      .populate("collaborators", "username name avatar")
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (err) {
    res.status(500).json({
      msg: "Failed to fetch projects",
    });
  }
};

export const searchProjects = async (req, res) => {
  try {
    const clean = (v) => (!v || v === "null" || v === "undefined" ? "" : v);

    const q = clean(req.query.q);
    const genre = clean(req.query.genre);

    const filter = {};

    if (q) {
      filter.$or = [
        {
          title: {
            $regex: q,
            $options: "i",
          },
        },
        {
          description: {
            $regex: q,
            $options: "i",
          },
        },
      ];
    }

    if (genre) {
      filter.genre = genre;
    }

    const projects = await Project.find(filter)
      .populate("owner", "username avatar")
      .populate("collaborators", "username avatar")
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (err) {
    res.status(500).json({ msg: "Search failed" });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("owner", "username avatar role")
      .populate("collaborators", "username avatar role");

    if (!project) {
      return res.status(404).json({
        msg: "Project not found",
      });
    }

    res.json(project);
  } catch (err) {
    res.status(500).json({
      msg: "Failed to fetch project",
    });
  }
};
