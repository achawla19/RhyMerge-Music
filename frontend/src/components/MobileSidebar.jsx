import { useEffect, useRef, useState } from "react";
import {
  Home,
  LayoutGrid,
  Search,
  Users,
  Settings,
  User,
  Bookmark,
  Radio,
  Handshake,
  X,
  LogOut,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";

// ─── Mini waveform (same as desktop sidebar) ──────────────────
const MiniWave = () => {
  const refs = useRef([]);
  useEffect(() => {
    const intervals = refs.current.map((bar, i) =>
      setInterval(
        () => {
          if (bar) bar.style.height = `${Math.round(3 + Math.random() * 10)}px`;
        },
        300 + i * 90,
      ),
    );
    return () => intervals.forEach(clearInterval);
  }, []);
  return (
    <div className="flex items-center gap-[2px] ml-auto" style={{ height: 14 }}>
      {[8, 12, 6, 10, 7].map((h, i) => (
        <div
          key={i}
          ref={(el) => (refs.current[i] = el)}
          style={{
            width: 2,
            height: h,
            borderRadius: 1,
            background: "var(--rm-purple-light)",
            transition: "height 0.3s ease",
            flexShrink: 0,
          }}
        />
      ))}
    </div>
  );
};

// ─── Nav items — paths UNCHANGED ─────────────────────────────
const NAV_ITEMS = (username) => [
  { label: "Home", sublabel: "dashboard", icon: Home, path: "/" },
  {
    label: "Projects",
    sublabel: "open projects",
    icon: LayoutGrid,
    path: "/projects",
  },
  {
    label: "Saved",
    sublabel: "bookmarked",
    icon: Bookmark,
    path: "/library",
  },
  { label: "Discover", sublabel: "search", icon: Search, path: "/search" },
  {
    label: "Collab",
    sublabel: "find your people",
    icon: Handshake,
    path: "/collab",
  },
  { label: "Syncs", sublabel: "network", icon: Users, path: "/network" },
  { label: "Community", sublabel: "feed", icon: Radio, path: "/community" },
  {
    label: "My Stem",
    sublabel: "profile",
    icon: User,
    path: `/profile/${username || ""}`,
  },
  {
    label: "Settings",
    sublabel: "preferences",
    icon: Settings,
    path: "/settings",
  },
];

// ─── Component ────────────────────────────────────────────────
const MobileSidebar = ({ open, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [visible, setVisible] = useState(false);

  // Drive CSS slide animation separately from open prop
  useEffect(() => {
    if (open) {
      setVisible(true);
    } else {
      // Let slide-out play before unmounting
      const t = setTimeout(() => setVisible(false), 280);
      return () => clearTimeout(t);
    }
  }, [open]);

  if (!visible) return null;

  const navItems = NAV_ITEMS(user?.username);

  const handleNavigate = (path) => {
    navigate(path);
    onClose();
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
    onClose();
  };

  return (
    <div className="lg:hidden fixed inset-0" style={{ zIndex: 200 }}>
      {/* ── Backdrop ── */}
      <div
        className="absolute inset-0"
        style={{
          background: "rgba(0,0,0,0.75)",
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
          animation: open
            ? "rmFadeIn 0.25s ease both"
            : "rmFadeOut 0.25s ease both",
        }}
        onClick={onClose}
      />

      {/* ── Drawer ── */}
      <div
        className="absolute left-0 top-0 h-full w-[280px] flex flex-col"
        style={{
          background: "rgba(10, 6, 18, 0.98)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderRight: "1px solid rgba(249,87,111,0.2)",
          boxShadow: "8px 0 40px rgba(0,0,0,0.5)",
          animation: open
            ? "rmSlideInLeft 0.28s var(--rm-ease) both"
            : "rmSlideOutLeft 0.25s ease both",
        }}
      >
        {/* ── Header ── */}
        <div
          className="flex items-center justify-between px-5 py-5"
          style={{ borderBottom: "1px solid rgba(249,87,111,0.12)" }}
        >
          <button
            onClick={() => handleNavigate("/")}
            className="flex items-center gap-3"
          >
            <img
              src={logo}
              alt="RhyMerge"
              className="h-7 w-auto flex-shrink-0"
            />
            <div className="text-left">
              <p
                className="text-[9px] mt-0.5 uppercase tracking-widest"
                style={{
                  fontFamily: "var(--rm-font-mono)",
                  color: "var(--rm-text-muted)",
                }}
              >
                where rhythms collide
              </p>
            </div>
          </button>

          {/* Close */}
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.07)",
              color: "#6B7280",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(248,113,113,0.4)";
              e.currentTarget.style.color = "#F87171";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
              e.currentTarget.style.color = "#6B7280";
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* ── Navigation ── */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-1">
          <p
            className="px-3 mb-3 text-[9px] uppercase tracking-[2px]"
            style={{
              fontFamily: "var(--rm-font-mono)",
              color: "var(--rm-text-muted)",
            }}
          >
            navigate
          </p>

          {navItems.map((item) => {
            const Icon = item.icon;
            const active =
              location.pathname === item.path ||
              (item.path !== "/" && location.pathname.startsWith(item.path));

            return (
              <button
                key={item.path}
                onClick={() => handleNavigate(item.path)}
                className="relative flex items-center gap-3 w-full px-3 py-2.5 rounded-xl transition-all"
                style={
                  active
                    ? {
                        background: "rgba(249,87,111,0.14)",
                        border: "1px solid rgba(249,87,111,0.3)",
                      }
                    : {
                        background: "transparent",
                        border: "1px solid transparent",
                      }
                }
              >
                {active && (
                  <div
                    className="absolute left-0 top-2 bottom-2 w-[3px] rounded-full"
                    style={{ background: "var(--rm-purple-light)" }}
                  />
                )}

                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={
                    active
                      ? {
                          background: "var(--rm-purple-dim)",
                          color: "var(--rm-purple-light)",
                        }
                      : {
                          background: "rgba(255,255,255,0.04)",
                          color: "#6B7280",
                        }
                  }
                >
                  <Icon size={15} />
                </div>

                <div className="flex-1 text-left min-w-0">
                  <p
                    className="text-sm font-medium leading-none"
                    style={{
                      color: active ? "var(--rm-text-primary)" : "#9CA3AF",
                    }}
                  >
                    {item.label}
                  </p>
                  <p
                    className="text-[10px] mt-0.5"
                    style={{
                      fontFamily: "var(--rm-font-mono)",
                      color: active
                        ? "var(--rm-purple-light)"
                        : "var(--rm-text-muted)",
                    }}
                  >
                    {item.sublabel}
                  </p>
                </div>

                {active && <MiniWave />}
              </button>
            );
          })}
        </nav>

        {/* ── User stem ── */}
        <div
          className="p-4 space-y-2"
          style={{ borderTop: "1px solid rgba(249,87,111,0.12)" }}
        >
          <button
            onClick={() => handleNavigate(`/profile/${user?.username || ""}`)}
            className="w-full flex items-center gap-3 p-3 rounded-xl transition-all"
            style={{
              background: "rgba(249,87,111,0.07)",
              border: "1px solid var(--rm-border)",
            }}
          >
            <div className="relative flex-shrink-0">
              <img
                src={
                  user?.avatar ||
                  `https://ui-avatars.com/api/?name=${user?.username || "U"}&background=F9576F&color=fff`
                }
                alt="avatar"
                className="w-9 h-9 rounded-full object-cover"
                style={{ border: "1.5px solid var(--rm-purple)" }}
              />
              <span
                className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full"
                style={{
                  background: "var(--rm-green)",
                  border: "1.5px solid #0E0B0A",
                }}
              />
            </div>
            <div className="flex-1 text-left min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user?.username || "Your stem"}
              </p>
              <p
                className="text-[10px] truncate"
                style={{
                  fontFamily: "var(--rm-font-mono)",
                  color: "var(--rm-purple-light)",
                }}
              >
                {user?.role || "music creator"}
              </p>
            </div>
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl transition-all text-left"
            style={{ color: "var(--rm-text-muted)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#F87171";
              e.currentTarget.style.background = "rgba(248,113,113,0.07)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--rm-text-muted)";
              e.currentTarget.style.background = "transparent";
            }}
          >
            <LogOut size={14} />
            <span
              className="text-xs"
              style={{ fontFamily: "var(--rm-font-mono)" }}
            >
              sign out
            </span>
          </button>
        </div>
      </div>

      {/* Animation keyframes */}
      <style>{`
        @keyframes rmFadeIn      { from { opacity: 0 } to { opacity: 1 } }
        @keyframes rmFadeOut     { from { opacity: 1 } to { opacity: 0 } }
        @keyframes rmSlideInLeft  { from { transform: translateX(-100%) } to { transform: translateX(0) } }
        @keyframes rmSlideOutLeft { from { transform: translateX(0) } to { transform: translateX(-100%) } }
      `}</style>
    </div>
  );
};

export default MobileSidebar;
