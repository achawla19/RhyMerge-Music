import Notification from "../models/notification.js";

// Set once by socket/index.js after the io server is created. Kept as a
// module-level reference (rather than passing `io` through every
// controller that calls createNotification) so existing call sites don't
// need to change — they just get real-time delivery for free.
let ioInstance = null;
export const setNotificationSocket = (io) => {
  ioInstance = io;
};

export const createNotification = async ({
  recipient,
  sender = null,
  type,
  title,
  description,
  link = null,
  project = null,
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
    priority,
  });

  // Push it live to the recipient if they're connected right now. If
  // they're offline, io.to() on an empty room is a harmless no-op — they
  // just get it from the normal REST fetch next time they load the app.
  if (ioInstance) {
    const populated = await notification.populate("sender", "username avatar");
    ioInstance.to(`user:${recipient}`).emit("new_notification", populated);
  }

  return notification;
};
