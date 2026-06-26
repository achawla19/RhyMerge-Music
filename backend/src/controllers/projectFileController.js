import ProjectFile from "../models/projectFile.js";
import Project from "../models/project.js";
import { deleteFromCloudinary } from "../middleware/upload.js";
import { createNotification } from "../utils/createNotification.js";

const isProjectMember = (project, userId) =>
  project.owner.toString() === userId ||
  project.collaborators.some((c) => c.toString() === userId);

// ── GET PROJECT FILES ─────────────────────────────────────────────────────────
export const getProjectFiles = async (req, res) => {
  try {
    const files = await ProjectFile.find({ project: req.params.projectId })
      .sort({ createdAt: -1 })
      .populate("uploader", "username avatar");

    res.json(files);
  } catch (err) {
    console.error("getProjectFiles:", err);
    res.status(500).json({ msg: "Failed to load files" });
  }
};

// ── UPLOAD STEM ───────────────────────────────────────────────────────────────
export const uploadProjectFile = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({ msg: "Project not found" });
    }

    if (!isProjectMember(project, req.user.id)) {
      return res
        .status(403)
        .json({ msg: "Only project members can upload stems" });
    }

    if (!req.file) {
      return res.status(400).json({ msg: "No file uploaded" });
    }

    // Cloudinary returns metadata on req.file when using multer-storage-cloudinary
    const {
      path: url,
      filename: cloudinaryPublicId,
      originalname,
      mimetype,
      size,
    } = req.file;

    // Duration comes from Cloudinary's audio processing metadata
    // It's available on req.file if you configure eager transformations,
    // otherwise we'll get it from the Cloudinary resource info
    const duration = req.file.duration || null;

    const file = await ProjectFile.create({
      project: project._id,
      uploader: req.user.id,
      url,
      cloudinaryPublicId,
      filename: originalname,
      fileType: mimetype,
      fileSize: size,
      duration,
      notes: req.body.notes?.slice(0, 300) || "",
      stemType: req.body.stemType || "other",
      version: Number(req.body.version) || 1,
    });

    const populated = await file.populate("uploader", "username avatar");

    // Notify all other project members that a new stem was uploaded
    const allMemberIds = [
      project.owner.toString(),
      ...project.collaborators.map((c) => c.toString()),
    ].filter((id) => id !== req.user.id);

    await Promise.allSettled(
      allMemberIds.map((memberId) =>
        createNotification({
          recipient: memberId,
          sender: req.user.id,
          type: "system",
          title: "New Stem Uploaded",
          description: `A new stem was added to "${project.title}"`,
          link: `/projects/${project._id}`,
          project: project._id,
          priority: 2,
        }),
      ),
    );

    res.status(201).json(populated);
  } catch (err) {
    console.error("uploadProjectFile:", err);
    res.status(500).json({ msg: "Failed to upload file" });
  }
};

// ── DELETE STEM ───────────────────────────────────────────────────────────────
export const deleteProjectFile = async (req, res) => {
  try {
    const file = await ProjectFile.findById(req.params.fileId).populate(
      "project",
    );

    if (!file) return res.status(404).json({ msg: "File not found" });

    const isUploader = file.uploader.toString() === req.user.id;
    const isOwner = file.project.owner.toString() === req.user.id;

    if (!isUploader && !isOwner) {
      return res
        .status(403)
        .json({ msg: "Not authorized to delete this file" });
    }

    // Delete from Cloudinary first — if this fails we log it but continue,
    // because the DB record is the source of truth for what the user sees.
    if (file.cloudinaryPublicId) {
      await deleteFromCloudinary(file.cloudinaryPublicId, "video");
    }

    await file.deleteOne();
    res.json({ msg: "Stem deleted" });
  } catch (err) {
    console.error("deleteProjectFile:", err);
    res.status(500).json({ msg: "Failed to delete file" });
  }
};
