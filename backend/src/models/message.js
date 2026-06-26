import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Encrypted text content — always go through encryption.js, never raw
    content: {
      type: String,
      required: true,
      default: "",
    },

    // File attachment — stored as CDN URL + metadata.
    // The URL is a permanent Cloudinary URL — no expiry.
    // content is still required (even for attachment-only messages)
    // so we store an empty encrypted string for those.
    attachment: {
      url: { type: String, default: "" },
      name: { type: String, default: "" },
      type: { type: String, default: "" }, // MIME type
      size: { type: Number, default: 0 }, // bytes
    },

    isRead: { type: Boolean, default: false },
    readAt: { type: Date, default: null },
  },
  { timestamps: true },
);

messageSchema.index({ conversation: 1, createdAt: 1 });

export default mongoose.model("Message", messageSchema);
