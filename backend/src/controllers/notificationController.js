import Notification from "../models/notification.js";

export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      recipient: req.user.id,
    })
      .populate("sender", "username avatar")
      .populate("project", "title")
      .sort({
        createdAt: -1,
      });

    res.json(notifications);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      msg: "Failed",
    });
  }
};

export const markAsRead = async (req, res) => {
  try {
    // FIX: the original update had no ownership check at all — any
    // logged-in user could mark ANY other user's notification as read
    // just by guessing/incrementing IDs. The `recipient` filter ensures
    // this only ever succeeds on a notification that belongs to you.
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user.id },
      { isRead: true },
    );

    if (!notification) {
      return res.status(404).json({ msg: "Notification not found" });
    }

    res.json({
      msg: "Updated",
    });
  } catch (err) {
    console.error("markAsRead error:", err);
    res.status(500).json({
      msg: "Failed",
    });
  }
};
