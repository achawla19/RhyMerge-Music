import bcrypt from "bcryptjs";
import User from "../models/user.js";

// ── CHANGE PASSWORD ───────────────────────────────────────────────────────────
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ msg: "Both current and new password are required" });
    }

    if (newPassword.length < 8) {
      return res
        .status(400)
        .json({ msg: "New password must be at least 8 characters" });
    }

    if (currentPassword === newPassword) {
      return res
        .status(400)
        .json({ msg: "New password must be different from current" });
    }

    const user = await User.findById(req.user.id).select("+password");
    if (!user) return res.status(404).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Current password is incorrect" });
    }

    const salt = await bcrypt.genSalt(12);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save({ validateModifiedOnly: true });

    res.json({ msg: "Password updated successfully" });
  } catch (err) {
    console.error("changePassword:", err);
    res.status(500).json({ msg: "Failed to update password" });
  }
};

// ── DELETE ACCOUNT ────────────────────────────────────────────────────────────
export const deleteAccount = async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) {
      return res
        .status(400)
        .json({ msg: "Password is required to delete account" });
    }

    const user = await User.findById(req.user.id).select("+password");
    if (!user) return res.status(404).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Incorrect password" });
    }

    // Soft delete — keeps data integrity, can be reversed within 30 days
    user.deletedAt = new Date();
    user.email = `deleted_${user._id}@rhymerge.deleted`;
    await user.save({ validateModifiedOnly: true });

    // Clear auth cookies. NOTE: this previously cleared a cookie named
    // "accessToken" — that cookie has never existed; the real one set at
    // login is called "token" (see authController.js). Clearing the wrong
    // name is a silent no-op: no error, no effect, and the real session
    // cookie stays valid. Also matching the sameSite/secure options used
    // when the cookie was set — mismatched options are the other common
    // way a clearCookie call silently fails to actually clear anything.
    res.clearCookie("token", {
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
    });
    res.clearCookie("refreshToken", {
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
    });

    res.json({ msg: "Account deleted" });
  } catch (err) {
    console.error("deleteAccount:", err);
    res.status(500).json({ msg: "Failed to delete account" });
  }
};
