import Project from "../models/project.js";
import User from "../models/user.js";
import ProjectFile from "../models/projectFile.js";
import { escapeRegex, stripHtml } from "../utils/sanitize.js";
import { deleteFromCloudinary } from "../middleware/upload.js";

// ── CREATE ───────────────────────────────────────────────────────────────────
export const createProject = async (req, res) => {
  try {
    const {
      title,
      description,
      genre,
      bpm,
      musicalKey,
      neededRoles,
      tags,
      lookingForCollaborators,
      isPublic,
    } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({ msg: "Project title is required" });
    }

    const project = await Project.create({
      title: stripHtml(title).trim(),
      description: stripHtml(description?.trim() || ""),
      genre: genre?.trim() || "",
      bpm: bpm ? Number(bpm) : null,
      musicalKey: musicalKey?.trim() || "",
      neededRoles: Array.isArray(neededRoles) ? neededRoles : [],
      tags: Array.isArray(tags) ? tags : [],
      lookingForCollaborators: lookingForCollaborators !== false,
      isPublic: isPublic !== false,
      owner: req.user.id,
      // Cover image handled separately via PATCH /api/projects/:id/cover
    });

    const populated = await Project.findById(project._id).populate(
      "owner",
      "username name avatar role",
    );

    res.status(201).json(populated);
  } catch (err) {
    console.error("createProject:", err);
    res.status(500).json({ msg: "Failed to create project" });
  }
};

// ── EDIT ─────────────────────────────────────────────────────────────────────
export const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) return res.status(404).json({ msg: "Project not found" });
    if (project.owner.toString() !== req.user.id)
      return res
        .status(403)
        .json({ msg: "Only the project owner can edit this" });

    const {
      title,
      description,
      genre,
      bpm,
      musicalKey,
      status,
      neededRoles,
      tags,
      lookingForCollaborators,
      isPublic,
    } = req.body;

    const VALID_STATUS = [
      "Planning",
      "Recording",
      "Production",
      "Mixing",
      "Completed",
    ];

    if (title !== undefined) project.title = stripHtml(title).trim();
    if (description !== undefined)
      project.description = stripHtml(description.trim());
    if (genre !== undefined) project.genre = genre.trim();
    if (bpm !== undefined) project.bpm = bpm ? Number(bpm) : null;
    if (musicalKey !== undefined) project.musicalKey = musicalKey.trim();
    if (status !== undefined && VALID_STATUS.includes(status))
      project.status = status;
    if (Array.isArray(neededRoles)) project.neededRoles = neededRoles;
    if (Array.isArray(tags)) project.tags = tags;
    if (lookingForCollaborators !== undefined)
      project.lookingForCollaborators = Boolean(lookingForCollaborators);
    if (isPublic !== undefined) project.isPublic = Boolean(isPublic);

    await project.save();

    const updated = await Project.findById(project._id)
      .populate("owner", "username name avatar role")
      .populate("collaborators", "username name avatar role");

    res.json(updated);
  } catch (err) {
    console.error("updateProject:", err);
    res.status(500).json({ msg: "Failed to update project" });
  }
};

// ── UPLOAD COVER IMAGE ───────────────────────────────────────────────────────
export const updateProjectCover = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ msg: "Project not found" });
    }
    if (project.owner.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ msg: "Only the owner can update the cover" });
    }
    if (!req.file) {
      return res.status(400).json({ msg: "No image uploaded" });
    }

    // Delete old cover from Cloudinary
    if (project.coverImagePublicId) {
      await deleteFromCloudinary(project.coverImagePublicId, "image");
    }

    project.coverImage = req.file.path; // Cloudinary secure URL
    project.coverImagePublicId = req.file.filename; // public_id from Cloudinary
    await project.save();

    res.json({ coverImage: project.coverImage });
  } catch (err) {
    console.error("updateProjectCover:", err);
    res.status(500).json({ msg: "Failed to update cover" });
  }
};

// ── SOFT DELETE ───────────────────────────────────────────────────────────────
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ msg: "Project not found" });
    if (project.owner.toString() !== req.user.id)
      return res
        .status(403)
        .json({ msg: "Only the project owner can delete this" });

    // Soft delete: set deletedAt, don't touch files yet
    // (owner might want to restore; hard-delete can be a scheduled job)
    project.deletedAt = new Date();
    await project.save({ validateModifiedOnly: true });

    res.json({ msg: "Project deleted" });
  } catch (err) {
    console.error("deleteProject:", err);
    res.status(500).json({ msg: "Failed to delete project" });
  }
};

