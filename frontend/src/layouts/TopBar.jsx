import { useNavigate } from "react-router-dom";
import {
  Bell,
  Menu,
  MessageSquare,
  Plus,
  CheckCheck,
  X,
  ChevronLeft,
  ChevronRight,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationsContext";
import { useMessages } from "../context/MessagesContext";
import NavbarSearch from "../components/search/NavbarSearch";
import { useState, useRef, useEffect } from "react";

const TYPE_STYLE = {
  project_request: { bg: "rgba(249,87,111,0.12)", dot: "#FF8B93" },
  request_accepted: { bg: "rgba(16,185,129,0.10)", dot: "#34D399" },
  request_rejected: { bg: "rgba(248,113,113,0.10)", dot: "#F87171" },
  connection_request: { bg: "rgba(249,87,111,0.12)", dot: "#FF8B93" },
  connection_accepted: { bg: "rgba(16,185,129,0.10)", dot: "#34D399" },
  collab_interest: { bg: "rgba(249,87,111,0.12)", dot: "#FF8B93" },
  collab_accepted: { bg: "rgba(16,185,129,0.10)", dot: "#34D399" },
  collab_declined: { bg: "rgba(248,113,113,0.10)", dot: "#F87171" },
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
    case "collab_interest":
      return (
        <>
          <span className="font-semibold">{n.sender?.username}</span> wants to
          collaborate on{" "}
          <span className="font-semibold" style={{ color: "#FF8B93" }}>
            {n.collabPost?.title}
          </span>
        </>
      );
    case "collab_accepted":
      return (
        <>
          <span className="font-semibold" style={{ color: "#34D399" }}>
            {n.sender?.username}
          </span>{" "}
          accepted your collab request
        </>
      );
    case "collab_declined":
      return (
        <>
          Your collab request on{" "}
          <span className="font-semibold" style={{ color: "#F87171" }}>
            {n.collabPost?.title}
          </span>{" "}
          wasn't a fit this time
        </>
      );
    case "system":
      return n.description || n.title;
    default:
      return n.description || n.title || "New notification";
  }
};

