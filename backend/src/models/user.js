import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: String,
    email: String,
    password: String,

    role: {
      type: String,
      default: "Music Creator",
    },
    location: String,
    avatar: String,

    bio: String,
    genre: String,
    instruments: [String],

    connections: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);
