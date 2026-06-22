import { useEffect, useState } from "react";
import { getNotifications } from "../api/notifications";

export default function useNotifications() {
  const [notifications, setNotifications] = useState([]);

  const loadNotifications = async () => {
    try {
      const data = await getNotifications();

      setNotifications(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadNotifications();

    const interval = setInterval(loadNotifications, 15000);

    return () => clearInterval(interval);
  }, []);

  return {
    notifications,
    refreshNotifications: loadNotifications,
  };
}
