import Notification from "../models/notification.js";
import User from "../models/user.js";
import { sendNotificationEmail } from "./sendEmail.js";

// Set once by socket/index.js after the io server is created. Kept as a
// module-level reference (rather than passing `io` through every
// controller that calls createNotification) so existing call sites don't
// need to change — they just get real-time delivery for free.
let ioInstance = null;
export const setNotificationSocket = (io) => {
  ioInstance = io;
};

// Notification types worth an email. Deliberately excludes "message" (a
// DM per email would be spam — chat has its own real-time channel) and
// "system" (usually low-stakes, in-app is enough).
const EMAILABLE_TYPES = new Set([
  "connection_request",
  "connection_accepted",
  "project_request",
  "request_accepted",
  "request_rejected",
  "collab_interest",
  "collab_accepted",
  "collab_declined",
]);

export const createNotification = async ({
  recipient,
  sender = null,
  type,
  title,
  description,
  link = null,
  project = null,
  collabPost = null,
  priority = 2,
}) => {
  const notification = await Notification.create({
    recipient,
    sender,
    type,
    title,
    description,
    link,
    project,
    collabPost,
    priority,
  });

  // Push it live to the recipient if they're connected right now. If
  // they're offline, io.to() on an empty room is a harmless no-op — they
  // just get it from the normal REST fetch next time they load the app.
  if (ioInstance) {
    const populated = await notification
      .populate("sender", "username avatar")
      .then((n) => n.populate("project", "title"))
      .then((n) => n.populate("collabPost", "title"));
    ioInstance.to(`user:${recipient}`).emit("new_notification", populated);
  }

  // Email fan-out — fire-and-forget so a slow/down email provider never
  // adds latency to the action that triggered the notification (sending
  // a connection request shouldn't wait on an email API round-trip).
  if (EMAILABLE_TYPES.has(type)) {
    User.findById(recipient)
      .select("email preferences.notifications.email")
      .then((user) => {
        if (user?.email && user.preferences?.notifications?.email !== false) {
          sendNotificationEmail({
            to: user.email,
            title,
            description,
            link,
          });
        }
      })
      .catch((err) => console.error("notification email lookup failed:", err));
  }

  return notification;
};
