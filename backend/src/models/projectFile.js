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

    // Cloudinary secure URL — always HTTPS, CDN-served
    url: {
      type: String,
      required: true,
    },

    // Cloudinary public_id needed to delete the asset from CDN.
    // Without this we can delete the DB record but leave a ghost file
    // burning storage quota forever.
    cloudinaryPublicId: {
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

    // Bytes
    fileSize: {
      type: Number,
      required: true,
    },

    // Duration in seconds — populated by Cloudinary metadata response
    duration: {
      type: Number,
      default: null,
    },

    notes: {
      type: String,
      default: "",
      maxlength: 300,
    },

    // Stem version tracking — v1, v2, v3...
    version: {
      type: Number,
      default: 1,
      min: 1,
    },

    // What kind of stem is this?
    stemType: {
      type: String,
      enum: [
        "vocals",
        "drums",
        "bass",
        "melody",
        "guitar",
        "keys",
        "fx",
        "full",
        "other",
      ],
      default: "other",
    },
  },
  { timestamps: true },
);

projectFileSchema.index({ project: 1, createdAt: -1 });
projectFileSchema.index({ uploader: 1 });

export default mongoose.model("ProjectFile", projectFileSchema);
