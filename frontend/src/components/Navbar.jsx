import { useLocation, useNavigate } from "react-router-dom";
import { Bell, Menu, MessageSquare, Plus, CheckCheck, X } from "lucide-react";
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
  network: { title: "Your Syncs", subtitle: "The people you're tuned into." },
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

const TYPE_STYLE = {
  project_request: { bg: "rgba(124,58,237,0.12)", dot: "#C084FC" },
  request_accepted: { bg: "rgba(16,185,129,0.10)", dot: "#34D399" },
  request_rejected: { bg: "rgba(248,113,113,0.10)", dot: "#F87171" },
  connection_request: { bg: "rgba(124,58,237,0.12)", dot: "#C084FC" },
  connection_accepted: { bg: "rgba(16,185,129,0.10)", dot: "#34D399" },
  system: { bg: "rgba(96,165,250,0.10)", dot: "#60A5FA" },
};

const notifText = (n) => {
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
          <span className="font-semibold" style={{ color: "#34D399" }}>
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
          <span className="font-semibold" style={{ color: "#34D399" }}>
            {n.sender?.username}
          </span>{" "}
          accepted your sync
        </>
      );
    case "system":
      return n.description || n.title;
    default:
      return n.description || n.title || "New notification";
  }
};

const timeAgo = (date) => {
  const secs = Math.floor((Date.now() - new Date(date)) / 1000);
  if (secs < 60) return "just now";
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
  if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`;
  return `${Math.floor(secs / 86400)}d ago`;
};

const Navbar = ({ onMenuClick }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    notifications,
    unreadCount,
    markRead,
    markAllRead,
    removeNotification,
  } = useNotifications();
  const { unreadCount: unreadMsgs } = useMessages();

  const segment = location.pathname.split("/")[1] || "";
  const meta = PAGE_META(user?.username);
  const current = meta[segment] || meta[""];

  const [open, setOpen] = useState(false);
  const bellRef = useRef(null);
  const dropRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (
        !bellRef.current?.contains(e.target) &&
        !dropRef.current?.contains(e.target)
      )
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const handleClick = async (n) => {
    await markRead(n._id);
    setOpen(false);
    if (n.link) navigate(n.link);
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
          {/* LEFT */}
          <div className="flex items-center gap-4 min-w-0 flex-1 overflow-hidden">
            <button
              onClick={onMenuClick}
              className="lg:hidden w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background: "rgba(124,58,237,0.08)",
                border: "1px solid rgba(124,58,237,0.2)",
                color: "var(--rm-purple-light)",
              }}
            >
              <Menu size={18} />
            </button>
            <div className="min-w-0">
              <h1 className="text-base md:text-lg lg:text-xl font-bold leading-tight text-white truncate">
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

          {/* RIGHT */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <NavbarSearch />

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
              {unreadMsgs > 0 && (
                <span
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-white flex items-center justify-center"
                  style={{
                    background: "var(--rm-purple)",
                    fontSize: 9,
                    fontFamily: "var(--rm-font-mono)",
                    fontWeight: 700,
                  }}
                >
                  {unreadMsgs > 9 ? "9+" : unreadMsgs}
                </span>
              )}
            </button>

            {/* Notifications bell */}
            <button
              ref={bellRef}
              onClick={() => setOpen((v) => !v)}
              className="relative w-10 h-10 rounded-xl flex items-center justify-center transition-all"
              style={{
                background: open
                  ? "rgba(124,58,237,0.14)"
                  : "rgba(255,255,255,0.04)",
                border: open
                  ? "1px solid rgba(124,58,237,0.4)"
                  : "1px solid rgba(255,255,255,0.07)",
                color: open ? "var(--rm-purple-light)" : "#6B7280",
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
              className="flex items-center gap-2 h-10 px-4 rounded-xl font-medium transition-all"
              style={{
                background: "var(--rm-purple)",
                color: "#fff",
                fontSize: 13,
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

      {/* Notification Dropdown */}
      {open && (
        <div
          ref={dropRef}
          style={{
            position: "fixed",
            top: 68,
            right: 16,
            width: 360,
            maxHeight: "72vh",
            overflowY: "auto",
            background: "#110820",
            border: "1px solid rgba(124,58,237,0.28)",
            borderRadius: 16,
            boxShadow: "0 24px 60px rgba(0,0,0,0.65)",
            zIndex: 9999,
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3 sticky top-0"
            style={{
              borderBottom: "1px solid rgba(124,58,237,0.15)",
              background: "#110820",
              zIndex: 1,
            }}
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-white">
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
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="flex items-center gap-1 text-xs transition-colors"
                style={{
                  color: "var(--rm-text-muted)",
                  fontFamily: "var(--rm-font-mono)",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--rm-purple-light)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--rm-text-muted)")
                }
              >
                <CheckCheck size={13} />
                mark all read
              </button>
            )}
          </div>

          {/* List */}
          {notifications.length === 0 ? (
            <div
              className="px-4 py-10 text-center text-sm"
              style={{
                color: "var(--rm-text-muted)",
                fontFamily: "var(--rm-font-mono)",
              }}
            >
              no signals yet
            </div>
          ) : (
            notifications.map((n) => {
              const style = TYPE_STYLE[n.type] || TYPE_STYLE.system;
              return (
                <div
                  key={n._id}
                  className="flex items-start gap-3 px-4 py-3 group transition-all cursor-pointer"
                  style={{
                    borderBottom: "1px solid rgba(124,58,237,0.07)",
                    background: !n.isRead ? style.bg : "transparent",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "rgba(124,58,237,0.08)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = !n.isRead
                      ? style.bg
                      : "transparent")
                  }
                  onClick={() => handleClick(n)}
                >
                  {/* Dot */}
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5"
                    style={{
                      background: n.isRead ? "transparent" : style.dot,
                      border: `1.5px solid ${style.dot}`,
                    }}
                  />

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {n.sender?.avatar && (
                      <img
                        src={n.sender.avatar}
                        alt=""
                        className="w-7 h-7 rounded-full mb-1.5"
                        style={{ border: "1px solid rgba(255,255,255,0.1)" }}
                      />
                    )}
                    <p className="text-sm text-white leading-snug">
                      {notifText(n)}
                    </p>
                    <p
                      className="text-[11px] mt-1"
                      style={{
                        fontFamily: "var(--rm-font-mono)",
                        color: "var(--rm-text-muted)",
                      }}
                    >
                      {timeAgo(n.createdAt)}
                    </p>
                  </div>

                  {/* Delete button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeNotification(n._id);
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ color: "#6B7280" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "#F87171")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "#6B7280")
                    }
                  >
                    <X size={12} />
                  </button>
                </div>
              );
            })
          )}
        </div>
      )}
    </>
  );
};

export default Navbar;
