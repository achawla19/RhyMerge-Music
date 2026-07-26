import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { SocketProvider } from "./context/SocketContext.jsx";
import { NotificationsProvider } from "./context/NotificationsContext.jsx";
import { MessagesProvider } from "./context/MessagesContext.jsx";
import { ProjectPanelProvider } from "./context/ProjectPanelContext.jsx";
import { ToastProvider } from "./components/ui/Toast.jsx";
import { ConfirmProvider } from "./components/ui/ConfirmDialog.jsx";

import { getAuthToken } from "./utils/authToken";

// Safari's Intelligent Tracking Prevention (ITP) restricts cross-domain
// cookies on iOS — since this app runs on separate Vercel/Render domains,
// that means the httpOnly session cookie can silently fail to be sent on
// iPhone (Safari AND Chrome, since Apple requires every iOS browser to
// use WebKit). Patching fetch here, once, to also send the token as an
// Authorization header covers every API call in the app automatically —
// the backend accepts either the cookie or this header, so nothing
// breaks on browsers where the cookie works fine.
const originalFetch = window.fetch;
window.fetch = (input, init = {}) => {
  const token = getAuthToken();
  if (token) {
    init.headers = {
      ...(init.headers || {}),
      Authorization: `Bearer ${token}`,
    };
  }
  return originalFetch(input, init);
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      {/* Toast + Confirm sit outermost — they have no dependency on auth/
          socket state and every provider below them may need to surface
          a toast or confirmation (e.g. auth errors, socket disconnects). */}
      <ToastProvider>
        <ConfirmProvider>
          <AuthProvider>
            <SocketProvider>
              <NotificationsProvider>
                <MessagesProvider>
                  {/* ProjectPanelProvider needs BrowserRouter for useNavigate inside it */}
                  <ProjectPanelProvider>
                    <App />
                  </ProjectPanelProvider>
                </MessagesProvider>
              </NotificationsProvider>
            </SocketProvider>
          </AuthProvider>
        </ConfirmProvider>
      </ToastProvider>
    </BrowserRouter>
  </StrictMode>,
);
