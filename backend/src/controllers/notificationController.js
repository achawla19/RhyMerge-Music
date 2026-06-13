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
    await Notification.findByIdAndUpdate(req.params.id, {
      isRead: true,
    });

    res.json({
      msg: "Updated",
    });
  } catch (err) {
    res.status(500).json({
      msg: "Failed",
    });
  }
};
