import mongoose from "mongoose";

/**
 * A CollabPost is NOT a job listing — there's no employer/applicant
 * relationship here. It's how someone signals "I'm working on X, I need
 * a Y" — a producer looking for a vocalist, a lyricist looking for a
 * beatmaker, a singer looking for a guitarist. Anyone can reach out;
 * nobody is "hired." Framing (field names, copy) should stay peer-level
 * throughout — see collabController.js for the same principle applied
 * to the API layer.
 */
const collabPostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    description: {
      type: String,
      required: true,
      maxlength: 2000,
    },

    // The kind of collaborator being sought — reuses the same role
    // vocabulary as profiles (Producer, Vocalist, Mix Engineer, etc.)
    lookingFor: {
      type: String,
      required: true,
      trim: true,
    },

    genres: {
      type: [String],
      default: [],
    },

    // How this collab is arranged — deliberately not "compensation" or
    // "salary." Most music collabs run on splits or credit, not payroll.
    terms: {
      type: String,
      enum: ["Paid", "Revenue Split", "Credit Only", "Just for Fun"],
      default: "Revenue Split",
    },

    // Free text so people can say "$100 flat", "50/50 split", "TBD" —
    // whatever actually fits how musicians talk about this.
    termsNote: {
      type: String,
      default: "",
      trim: true,
      maxlength: 60,
    },

    locationType: {
      type: String,
      enum: ["Remote", "In-person", "Either"],
      default: "Remote",
    },

    location: {
      type: String,
      default: "",
      trim: true,
      maxlength: 100,
    },

    skillsNeeded: {
      type: [String],
      default: [],
    },

    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // "Collaborating" (not "Filled") — this isn't a position being closed,
    // it's a pairing that's already happening.
    status: {
      type: String,
      enum: ["Open", "Collaborating", "Closed"],
      default: "Open",
    },

    responsesCount: {
      type: Number,
      default: 0,
    },

    // Soft-delete, same pattern as Project/User.
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

collabPostSchema.pre(/^find/, function () {
  if (!this.getFilter().deletedAt) {
    this.where({ deletedAt: null });
  }
});

collabPostSchema.index({ postedBy: 1, createdAt: -1 });
collabPostSchema.index({ lookingFor: 1, status: 1 });
collabPostSchema.index({ genres: 1 });
collabPostSchema.index({ status: 1, createdAt: -1 });

export default mongoose.model("CollabPost", collabPostSchema);
