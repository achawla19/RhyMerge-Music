import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext();

const API = import.meta.env.VITE_API_URL;

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [onlineUserIds, setOnlineUserIds] = useState(new Set());

  useEffect(() => {
    // No user → no socket. Logging out tears the connection down so a
    // stale authenticated socket never lingers after sign-out.
    if (!user) {
      setSocket((prev) => {
        prev?.disconnect();
        return null;
      });
      setConnected(false);
      setOnlineUserIds(new Set());
      return;
    }

    // The JWT lives in an httpOnly cookie, same as every REST call —
    // withCredentials makes the socket handshake send it along so the
    // server's io.use() auth middleware can verify it.
    const newSocket = io(API, {
      withCredentials: true,
    });

    newSocket.on("connect", () => setConnected(true));
    newSocket.on("disconnect", (reason) => {
      setConnected(false);
      console.log("Socket disconnected:", reason);
    });

    // Without this, an auth failure on the socket handshake (e.g. the
    // cookie not being sent, or a CORS mismatch) fails completely
    // silently — the socket just never connects and nothing in the UI
    // tells you why. This makes that failure visible in the console.
    newSocket.on("connect_error", (err) => {
      console.error("Socket connection failed:", err.message);
    });

    newSocket.on("online_users", (ids) => {
      setOnlineUserIds(new Set(ids));
    });

    newSocket.on("presence_update", ({ userId, online }) => {
      setOnlineUserIds((prev) => {
        const next = new Set(prev);
        online ? next.add(userId) : next.delete(userId);
        return next;
      });
    });

    // Using state (not a ref) for the socket instance is what's important
    // here — setting it triggers a re-render so every component reading
    // useSocket().socket actually receives the live connection once it's
    // ready, instead of being stuck with whatever was there on first render.
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
