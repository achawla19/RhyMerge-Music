import { useState, useEffect, useRef } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import MobileSidebar from "../components/MobileSidebar";
import useNotifications from "../hooks/useNotifications";
import PulseBar from "../components/pulse/PulseBar";

// ─── Live scrolling ticker ─────────────────────────────────────
// These are fallback strings. As your platform grows you can
// replace this with real-time data from your notifications API.
const TICKER_ITEMS = [
  "🎛️  New producer joined from Chennai",
  "🔀  Merge accepted — 2 stems are now one",
  "🎤  Zara K. dropped a vocal hook in D minor",
  '🔥  "Raag × Trap" is trending this week',
  "🎸  12 open mixes need a guitarist right now",
  "🤝  You have 3 new sync suggestions waiting",
  "🚀  Midnight Protocol EP crossed 10k plays",
  "🎹  New Lo-Fi Desi collab is looking for a pianist",
];

const LiveTicker = () => {
  // Duplicate array so the marquee loops seamlessly
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <div
      className="overflow-hidden flex items-center"
      style={{
        height: 34,
        background: "rgba(124, 58, 237, 0.06)",
        borderBottom: "1px solid rgba(124, 58, 237, 0.14)",
      }}
    >
      {/* LIVE badge */}
      <div
        className="flex items-center gap-1.5 px-4 flex-shrink-0 h-full"
        style={{
          borderRight: "1px solid rgba(124, 58, 237, 0.2)",
          background: "rgba(124, 58, 237, 0.1)",
        }}
      >
        <span
          className="rm-pulse"
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "var(--rm-purple-light)",
            display: "inline-block",
            animation: "rmPulse 1.4s ease-in-out infinite",
          }}
        />
        <span
          style={{
            fontFamily: "var(--rm-font-mono)",
            fontSize: 9,
            fontWeight: 600,
            letterSpacing: "0.2em",
            color: "var(--rm-purple-light)",
            textTransform: "uppercase",
          }}
        >
          live
        </span>
      </div>

      {/* Scrolling track */}
      <div className="flex-1 overflow-hidden">
        <div
          style={{
            display: "flex",
            whiteSpace: "nowrap",
            animation: "rmTicker 36s linear infinite",
          }}
        >
          {items.map((item, i) => (
            <span
              key={i}
              style={{
                fontFamily: "var(--rm-font-mono)",
                fontSize: 11,
                color: "#A78BFA",
                padding: "0 32px",
                flexShrink: 0,
              }}
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Fade edges */}
      <div
        className="absolute"
        style={{
          pointerEvents: "none",
          left: 80,
          top: 0,
          width: 40,
          height: "100%",
          background:
            "linear-gradient(to right, rgba(11,8,20,0.8), transparent)",
        }}
      />
    </div>
  );
};

// ─── Ambient orb — single reusable blob ───────────────────────
const Orb = ({ style }) => (
  <div className="absolute pointer-events-none" style={style} />
);

// ─── Main layout ──────────────────────────────────────────────
const MainLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { notifications } = useNotifications();

  return (
    <>
      {/* Ticker keyframe injected once */}
      <style>{`
        @keyframes rmTicker {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>

      <div
        className="min-h-screen overflow-x-hidden relative"
        style={{ background: "var(--rm-bg)" }}
      >
        {/* ── Ambient background orbs ── */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <Orb
            style={{
              top: -280,
              left: -220,
              width: 640,
              height: 640,
              background: "rgba(124,58,237,0.09)",
              filter: "blur(200px)",
              borderRadius: "50%",
            }}
          />
          <Orb
            style={{
              bottom: -240,
              right: -200,
              width: 560,
              height: 560,
              background: "rgba(139,92,246,0.07)",
              filter: "blur(180px)",
              borderRadius: "50%",
            }}
          />
          <Orb
            style={{
              top: "40%",
              left: "38%",
              width: 360,
              height: 360,
              background: "rgba(245,158,11,0.03)",
              filter: "blur(160px)",
              borderRadius: "50%",
            }}
          />
        </div>

        {/* ── Desktop sidebar ── */}
        <Sidebar />

        {/* ── Mobile sidebar ── */}
        <MobileSidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* ── Main content column ── */}
        <div className="relative z-10 lg:ml-[260px]">
          {/* Sticky top bar stack */}
          <div className="sticky top-0 z-40">
            <Navbar onMenuClick={() => setSidebarOpen(true)} />
            <LiveTicker />
            {/* <PulseBar notifications={notifications} /> */}
          </div>

          {/* Page content */}
          <main className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
            <div
              className="min-h-[calc(100vh-160px)] rounded-2xl lg:rounded-[28px] p-4 sm:p-6 lg:p-8"
              style={{
                background: "rgba(255,255,255,0.028)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.055)",
                boxShadow: "0 20px 80px rgba(0,0,0,0.3)",
              }}
            >
              {children}
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default MainLayout;
