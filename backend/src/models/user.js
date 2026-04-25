import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true },
    password: String,

    name: String,
    role: { type: String, default: "Music Creator", index: true },
    bio: String,
    genres: [{ type: String, index: true }],
    avatar: String,
  },
  { timestamps: true }
);

// 🔥 text index for search
userSchema.index({
  username: "text",
  name: "text",
  role: "text",
  bio: "text",
  genres: "text",
});

export default mongoose.model("User", userSchema);