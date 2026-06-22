import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { isSafeString } from "../utils/sanitize.js";

// ================= LOGIN =================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Reject anything that isn't a plain string BEFORE it ever reaches
    // a Mongoose query. Without this, a crafted body like
    // { "email": { "$ne": null } } gets parsed by express.json() into a
    // real object, and User.findOne({ email }) would treat it as a
    // Mongo query operator instead of a value to match against.
    if (!isSafeString(email) || !isSafeString(password)) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // FIND USER
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        msg: "Invalid credentials",
      });
    }

    // CHECK PASSWORD
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        msg: "Invalid credentials",
      });
    }

    // ACCESS TOKEN
    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    // REFRESH TOKEN
    const refreshToken = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_REFRESH_SECRET,
      {
        expiresIn: "30d",
      },
    );

    // COOKIE
    res.cookie("token", token, {
      httpOnly: true,

      secure: process.env.NODE_ENV === "production", // true (HTTPS-only) in prod, false for local http dev

      sameSite: "lax",

      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // true (HTTPS-only) in prod, false for local http dev
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24 * 30,
    });

    // RETURN TOKEN + USER
    res.json({
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      msg: "Server error",
    });
  }
};

// ================= REGISTER =================
export const register = async (req, res) => {
  try {
    const { username, name, email, password, role } = req.body;

    // Validate every field is actually a string before using it anywhere
    // (including in the later findOne() duplicate-checks) — same
    // NoSQL-injection concern as login() above.
    if (
      !isSafeString(username) ||
      !isSafeString(name) ||
      !isSafeString(email) ||
      !isSafeString(password)
    ) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    // USERNAME
    if (username.length < 3) {
      return res.status(400).json({
        msg: "Username must be at least 3 characters",
      });
    }

    // EMAIL
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        msg: "Please enter a valid email address",
      });
    }

    // PASSWORD
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        msg: "Password must be at least 8 characters long and contain uppercase, lowercase and a number",
      });
    }

    const existingEmail = await User.findOne({ email });

    if (existingEmail) {
      return res.status(400).json({
        msg: "Email already registered",
      });
    }

    const existingUsername = await User.findOne({
      username,
    });

    if (existingUsername) {
      return res.status(400).json({
        msg: "Username already taken",
      });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashed,
      name,
      role,
    });
    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // true (HTTPS-only) in prod, false for local http dev
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    res.json({
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      msg: "Something went wrong. Please try again.",
    });
  }
};

// ================= REFRESH =================
export const refresh = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      return res.status(401).json({ msg: "Not logged in" });
    }

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    res.json({ user });
  } catch (err) {
    res.status(401).json({ msg: "Invalid token" });
  }
};

// ================= LOGOUT =================
export const logout = (req, res) => {
  res.clearCookie("token");
  res.clearCookie("refreshToken");

  res.json({
    msg: "Logged out",
  });
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        msg: "User not found",
      });
    }

    res.json(user);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      msg: "Server error",
    });
  }
};
