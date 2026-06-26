import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    description: {
      type: String,
      default: "",
      maxlength: 1000,
    },

    genre: {
      type: String,
      default: "",
      trim: true,
    },

    // Music-specific metadata — these fields are what make this a
    // music platform rather than a generic project tool.
    bpm: {
      type: Number,
      min: 40,
      max: 300,
      default: null,
    },

    musicalKey: {
      type: String,
      default: "",
      trim: true,
    },

    // Cloudinary URL for the project cover/artwork
    coverImage: {
      type: String,
      default: "",
    },

    coverImagePublicId: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["Planning", "Recording", "Production", "Mixing", "Completed"],
      default: "Planning",
    },

    // Legacy field — keep for backward compatibility, no longer primary
    audioUrl: {
      type: String,
      default: "",
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    collaborators: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    neededRoles: {
      type: [String],
      default: [],
    },

    tags: {
      type: [String],
      default: [],
    },

    lookingForCollaborators: {
      type: Boolean,
      default: true,
    },

    isPublic: {
      type: Boolean,
      default: true,
    },

    // Soft-delete — never hard-delete projects, just hide them.
    // Makes "undo" and audit trails possible.
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// Exclude soft-deleted projects from all finds by default.
// A controller can opt out with .find({ deletedAt: { $ne: null } }) if needed.
projectSchema.pre(/^find/, function () {
  if (!this.getFilter().deletedAt) {
    this.where({ deletedAt: null });
  }
});

projectSchema.index({ owner: 1, createdAt: -1 });
projectSchema.index({ genre: 1 });
projectSchema.index({ tags: 1 });
projectSchema.index({ lookingForCollaborators: 1, status: 1 });

export default mongoose.model("Project", projectSchema);
