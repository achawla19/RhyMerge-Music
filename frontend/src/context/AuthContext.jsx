import { createContext, useContext, useState } from "react";
import { logoutUser } from "../api/auth";
import { setAuthToken } from "../utils/authToken";

const AuthContext = createContext();

// ── Memory token store ────────────────────────────────────────────────────────
// Kept outside React state so it's accessible synchronously by SocketContext
// without needing a re-render cycle. Never written to localStorage or
// sessionStorage — lives only in JS memory for this tab session.
// Used exclusively for Socket.io handshake auth (Brave blocks httpOnly
// cookies on WebSocket upgrades). All REST API calls still use the
// httpOnly cookie — this token is never sent via fetch().
let _memoryToken = null;
export const getMemoryToken = () => _memoryToken;
export const setMemoryToken = (t) => {
  _memoryToken = t;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    if (token) setMemoryToken(token);
    setAuthToken(token);
  };

  const updateUser = (userData) => {
    setUser((prev) => {
      const merged = { ...prev, ...userData };
      localStorage.setItem("user", JSON.stringify(merged));
      return merged;
    });
  };

  const logout = async () => {
    // Await the server-side cookie clear BEFORE navigating anywhere. This
    // matters a lot: if a caller does `logout(); window.location.href =
    // "/login"` without awaiting, the hard navigation can abort the
    // in-flight fetch before it ever reaches the server — the browser is
    // free to cancel pending requests on unload. That was the actual bug:
    // the API call would fire, the page would already be navigating away,
    // and the cookie would never actually get cleared server-side.
    try {
      await logoutUser();
    } catch {
      // Even if this fails (server down, network blip), still clear
      // everything client-side below — better than leaving the UI stuck
      // in a logged-in state the user explicitly asked to leave.
    }
    setUser(null);
    localStorage.removeItem("user");
    setMemoryToken(null);
    setAuthToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
