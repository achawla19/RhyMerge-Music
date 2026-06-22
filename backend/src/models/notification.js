import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    type: {
      type: String,
      enum: [
        "project_request",
        "request_accepted",
        "request_rejected",

        "connection_request",
        "connection_accepted",

        "message",

        "recommendation",

        "ai_insight",

        "project_match",

        "system",
      ],
      required: true,
    },

    title: {
      type: String,
    },

    description: {
      type: String,
    },

    link: {
      type: String,
    },

    priority: {
      type: Number,
      default: 2,
    },

    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },

    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Notification", notificationSchema);
