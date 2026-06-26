import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth, getMemoryToken } from "./AuthContext";

const SocketContext = createContext();
const API = import.meta.env.VITE_API_URL;

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [onlineUserIds, setOnlineUserIds] = useState(new Set());

  useEffect(() => {
    if (!user) {
      setSocket((prev) => {
        prev?.disconnect();
        return null;
      });
      setConnected(false);
      setOnlineUserIds(new Set());
      return;
    }

    const newSocket = io(API, {
      withCredentials: true,
      // Pass token in auth object as fallback for browsers (Brave) that
      // block httpOnly cookies on WebSocket upgrade requests.
      // The socket server accepts EITHER the cookie OR auth.token —
      // whichever arrives first wins. REST API calls never use this token.
      auth: { token: getMemoryToken() },
    });

    newSocket.on("connect", () => setConnected(true));
    newSocket.on("disconnect", (reason) => {
      setConnected(false);
      console.log("Socket disconnected:", reason);
    });
    newSocket.on("connect_error", (err) => {
      console.error("Socket connection failed:", err.message);
    });
    newSocket.on("online_users", (ids) => setOnlineUserIds(new Set(ids)));
    newSocket.on("presence_update", ({ userId, online }) => {
      setOnlineUserIds((prev) => {
        const next = new Set(prev);
        online ? next.add(userId) : next.delete(userId);
        return next;
      });
    });

    setSocket(newSocket);
    return () => {
      newSocket.disconnect();
      setSocket(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?._id]);

  return (
    <SocketContext.Provider
      value={{
        socket,
        connected,
        isOnline: (userId) => onlineUserIds.has(userId),
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
