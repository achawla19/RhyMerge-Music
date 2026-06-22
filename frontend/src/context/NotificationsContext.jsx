import { createContext, useContext, useEffect, useState } from "react";
import { useSocket } from "./SocketContext";
import { useAuth } from "./AuthContext";
import { getNotifications, markNotificationRead } from "../api/notifications";

const NotificationsContext = createContext();

export const NotificationsProvider = ({ children }) => {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [notifications, setNotifications] = useState([]);

  // Initial load + a slow background poll as a fallback safety net in
  // case a socket event is ever missed (e.g. a brief disconnect). The
  // socket listener below is what makes this feel instant; this is just
  // a correctness backstop.
  useEffect(() => {
    if (!user) {
      setNotifications([]);
      return;
    }
    const load = async () => {
      try {
        const data = await getNotifications();
        setNotifications(data);
      } catch (err) {
        console.error(err);
      }
    };
    load();
    const interval = setInterval(load, 60000);
    return () => clearInterval(interval);
  }, [user?._id]);

  // Real-time — fires the instant the backend creates a notification for
  // you, instead of waiting for the next poll.
  useEffect(() => {
    if (!socket) return;
    const handleNew = (notification) => {
      setNotifications((prev) => [notification, ...prev]);
    };
    socket.on("new_notification", handleNew);
    return () => socket.off("new_notification", handleNew);
  }, [socket]);

  const markRead = async (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)),
    );
    try {
      await markNotificationRead(id);
    } catch (err) {
      console.error(err);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <NotificationsContext.Provider
      value={{ notifications, unreadCount, markRead }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationsContext);