// ── REMOVE COLLABORATOR ───────────────────────────────────────────────────────
export const removeCollaborator = async (req, res) => {
  try {
    const { id: projectId, userId } = req.params;
    const project = await Project.findById(projectId);

    if (!project) return res.status(404).json({ msg: "Project not found" });

    const isOwner = project.owner.toString() === req.user.id;
    const isSelf = userId === req.user.id;

    if (!isOwner && !isSelf) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    project.collaborators = project.collaborators.filter(
      (c) => c.toString() !== userId,
    );
    await project.save({ validateModifiedOnly: true });

    res.json({ msg: "Collaborator removed" });
  } catch (err) {
    console.error("removeCollaborator:", err);
    res.status(500).json({ msg: "Failed to remove collaborator" });
  }
};

// ── LIST ALL ──────────────────────────────────────────────────────────────────
export const getProjects = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 20);
    const skip = (page - 1) * limit;

    const [projects, total] = await Promise.all([
      Project.find({ isPublic: true })
        .populate("owner", "username name avatar role")
        .populate("collaborators", "username name avatar role")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Project.countDocuments({ isPublic: true }),
    ]);

    res.json({ projects, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    console.error("getProjects:", err);
    res.status(500).json({ msg: "Failed to fetch projects" });
  }
};

// ── GET BY ID ─────────────────────────────────────────────────────────────────
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("owner", "username avatar role name")
      .populate("collaborators", "username avatar role name");

    if (!project) return res.status(404).json({ msg: "Project not found" });

    res.json(project);
  } catch (err) {
    console.error("getProjectById:", err);
    res.status(500).json({ msg: "Failed to fetch project" });
  }
};

// ── GET BY USERNAME ───────────────────────────────────────────────────────────
export const getProjectsByUsername = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).json({ msg: "User not found" });

    const viewerId = req.user?.id;
    const isOwner = viewerId && viewerId === user._id.toString();
    const visibility =
      user.preferences?.privacy?.projectVisibility || "everyone";

    const allProjects = await Project.find({ owner: user._id })
      .populate("owner", "username name avatar")
      .populate("collaborators", "username name avatar")
      .sort({ createdAt: -1 });

    if (isOwner || visibility === "everyone") {
      return res.json(allProjects);
    }

    const isConnection =
      viewerId && user.connections.some((c) => c.toString() === viewerId);
    const canSeeAll = visibility === "connections" && isConnection;

    if (canSeeAll) return res.json(allProjects);

    // Even when the owner's default is restrictive, someone who's an
    // actual collaborator on a specific project can still see that one —
    // they're already part of it, hiding it from them on this view would
    // just be confusing, not more private.
    const visibleToCollaborators = viewerId
      ? allProjects.filter((p) =>
          p.collaborators.some((c) => c._id.toString() === viewerId),
        )
      : [];

    return res.json(visibleToCollaborators);
  } catch (err) {
    console.error("getProjectsByUsername:", err);
    res.status(500).json({ msg: "Failed to fetch projects" });
  }
};

// ── SEARCH ────────────────────────────────────────────────────────────────────
export const searchProjects = async (req, res) => {
  try {
    const clean = (v) => (!v || v === "null" || v === "undefined" ? "" : v);
    const q = escapeRegex(clean(req.query.q));
    const genre = clean(req.query.genre);
    const status = clean(req.query.status);
    const role = clean(req.query.role);

    const filter = { isPublic: true };

    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { tags: { $regex: q, $options: "i" } },
      ];
    }
    if (genre) filter.genre = { $regex: escapeRegex(genre), $options: "i" };
    if (status) filter.status = status;
    if (role)
      filter.neededRoles = { $in: [new RegExp(escapeRegex(role), "i")] };

    const projects = await Project.find(filter)
      .populate("owner", "username avatar")
      .populate("collaborators", "username avatar")
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(projects);
  } catch (err) {
    console.error("searchProjects:", err);
    res.status(500).json({ msg: "Search failed" });
  }
};
