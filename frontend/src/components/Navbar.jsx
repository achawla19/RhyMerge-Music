import { useLocation, useNavigate } from "react-router-dom";
import { Bell, Menu, MessageSquare, Plus } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationsContext";
import { useMessages } from "../context/MessagesContext";
import NavbarSearch from "./search/NavbarSearch";
import { useState, useRef, useEffect } from "react";

const PAGE_META = (username) => ({
  "": {
    title: `Welcome back, ${username || "creator"}`,
    subtitle: "Your studio is open. What are you building today?",
  },
  projects: {
    title: "Open Mixes",
    subtitle: "Browse active collabs and start your next project.",
  },
  "saved-projects": {
    title: "Saved Mixes",
    subtitle: "Projects you've bookmarked for later.",
  },
  search: {
    title: "Find Stems",
    subtitle: "Discover artists, roles, and sounds that match yours.",
  },
  network: {
    title: "Your Syncs",
    subtitle: "The people you're tuned into.",
  },
  community: {
    title: "Signal Feed",
    subtitle: "Raw ideas, hooks, and open collabs — live.",
  },
  messages: {
    title: "Messages",
    subtitle: "Stay in sync with your collaborators.",
  },
  settings: {
    title: "Settings",
    subtitle: "Tune your account and preferences.",
  },
  profile: {
    title: "My Stem",
    subtitle: "Your artist profile — your frequency.",
  },
});

const notifBg = {
  project_request: "rgba(124,58,237,0.12)",
  request_accepted: "rgba(16,185,129,0.10)",
  request_rejected: "rgba(248,113,113,0.10)",
  connection_request: "rgba(124,58,237,0.12)",
  connection_accepted: "rgba(16,185,129,0.10)",
};

// Centralizes how each notification type renders its message — was
// previously an inline if-chain in JSX that silently rendered nothing
// for connection_request/connection_accepted, since those branches were
// never added even though the backend type enum already supported them.
const renderNotificationText = (n) => {
  switch (n.type) {
    case "project_request":
      return (
        <>
          <span className="font-semibold">{n.sender?.username}</span> wants to
          merge into your project
        </>
      );
    case "request_accepted":
      return (
        <>
          Merge accepted —{" "}
          <span className="font-semibold" style={{ color: "var(--rm-green)" }}>
            {n.project?.title}
          </span>
        </>
      );
    case "request_rejected":
      return (
        <>
          Merge declined on{" "}
          <span className="font-semibold" style={{ color: "#F87171" }}>
            {n.project?.title}
          </span>
        </>
      );
    case "connection_request":
      return (
        <>
          <span className="font-semibold">{n.sender?.username}</span> wants to
          sync with you
        </>
      );
    case "connection_accepted":
      return (
        <>
          <span className="font-semibold" style={{ color: "var(--rm-green)" }}>
            {n.sender?.username}
          </span>{" "}
          accepted your sync request
        </>
      );
    default:
      return n.description || n.title || "New notification";
  }
};

