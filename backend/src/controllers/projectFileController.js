import fs from "fs";
import path from "path";
import ProjectFile from "../models/projectFile.js";
import Project from "../models/project.js";

const isProjectMember = (project, userId) =>
  project.owner.toString() === userId ||
  project.collaborators.some((c) => c.toString() === userId);

// GET /api/project-files/:projectId
// Visible to anyone (matches getProjectById, which is also public) —
// the project page itself isn't gated, so its stems shouldn't be either.
export const getProjectFiles = async (req, res) => {
  try {
    const files = await ProjectFile.find({ project: req.params.projectId })
      .sort({ createdAt: 1 })
      .populate("uploader", "username avatar");

    res.json(files);
  } catch (err) {
    console.error("getProjectFiles error:", err);
    res.status(500).json({ msg: "Failed to load files" });
  }
};

// POST /api/project-files/:projectId
// Only the project owner or an accepted collaborator can upload a stem —
// this is the gate that actually matters, since random visitors
// shouldn't be able to add audio to someone else's project.
export const uploadProjectFile = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) {
      // Clean up the file multer already wrote to disk before we knew
      // the project didn't exist — otherwise it's an orphaned file forever.
      if (req.file) fs.unlink(req.file.path, () => {});
      return res.status(404).json({ msg: "Project not found" });
    }

    if (!isProjectMember(project, req.user.id)) {
      if (req.file) fs.unlink(req.file.path, () => {});
      return res
        .status(403)
        .json({ msg: "Only project members can upload stems" });
    }

    if (!req.file) {
      return res.status(400).json({ msg: "No file uploaded" });
    }

    const file = await ProjectFile.create({
      project: project._id,
      uploader: req.user.id,
      url: `/uploads/stems/${req.file.filename}`,
      filename: req.file.originalname,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      notes: req.body.notes || "",
    });

    const populated = await file.populate("uploader", "username avatar");
    res.status(201).json(populated);
  } catch (err) {
    console.error("uploadProjectFile error:", err);
    if (req.file) fs.unlink(req.file.path, () => {});
    res.status(500).json({ msg: "Failed to upload file" });
  }
};

// DELETE /api/project-files/:fileId
// The person who uploaded it, OR the project owner (e.g. to remove
// something that shouldn't be there) — nobody else.
export const deleteProjectFile = async (req, res) => {
  try {
    const file = await ProjectFile.findById(req.params.fileId).populate(
      "project",
    );
    if (!file) {
      return res.status(404).json({ msg: "File not found" });
    }

    const isUploader = file.uploader.toString() === req.user.id;
    const isOwner = file.project.owner.toString() === req.user.id;

    if (!isUploader && !isOwner) {
      return res
        .status(403)
        .json({ msg: "Not authorized to delete this file" });
    }

    const filePath = path.join("uploads", "stems", path.basename(file.url));
    fs.unlink(filePath, () => {}); // best-effort — don't fail the request if this errors

    await file.deleteOne();
    res.json({ msg: "Deleted" });
  } catch (err) {
    console.error("deleteProjectFile error:", err);
    res.status(500).json({ msg: "Failed to delete file" });
  }
};
