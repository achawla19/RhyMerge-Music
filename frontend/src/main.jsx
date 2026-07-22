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
