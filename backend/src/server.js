import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import http from "http";

import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import connectionRoutes from "./routes/connectionRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";
import savedProjectRoutes from "./routes/savedProjectRoutes.js";
import projectRequestRoutes from "./routes/projectRequestRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import recommendationRoutes from "./routes/recommendationRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import projectFileRoutes from "./routes/projectFilesRoutes.js";

import { initSocket } from "./socket/index.js";

dotenv.config();
connectDB();

const app = express();

// CORS origin is now configurable via env instead of hardcoded, so this
// doesn't silently break (or get loosened to "*" as a quick fix) the
// moment this is deployed somewhere other than localhost:5173.
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);

app.use(cookieParser());
app.use(express.json());

// Serves uploaded message attachments (audio files) at /uploads/messages/<file>.
// Note: these files are NOT encrypted at rest, unlike message text — text
// goes through AES-256-GCM before touching the database, but the binary
// audio files themselves sit as plain files on disk. Encrypting/decrypting
// a streamed audio file on every playback request is a meaningfully bigger
// piece of work (no simple way to seek/stream an encrypted file without
// decrypting it server-side on every request); flagging this clearly as a
// known scope boundary rather than leaving it unmentioned.
app.use("/uploads", express.static("uploads"));

// 🔥 ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/connections", connectionRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/saved-projects", savedProjectRoutes);
app.use("/api/project-requests", projectRequestRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/project-files", projectFileRoutes);
app.get("/", (req, res) => {
  res.send("API Running");
});

// Socket.io needs a raw http.Server to attach to — express's app.listen()
// creates one internally but doesn't expose it, so we create it explicitly
// here and hand it to both Express and Socket.io.
const httpServer = http.createServer(app);
initSocket(httpServer);

const PORT = process.env.PORT;

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
