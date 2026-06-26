import { createContext, useContext, useState } from "react";

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
  };

  const updateUser = (userData) => {
    setUser((prev) => {
      const merged = { ...prev, ...userData };
      localStorage.setItem("user", JSON.stringify(merged));
      return merged;
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    setMemoryToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
