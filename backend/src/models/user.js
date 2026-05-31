import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: String,
    name: String,
    email: String,
    role: String,
    bio: String,
    genres: [String],
    avatar: String,
    password: String,

    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    requests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);