const Navbar = ({ onMenuClick }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { notifications, unreadCount, markRead } = useNotifications();
  const { unreadCount: unreadMessageCount } = useMessages();

  const segment = location.pathname.split("/")[1] || "";
  const meta = PAGE_META(user?.username);
  const current = meta[segment] || meta[""];

  const searchWidth =
    segment === ""
      ? "lg:w-[420px]"
      : segment === "messages"
        ? "lg:w-[240px]"
        : "lg:w-[320px]";

  const [showNotifications, setShowNotifications] = useState(false);
  const bellRef = useRef(null);
  const dropRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    if (!showNotifications) return;
    const handler = (e) => {
      if (
        bellRef.current &&
        !bellRef.current.contains(e.target) &&
        dropRef.current &&
        !dropRef.current.contains(e.target)
      ) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showNotifications]);

  const handleNotifClick = async (n) => {
    await markRead(n._id);
    setShowNotifications(false);
    if (n.link) {
      navigate(n.link, { state: { showJoinedBanner: true } });
    }
  };

  return (
    <>
      <header
        style={{
          background: "rgba(11,8,20,0.88)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(124,58,237,0.12)",
        }}
      >
        <div className="h-16 px-4 lg:px-8 flex items-center justify-between gap-4">
          {/* ── LEFT ── */}
          <div className="flex items-center gap-4 min-w-0 flex-1 overflow-hidden">
            <button
              onClick={onMenuClick}
              className="lg:hidden w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all"
              style={{
                background: "rgba(124,58,237,0.08)",
                border: "1px solid rgba(124,58,237,0.2)",
                color: "var(--rm-purple-light)",
              }}
            >
              <Menu size={18} />
            </button>

            <div className="min-w-0">
              <h1
                className="text-base md:text-lg lg:text-xl font-bold leading-tight text-white truncate"
                style={{ margin: 0 }}
              >
                {current.title}
              </h1>
              <p
                className="text-[11px] mt-0.5 truncate"
                style={{
                  fontFamily: "var(--rm-font-mono)",
                  color: "var(--rm-text-muted)",
                }}
              >
                {current.subtitle}
              </p>
            </div>
          </div>

          {/* ── RIGHT ── */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <NavbarSearch width={searchWidth} />

            {/* Messages */}
            <button
              onClick={() => navigate("/messages")}
              className="relative w-10 h-10 rounded-xl flex items-center justify-center transition-all"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.07)",
                color: "#6B7280",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(124,58,237,0.35)";
                e.currentTarget.style.color = "var(--rm-purple-light)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
                e.currentTarget.style.color = "#6B7280";
              }}
            >
              <MessageSquare size={17} />
              {unreadMessageCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-white flex items-center justify-center"
                  style={{
                    background: "var(--rm-purple)",
                    fontSize: 9,
                    fontFamily: "var(--rm-font-mono)",
                    fontWeight: 700,
                  }}
                >
                  {unreadMessageCount > 9 ? "9+" : unreadMessageCount}
                </span>
              )}
            </button>

            {/* Notifications bell — dropdown is FIXED, escapes sticky stack */}
            <button
              ref={bellRef}
              onClick={() => setShowNotifications((v) => !v)}
              className="relative w-10 h-10 rounded-xl flex items-center justify-center transition-all"
              style={{
                background: showNotifications
                  ? "rgba(124,58,237,0.14)"
                  : "rgba(255,255,255,0.04)",
                border: showNotifications
                  ? "1px solid rgba(124,58,237,0.4)"
                  : "1px solid rgba(255,255,255,0.07)",
                color: showNotifications ? "var(--rm-purple-light)" : "#6B7280",
              }}
              onMouseEnter={(e) => {
                if (!showNotifications) {
                  e.currentTarget.style.borderColor = "rgba(124,58,237,0.35)";
                  e.currentTarget.style.color = "var(--rm-purple-light)";
                }
              }}
              onMouseLeave={(e) => {
                if (!showNotifications) {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
                  e.currentTarget.style.color = "#6B7280";
                }
              }}
            >
              <Bell size={17} />
              {unreadCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-white flex items-center justify-center"
                  style={{
                    background: "var(--rm-purple)",
                    fontSize: 9,
                    fontFamily: "var(--rm-font-mono)",
                    fontWeight: 700,
                  }}
                >
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {/* New Mix */}
            <button
              onClick={() => navigate("/projects")}
              className="flex items-center justify-center gap-2 h-10 px-4 rounded-xl font-medium transition-all"
              style={{
                background: "var(--rm-purple)",
                color: "#fff",
                fontSize: 13,
                fontFamily: "var(--rm-font-sans)",
                border: "1px solid rgba(124,58,237,0.5)",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#6D28D9")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "var(--rm-purple)")
              }
            >
              <Plus size={16} />
              <span className="hidden xl:block">New Mix</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Notification dropdown — position:fixed so it clears ticker & PulseBar ── */}
      {showNotifications && (
        <div
          ref={dropRef}
          style={{
            position: "fixed",
            top: 68,
            right: 16,
            width: 340,
            maxHeight: "70vh",
            overflowY: "auto",
            background: "#110820",
            border: "1px solid rgba(124,58,237,0.28)",
            borderRadius: 16,
            boxShadow: "0 24px 60px rgba(0,0,0,0.6)",
            zIndex: 9999,
          }}
        >
          <div
            className="flex items-center justify-between px-4 py-3 sticky top-0"
            style={{
              borderBottom: "1px solid rgba(124,58,237,0.15)",
              background: "#110820",
            }}
          >
            <span className="text-sm font-medium text-white">
              Notifications
            </span>
            {unreadCount > 0 && (
              <span
                className="text-[9px] px-2 py-0.5 rounded-full"
                style={{
                  fontFamily: "var(--rm-font-mono)",
                  background: "var(--rm-purple-dim)",
                  color: "var(--rm-purple-light)",
                  border: "1px solid var(--rm-purple-border)",
                }}
              >
                {unreadCount} new
              </span>
            )}
          </div>

          {notifications.length === 0 ? (
            <div
              className="px-4 py-8 text-center text-sm"
              style={{
                color: "var(--rm-text-muted)",
                fontFamily: "var(--rm-font-mono)",
              }}
            >
              no signals yet
            </div>
          ) : (
            notifications.map((n) => (
              <button
                key={n._id}
                onClick={() => handleNotifClick(n)}
                className="w-full text-left px-4 py-3 transition-all"
                style={{
                  borderBottom: "1px solid rgba(124,58,237,0.08)",
                  background: !n.isRead
                    ? notifBg[n.type] || "rgba(124,58,237,0.08)"
                    : "transparent",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(124,58,237,0.1)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = !n.isRead
                    ? notifBg[n.type] || "rgba(124,58,237,0.08)"
                    : "transparent")
                }
              >
                <p className="text-sm text-white leading-snug">
                  {renderNotificationText(n)}
                </p>
                <p
                  className="text-xs mt-1"
                  style={{
                    fontFamily: "var(--rm-font-mono)",
                    color: "var(--rm-text-muted)",
                  }}
                >
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </button>
            ))
          )}
        </div>
      )}
    </>
  );
};

export default Navbar;
