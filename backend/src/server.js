import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

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

dotenv.config();
connectDB();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(cookieParser());
app.use(express.json());

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
app.get("/", (req, res) => {
  res.send("API Running");
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
