import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  LayoutGrid,
  Search,
  Users,
  Settings,
  User,
  Bookmark,
  Home,
  Radio,
  LogOut,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

// ─── Animated logo waveform ───────────────────────────────────
const LogoWave = () => {
  const bars = [6, 14, 20, 11, 18, 8, 16, 22, 10, 17];
  const refs = useRef([]);

  useEffect(() => {
    const intervals = refs.current.map((bar, i) =>
      setInterval(
        () => {
          if (bar) {
            const h = Math.round(4 + Math.random() * 18);
            bar.style.height = `${h}px`;
          }
        },
        380 + i * 70,
      ),
    );
    return () => intervals.forEach(clearInterval);
  }, []);

  return (
    <div className="flex items-center gap-[2.5px]" style={{ height: 24 }}>
      {bars.map((h, i) => (
        <div
          key={i}
          ref={(el) => (refs.current[i] = el)}
          style={{
            width: 2.5,
            height: h,
            borderRadius: 2,
            background: "var(--rm-purple-light)",
            transition: "height 0.35s ease",
            flexShrink: 0,
          }}
        />
      ))}
    </div>
  );
};

// ─── Mini waveform shown on active nav item ───────────────────
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

// ─── Nav items — paths are UNCHANGED ─────────────────────────
const NAV_ITEMS = (username) => [
  { label: "Home", sublabel: "dashboard", icon: Home, path: "/" },
  {
    label: "Mixes",
    sublabel: "open projects",
    icon: LayoutGrid,
    path: "/projects",
  },
  {
    label: "Saved",
    sublabel: "bookmarked",
    icon: Bookmark,
    path: "/saved-projects",
  },
  { label: "Find Stems", sublabel: "search", icon: Search, path: "/search" },
  { label: "Syncs", sublabel: "network", icon: Users, path: "/network" },
  { label: "Signals", sublabel: "community", icon: Radio, path: "/community" },
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
const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const navItems = NAV_ITEMS(user?.username);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside
      className="hidden lg:flex fixed left-0 top-0 w-[260px] h-screen z-50 flex-col"
      style={{
        background: "rgba(11, 8, 20, 0.97)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderRight: "1px solid rgba(124, 58, 237, 0.15)",
      }}
    >
      {/* ── LOGO ── */}
      <div
        className="px-6 py-7 flex items-center gap-3 cursor-pointer group"
        style={{ borderBottom: "1px solid rgba(124, 58, 237, 0.12)" }}
        onClick={() => navigate("/")}
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: "var(--rm-bg-raised)",
            border: "1px solid var(--rm-border)",
          }}
        >
          <LogoWave />
        </div>
        <div className="text-left">
          <div className="flex items-baseline gap-0.5 leading-none">
            <span
              className="text-[17px] font-bold"
              style={{ color: "var(--rm-purple-light)" }}
            >
              Rhy
            </span>
            <span className="text-[17px] font-bold text-white">Merge</span>
          </div>
          <p
            className="text-[10px] mt-0.5 tracking-widest uppercase"
            style={{
              fontFamily: "var(--rm-font-mono)",
              color: "var(--rm-text-muted)",
            }}
          >
            where rhythms collide
          </p>
        </div>
      </div>

      {/* ── NAVIGATION ── */}
      <nav className="flex-1 px-3 py-5 overflow-y-auto space-y-1">
        {/* Section label */}
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
              onClick={() => navigate(item.path)}
              className="relative flex items-center gap-3 w-full px-3 py-2.5 rounded-xl transition-all duration-200 group"
              style={
                active
                  ? {
                      background: "rgba(124, 58, 237, 0.14)",
                      border: "1px solid rgba(124, 58, 237, 0.3)",
                    }
                  : {
                      background: "transparent",
                      border: "1px solid transparent",
                    }
              }
              onMouseEnter={(e) => {
                if (!active)
                  e.currentTarget.style.background = "rgba(124, 58, 237, 0.07)";
              }}
              onMouseLeave={(e) => {
                if (!active) e.currentTarget.style.background = "transparent";
              }}
            >
              {/* Active left bar */}
              {active && (
                <div
                  className="absolute left-0 top-2 bottom-2 w-[3px] rounded-full"
                  style={{ background: "var(--rm-purple-light)" }}
                />
              )}

              {/* Icon */}
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200"
                style={
                  active
                    ? {
                        background: "var(--rm-purple-dim)",
                        color: "var(--rm-purple-light)",
                      }
                    : { background: "rgba(255,255,255,0.04)", color: "#6B7280" }
                }
              >
                <Icon size={15} />
              </div>

              {/* Label */}
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
                    opacity: 0.8,
                  }}
                >
                  {item.sublabel}
                </p>
              </div>

              {/* Active waveform */}
              {active && <MiniWave />}
            </button>
          );
        })}
      </nav>

      {/* ── USER STEM ── */}
      <div
        className="p-4 space-y-2"
        style={{ borderTop: "1px solid rgba(124, 58, 237, 0.12)" }}
      >
        {/* Profile row */}
        <button
          onClick={() => navigate(`/profile/${user?.username || ""}`)}
          className="w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200"
          style={{
            background: "rgba(124, 58, 237, 0.07)",
            border: "1px solid var(--rm-border)",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.borderColor = "rgba(124,58,237,0.4)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.borderColor = "var(--rm-border)")
          }
        >
          {/* Avatar with live dot */}
          <div className="relative flex-shrink-0">
            <img
              src={
                user?.avatar ||
                `https://ui-avatars.com/api/?name=${user?.username || "U"}&background=7c3aed&color=fff`
              }
              alt="avatar"
              className="w-9 h-9 rounded-full object-cover"
              style={{ border: "1.5px solid var(--rm-purple)" }}
            />
            <span
              className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full"
              style={{
                background: "var(--rm-green)",
                border: "1.5px solid #0B0814",
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

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200 text-left"
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
    </aside>
  );
};

export default Sidebar;
