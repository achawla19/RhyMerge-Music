import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  LayoutGrid,
  Search,
  Users,
  Settings,
  Library,
  Radio,
  Handshake,
  LogOut,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";

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

// Removed: Home (logo handles it), Profile (avatar handles it), Saved (now Library)
const NAV_ITEMS = [
  {
    label: "Projects",
    sublabel: "open projects",
    icon: LayoutGrid,
    path: "/projects",
  },
  {
    label: "Library",
    sublabel: "your collection",
    icon: Library,
    path: "/library",
  },
  {
    label: "Discover",
    sublabel: "search & explore",
    icon: Search,
    path: "/search",
  },
  {
    label: "Collab",
    sublabel: "find your people",
    icon: Handshake,
    path: "/collab",
  },
  { label: "Syncs", sublabel: "network", icon: Users, path: "/network" },
  { label: "Community", sublabel: "feed", icon: Radio, path: "/community" },
  {
    label: "Settings",
    sublabel: "preferences",
    icon: Settings,
    path: "/settings",
  },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  return (
    <aside
      className="flex w-[240px] h-full flex-col rounded-[20px] overflow-hidden"
      style={{
        background: "rgba(11, 8, 20, 0.97)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        border: "1px solid rgba(124, 58, 237, 0.15)",
      }}
    >
      {/* LOGO — navigates home */}
      <div
        className="px-5 py-5 flex items-center gap-3 cursor-pointer group flex-shrink-0"
        style={{ borderBottom: "1px solid rgba(124, 58, 237, 0.12)" }}
        onClick={() => navigate("/")}
      >
        <img src={logo} alt="RhyMerge" className="h-8 w-auto flex-shrink-0" />
        <div>
          <p
            className="text-[9px] mt-0.5 tracking-widest uppercase"
            style={{
              fontFamily: "var(--rm-font-mono)",
              color: "var(--rm-text-muted)",
            }}
          >
            where rhythms collide
          </p>
        </div>
      </div>

      {/* NAV */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-0.5">
        <p
          className="px-3 mb-3 text-[9px] uppercase tracking-[2px]"
          style={{
            fontFamily: "var(--rm-font-mono)",
            color: "var(--rm-text-muted)",
          }}
        >
          navigate
        </p>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active =
            location.pathname === item.path ||
            (item.path !== "/" && location.pathname.startsWith(item.path));
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="relative flex items-center gap-3 w-full px-3 py-2.5 rounded-xl transition-all duration-200"
              style={
                active
                  ? {
                      background: "rgba(124,58,237,0.14)",
                      border: "1px solid rgba(124,58,237,0.3)",
                    }
                  : {
                      background: "transparent",
                      border: "1px solid transparent",
                    }
              }
              onMouseEnter={(e) => {
                if (!active)
                  e.currentTarget.style.background = "rgba(124,58,237,0.07)";
              }}
              onMouseLeave={(e) => {
                if (!active) e.currentTarget.style.background = "transparent";
              }}
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
                    : { background: "rgba(255,255,255,0.04)", color: "#6B7280" }
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
                    opacity: 0.8,
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

      {/* USER — bottom, logout only (no profile nav here — use avatar in topbar) */}
      <div
        className="p-3 flex-shrink-0"
        style={{ borderTop: "1px solid rgba(124,58,237,0.12)" }}
      >
        <div
          className="flex items-center gap-3 px-3 py-2 rounded-xl mb-1"
          style={{
            background: "rgba(124,58,237,0.07)",
            border: "1px solid var(--rm-border)",
          }}
        >
          <div className="relative flex-shrink-0">
            <img
              src={
                user?.avatar ||
                `https://ui-avatars.com/api/?name=${user?.username || "U"}&background=7c3aed&color=fff`
              }
              alt=""
              className="w-8 h-8 rounded-full object-cover"
              style={{ border: "1.5px solid var(--rm-purple)" }}
            />
            <span
              className="absolute bottom-0 right-0 w-2 h-2 rounded-full"
              style={{ background: "#22C55E", border: "1.5px solid #0B0814" }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-white truncate">
              {user?.name || user?.username}
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
        </div>
        <button
          onClick={async () => {
            await logout();
            window.location.href = "/login";
          }}
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
          <LogOut size={13} />
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
