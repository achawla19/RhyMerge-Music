import Trending from "./Trending";
import SuggestedUsers from "./SuggestedUsers";
import { Zap } from "lucide-react";

const RightPanel = () => {
  return (
    <div className="w-full top-6 h-fit sticky space-y-4">
      <Trending />
      <SuggestedUsers />

      {/* PROMO */}
      <div
        className="rounded-2xl p-5 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, rgba(124,58,237,0.18), rgba(192,132,252,0.08))",
          border: "1px solid var(--rm-purple-border)",
        }}
      >
        <div className="flex items-center gap-2 mb-2">
          <Zap size={15} color="#F59E0B" />
          <h3
            className="text-sm font-semibold"
            style={{ color: "var(--rm-text-primary)" }}
          >
            Go Pro
          </h3>
        </div>
        <p
          className="text-xs mb-4"
          style={{ color: "var(--rm-text-secondary)", lineHeight: 1.6 }}
        >
          Unlock unlimited mixes, priority sync requests, and advanced stem
          analytics.
        </p>
        <button
          className="w-full py-2.5 rounded-xl text-sm font-medium text-white transition-all"
          style={{ background: "var(--rm-purple)" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#6D28D9")}
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "var(--rm-purple)")
          }
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default RightPanel;
