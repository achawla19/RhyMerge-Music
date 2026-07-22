import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 60,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: { type: String, default: "", trim: true },

    bio: { type: String, default: "", maxlength: 500 },

    // Cloudinary secure URL
    avatar: { type: String, default: "" },

    // Needed to delete the old avatar from CDN on update
    avatarPublicId: { type: String, default: "" },

    genres: { type: [String], default: [] },
    instruments: { type: [String], default: [] },
    certificates: { type: [String], default: [] },

    location: { type: String, default: "", trim: true },

    experienceLevel: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced", "Professional"],
      default: "Beginner",
    },

    availability: {
      type: String,
      enum: ["Available", "Busy", "Not Looking"],
      default: "Available",
    },

    // Social links (optional — shown on profile)
    socials: {
      instagram: { type: String, default: "" },
      soundcloud: { type: String, default: "" },
      spotify: { type: String, default: "" },
      youtube: { type: String, default: "" },
      website: { type: String, default: "" },
    },

    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    connections: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    sentRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    receivedRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    savedProjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],

    // User preferences — Appearance + Notifications settings
    preferences: {
      accentColor: {
        type: String,
        enum: ["#7C3AED", "#EC4899", "#3B82F6", "#10B981", "#F59E0B"],
        default: "#7C3AED",
      },
      notifications: {
        email: { type: Boolean, default: true },
        push: { type: Boolean, default: false },
        connectionRequests: { type: Boolean, default: true },
        messages: { type: Boolean, default: true },
      },
      privacy: {
        profileVisible: { type: Boolean, default: true },
        showEmail: { type: Boolean, default: false },
        messagePermission: {
          type: String,
          enum: ["everyone", "connections", "nobody"],
          default: "everyone",
        },
        projectVisibility: {
          type: String,
          enum: ["everyone", "connections", "nobody"],
          default: "everyone",
        },
      },
    },

    // Soft-delete
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

userSchema.index({ role: 1 });
userSchema.index({ genres: 1 });

userSchema.pre(/^find/, function () {
  if (!this.getFilter().deletedAt) {
    this.where({ deletedAt: null });
  }
});

export default mongoose.model("User", userSchema);
