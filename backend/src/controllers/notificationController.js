import Notification from "../models/notification.js";

export const getNotifications = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 30);

    const notifications = await Notification.find({ recipient: req.user.id })
      .populate("sender", "username avatar")
      .populate("project", "title")
      .populate("collabPost", "title")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json(notifications);
  } catch (err) {
    console.error("getNotifications:", err);
    res.status(500).json({ msg: "Failed to load notifications" });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user.id },
      { isRead: true },
      { new: true },
    );

    if (!notification)
      return res.status(404).json({ msg: "Notification not found" });
    res.json({ msg: "Marked as read" });
  } catch (err) {
    console.error("markAsRead:", err);
    res.status(500).json({ msg: "Failed to update" });
  }
};

export const markAllRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user.id, isRead: false },
      { isRead: true },
    );
    res.json({ msg: "All notifications marked as read" });
  } catch (err) {
    console.error("markAllRead:", err);
    res.status(500).json({ msg: "Failed to mark all as read" });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const notif = await Notification.findOneAndDelete({
      _id: req.params.id,
      recipient: req.user.id,
    });
    if (!notif) return res.status(404).json({ msg: "Notification not found" });
    res.json({ msg: "Deleted" });
  } catch (err) {
    console.error("deleteNotification:", err);
    res.status(500).json({ msg: "Failed to delete" });
  }
};
