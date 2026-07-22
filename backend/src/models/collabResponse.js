import mongoose from "mongoose";

/**
 * Someone reaching out to collaborate on a CollabPost. Deliberately not
 * called "Application" — nobody is applying for a position, they're
 * expressing interest in working together. Status names follow the same
 * logic: "Accepted" means "let's do this," "Declined" means "not this
 * time," neither implies a hiring decision.
 */
const collabResponseSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CollabPost",
      required: true,
    },

    responder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    message: {
      type: String,
      default: "",
      maxlength: 1000,
    },

    status: {
      type: String,
      enum: ["Pending", "Accepted", "Declined"],
      default: "Pending",
    },
  },
  { timestamps: true },
);

// Not a hard-unique index — someone can reach out again after being
// declined, so the controller checks for an existing *pending* response
// rather than blocking a second attempt outright.
collabResponseSchema.index({ post: 1, responder: 1 });

export default mongoose.model("CollabResponse", collabResponseSchema);
