import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useSocket } from "./SocketContext";
import { useAuth } from "./AuthContext";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
} from "../api/notifications";

const NotificationsContext = createContext();

export const NotificationsProvider = ({ children }) => {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [notifications, setNotifications] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await getNotifications();
      setNotifications(data);
      setLoaded(true);
    } catch (err) {
      console.error("loadNotifications:", err);
    }
  }, []);

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setLoaded(false);
      return;
    }
    load();
    // Background poll — safety net in case a socket event is dropped
    const interval = setInterval(load, 60_000);
    return () => clearInterval(interval);
  }, [user?._id, load]);

  // Real-time push from socket
  useEffect(() => {
    if (!socket) return;
    const handleNew = (notif) => setNotifications((prev) => [notif, ...prev]);
    socket.on("new_notification", handleNew);
    return () => socket.off("new_notification", handleNew);
  }, [socket]);

  const markRead = useCallback(async (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)),
    );
    try {
      await markNotificationRead(id);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const markAllRead = useCallback(async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    try {
      await markAllNotificationsRead();
    } catch (err) {
      // Revert on failure
      load();
    }
  }, [load]);

  const removeNotification = useCallback(async (id) => {
    setNotifications((prev) => prev.filter((n) => n._id !== id));
    try {
      await deleteNotification(id);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        unreadCount,
        loaded,
        markRead,
        markAllRead,
        removeNotification,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationsContext);