const timeAgo = (date) => {
  const s = Math.floor((Date.now() - new Date(date)) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
};

export default function TopBar({ onMenuClick }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const {
    notifications,
    unreadCount,
    markRead,
    markAllRead,
    removeNotification,
  } = useNotifications();
  const { unreadCount: unreadMsgs } = useMessages();

  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const bellRef = useRef(null);
  const notifRef = useRef(null);
  const avatarRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (
        !bellRef.current?.contains(e.target) &&
        !notifRef.current?.contains(e.target)
      )
        setNotifOpen(false);
      if (
        !avatarRef.current?.contains(e.target) &&
        !profileRef.current?.contains(e.target)
      )
        setProfileOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleNotifClick = async (n) => {
    await markRead(n._id);
    setNotifOpen(false);
    if (n.link) navigate(n.link);
  };

  const iconBtn =
    "relative w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer";
  const iconBtnStyle = {
    background: "rgba(255,255,255,0.06)",
    color: "#D1D5DB",
  };

  return (
    <>
      <header
        style={{
          background: "rgba(11,8,20,0.96)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(249,87,111,0.14)",
        }}
      >
        <div className="h-16 px-4 lg:px-5 flex items-center justify-between gap-4">
          {/* LEFT — mobile hamburger + browser back/forward */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={onMenuClick}
              className={`lg:hidden ${iconBtn}`}
              style={iconBtnStyle}
            >
              <Menu size={17} />
            </button>
            <div className="hidden lg:flex items-center gap-1">
              <button
                onClick={() => window.history.back()}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
                style={{ background: "rgba(0,0,0,0.5)", color: "#fff" }}
                title="Go back"
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(0,0,0,0.7)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "rgba(0,0,0,0.5)")
                }
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => window.history.forward()}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
                style={{ background: "rgba(0,0,0,0.5)", color: "#fff" }}
                title="Go forward"
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(0,0,0,0.7)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "rgba(0,0,0,0.5)")
                }
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* CENTER — search */}
          <div className="flex-1 flex justify-center max-w-lg mx-auto">
            <NavbarSearch />
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Messages */}
            <button
              onClick={() => navigate("/messages")}
              className={iconBtn}
              style={iconBtnStyle}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.12)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.06)")
              }
            >
              <MessageSquare size={16} />
              {unreadMsgs > 0 && (
                <span
                  className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-white flex items-center justify-center"
                  style={{
                    background: "var(--rm-purple)",
                    fontSize: 9,
                    fontWeight: 700,
                  }}
                >
                  {unreadMsgs > 9 ? "9+" : unreadMsgs}
                </span>
              )}
            </button>

            {/* Bell */}
            <button
              ref={bellRef}
              onClick={() => setNotifOpen((v) => !v)}
              className={iconBtn}
              style={{
                background: notifOpen
                  ? "rgba(249,87,111,0.2)"
                  : "rgba(255,255,255,0.06)",
                color: notifOpen ? "var(--rm-purple-light)" : "#D1D5DB",
              }}
            >
              <Bell size={16} />
              {unreadCount > 0 && (
                <span
                  className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-white flex items-center justify-center"
                  style={{
                    background: "var(--rm-purple)",
                    fontSize: 9,
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
              className="hidden sm:flex items-center gap-1.5 h-9 px-4 rounded-full font-medium transition-all text-sm"
              style={{ background: "#fff", color: "#000" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.04)")
              }
              onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
            >
              <Plus size={14} /> New Mix
            </button>

            {/* Avatar — opens profile dropdown */}
            <button
              ref={avatarRef}
              onClick={() => setProfileOpen((v) => !v)}
              className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 transition-all"
              style={{
                border: profileOpen
                  ? "2px solid var(--rm-purple)"
                  : "1.5px solid rgba(255,255,255,0.15)",
              }}
            >
              <img
                src={
                  user?.avatar ||
                  `https://ui-avatars.com/api/?name=${user?.username || "U"}&background=F9576F&color=fff`
                }
                alt=""
                className="w-full h-full object-cover"
              />
            </button>
          </div>
        </div>
      </header>

      {/* PROFILE DROPDOWN */}
      {profileOpen && (
        <div
          ref={profileRef}
          style={{
            position: "fixed",
            top: 68,
            right: 16,
            width: 220,
            zIndex: 9999,
            background: "var(--rm-bg-raised)",
            border: "1px solid rgba(249,87,111,0.28)",
            borderRadius: 16,
            boxShadow: "0 16px 48px rgba(0,0,0,0.6)",
            overflow: "hidden",
          }}
        >
          {/* User info */}
          <div
            className="flex items-center gap-3 px-4 py-3"
            style={{ borderBottom: "1px solid rgba(249,87,111,0.15)" }}
          >
            <img
              src={
                user?.avatar ||
                `https://ui-avatars.com/api/?name=${user?.username}&background=F9576F&color=fff`
              }
              alt=""
              className="w-10 h-10 rounded-xl object-cover flex-shrink-0"
              style={{ border: "1.5px solid var(--rm-purple-border)" }}
            />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                {user?.name || user?.username}
              </p>
              <p
                className="text-[11px] truncate"
                style={{
                  fontFamily: "var(--rm-font-mono)",
                  color: "var(--rm-text-muted)",
                }}
              >
                @{user?.username}
              </p>
            </div>
          </div>

          {/* Links */}
          {[
            {
              icon: <User size={14} />,
              label: "View Profile",
              action: () => {
                if (!user?.username) return;
                navigate(`/profile/${user.username}`);
                setProfileOpen(false);
              },
            },
            {
              icon: <Settings size={14} />,
              label: "Settings",
              action: () => {
                navigate("/settings");
                setProfileOpen(false);
              },
            },
          ].map(({ icon, label, action }) => (
            <button
              key={label}
              onClick={action}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-all"
              style={{ color: "var(--rm-text-secondary)" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(249,87,111,0.1)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              {icon} {label}
            </button>
          ))}

          <div style={{ borderTop: "1px solid rgba(249,87,111,0.15)" }}>
            <button
              onClick={async () => {
                await logout();
                window.location.href = "/login";
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-all"
              style={{ color: "#F87171" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(248,113,113,0.1)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              <LogOut size={14} /> Sign out
            </button>
          </div>
        </div>
      )}

      {/* NOTIFICATIONS DROPDOWN */}
      {notifOpen && (
        <div
          ref={notifRef}
          style={{
            position: "fixed",
            top: 68,
            right: 16,
            width: 360,
            maxHeight: "72vh",
            overflowY: "auto",
            background: "var(--rm-bg-raised)",
            border: "1px solid rgba(249,87,111,0.28)",
            borderRadius: 16,
            boxShadow: "0 24px 60px rgba(0,0,0,0.65)",
            zIndex: 9998,
          }}
        >
          <div
            className="flex items-center justify-between px-4 py-3 sticky top-0"
            style={{
              borderBottom: "1px solid rgba(249,87,111,0.15)",
              background: "var(--rm-bg-raised)",
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
                className="flex items-center gap-1 text-xs"
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
                <CheckCheck size={13} /> mark all read
              </button>
            )}
          </div>
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
              const s = TYPE_STYLE[n.type] || TYPE_STYLE.system;
              return (
                <div
                  key={n._id}
                  className="flex items-start gap-3 px-4 py-3 group transition-all cursor-pointer"
                  style={{
                    borderBottom: "1px solid rgba(249,87,111,0.07)",
                    background: !n.isRead ? s.bg : "transparent",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "rgba(249,87,111,0.08)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = !n.isRead
                      ? s.bg
                      : "transparent")
                  }
                  onClick={() => handleNotifClick(n)}
                >
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5"
                    style={{
                      background: n.isRead ? "transparent" : s.dot,
                      border: `1.5px solid ${s.dot}`,
                    }}
                  />
                  <div className="flex-1 min-w-0">
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
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeNotification(n._id);
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 rounded-lg flex items-center justify-center"
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
}
