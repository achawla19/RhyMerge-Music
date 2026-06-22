import mongoose from "mongoose";

const projectFileSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    uploader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    filename: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },
    notes: {
      type: String,
      default: "",
      maxlength: 300,
    },
  },
  { timestamps: true },
);

projectFileSchema.index({ project: 1, createdAt: 1 });

export default mongoose.model("ProjectFile", projectFileSchema);
