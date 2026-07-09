import "./config/env.js";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";

import connectDB from "./config/db.js";
import {
  applySecurityMiddleware,
  globalErrorHandler,
} from "./middleware/security.js";
import { generalRateLimiter } from "./middleware/rateLimiter.js";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
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
import authSecurityRoutes from "./routes/authSecurityRoutes.js";
import aiInsightRoutes from "./routes/aiInsightRoutes.js";
import messageAttachmentRoutes from "./routes/messageAttachmentRoutes.js";
import trendingRoutes from "./routes/trendingRoutes.js";

import { initSocket } from "./socket/index.js";

connectDB();

const app = express();

// ── 1. CORS ───────────────────────────────────────────────────────────────────
const ALLOWED_ORIGINS = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((o) => o.trim());

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
      cb(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true,
  }),
);

// ── 2. Cookie parser — must be before protect middleware ──────────────────────
app.use(cookieParser());

// ── 3. Attachment route — BEFORE express.json() and mongoSanitize ─────────────
// express.json() + mongoSanitize consume/mutate the request stream.
// Multer needs the raw multipart stream so this route must come first.
app.use("/api/message-attachments", messageAttachmentRoutes);

// ── 4. Security headers + sanitization ───────────────────────────────────────
applySecurityMiddleware(app);

// ── 5. Body parsers ───────────────────────────────────────────────────────────
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// ── 6. General rate limiter ───────────────────────────────────────────────────
app.use("/api", generalRateLimiter);

// ── 7. Health check ───────────────────────────────────────────────────────────
app.get("/", (req, res) => res.json({ status: "ok", service: "RhyMerge API" }));

// ── 8. API routes ─────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/auth", authSecurityRoutes);
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
app.use("/api/ai-insights", aiInsightRoutes);
app.use("/api/trending", trendingRoutes);
// ── 9. 404 ────────────────────────────────────────────────────────────────────
app.use((req, res) => res.status(404).json({ msg: "Route not found" }));

// ── 10. Global error handler ──────────────────────────────────────────────────
app.use(globalErrorHandler);

// ── 11. HTTP server + Socket.io ───────────────────────────────────────────────
const httpServer = http.createServer(app);
initSocket(httpServer);

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => console.log(`RhyMerge API running on :${PORT}`));
