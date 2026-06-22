import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    // Sorted, joined participant IDs (e.g. "664f...:665a...") — guarantees
    // exactly one conversation document can ever exist between any two
    // people, and makes "find the conversation between these two users"
    // a simple indexed lookup instead of an array-containment query.
    participantsKey: {
      type: String,
      required: true,
      unique: true,
    },
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },
    lastMessageAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

conversationSchema.index({ participants: 1 });
conversationSchema.index({ lastMessageAt: -1 });

export const buildParticipantsKey = (idA, idB) =>
  [String(idA), String(idB)].sort().join(":");

export default mongoose.model("Conversation", conversationSchema);
