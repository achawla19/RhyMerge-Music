import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { isSafeString } from "../utils/sanitize.js";

const cookieOpts = (maxAge) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge,
});

// ── LOGIN ─────────────────────────────────────────────────────────────────────
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!isSafeString(email) || !isSafeString(password)) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "30d" },
    );

    res.cookie("token", token, cookieOpts(1000 * 60 * 60 * 24 * 7));
    res.cookie(
      "refreshToken",
      refreshToken,
      cookieOpts(1000 * 60 * 60 * 24 * 30),
    );

    // Return token in body so frontend can store it in memory for
    // Socket.io auth (browsers like Brave block cookies on WS upgrade).
    // This token is NEVER stored in localStorage — only JS memory.
    res.json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        name: user.name,
      },
    });
  } catch (err) {
    console.error("login:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

// ── REGISTER ──────────────────────────────────────────────────────────────────
export const register = async (req, res) => {
  try {
    const { username, name, email, password, role } = req.body;

    if (
      !isSafeString(username) ||
      !isSafeString(name) ||
      !isSafeString(email) ||
      !isSafeString(password)
    ) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    if (username.length < 3) {
      return res
        .status(400)
        .json({ msg: "Username must be at least 3 characters" });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res
        .status(400)
        .json({ msg: "Please enter a valid email address" });
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password)) {
      return res.status(400).json({
        msg: "Password must be 8+ characters with uppercase, lowercase and a number",
      });
    }

    if (await User.findOne({ email })) {
      return res.status(400).json({ msg: "Email already registered" });
    }
    if (await User.findOne({ username })) {
      return res.status(400).json({ msg: "Username already taken" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashed,
      name,
      role,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, cookieOpts(1000 * 60 * 60 * 24 * 7));

    res.json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        name: user.name,
      },
    });
  } catch (err) {
    console.error("register:", err);
    res.status(500).json({ msg: "Something went wrong. Please try again." });
  }
};

// ── REFRESH ───────────────────────────────────────────────────────────────────
export const refresh = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ msg: "Not logged in" });

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ msg: "User not found" });

    // Issue a fresh access token and return it in the body
    // so the frontend can refresh its memory token too
    const newToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", newToken, cookieOpts(1000 * 60 * 60 * 24 * 7));

    res.json({ token: newToken, user });
  } catch (err) {
    res.status(401).json({ msg: "Invalid token" });
  }
};

// ── LOGOUT ────────────────────────────────────────────────────────────────────
export const logout = (req, res) => {
  res.clearCookie("token", {
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production",
  });
  res.clearCookie("refreshToken", {
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production",
  });
  res.json({ msg: "Logged out" });
};

// ── GET ME ────────────────────────────────────────────────────────────────────
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("getMe:", err);
    res.status(500).json({ msg: "Server error" });
  }
};
