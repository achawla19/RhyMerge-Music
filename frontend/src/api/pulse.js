import { getNotifications } from "./notifications";

export const getPulseFeed = async () => {
  const notifications = await getNotifications();

  return notifications.filter((n) => n.priority <= 2).slice(0, 10);
};
