import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { SocketProvider } from "./context/SocketContext.jsx";
import { NotificationsProvider } from "./context/NotificationsContext.jsx";
import { MessagesProvider } from "./context/MessagesContext.jsx";
import "@fontsource/plus-jakarta-sans/400.css";
import "@fontsource/plus-jakarta-sans/500.css";
import "@fontsource/plus-jakarta-sans/600.css";
import "@fontsource/plus-jakarta-sans/700.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        {/* SocketProvider needs to be inside AuthProvider (reads useAuth()).
            Notifications/Messages need to be inside SocketProvider — both
            listen for real-time events on the same connection. */}
        <SocketProvider>
          <NotificationsProvider>
            <MessagesProvider>
              <App />
            </MessagesProvider>
          </NotificationsProvider>
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
