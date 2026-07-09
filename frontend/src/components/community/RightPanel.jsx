import { useState } from "react";
import Trending from "./Trending";
import SuggestedUsers from "./SuggestedUsers";
import { Zap, X, Sparkles } from "lucide-react";

const RightPanel = ({ onTagClick }) => {
  const [showProModal, setShowProModal] = useState(false);

  return (
    <>
      <div className="w-full top-6 h-fit sticky space-y-4">
        <Trending onTagClick={onTagClick} />
        <SuggestedUsers />

        {/* PROMO — now opens a real modal instead of doing nothing */}
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
            onClick={() => setShowProModal(true)}
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

      {/* Pro modal — honest "coming soon" rather than a dead click */}
      {showProModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
          onClick={(e) =>
            e.target === e.currentTarget && setShowProModal(false)
          }
        >
          <div
            className="w-full max-w-sm rounded-2xl p-6 text-center"
            style={{
              background: "var(--rm-bg-card)",
              border: "1px solid var(--rm-purple-border)",
            }}
          >
            <button
              onClick={() => setShowProModal(false)}
              className="absolute top-4 right-4"
              style={{ color: "var(--rm-text-muted)" }}
            >
              <X size={16} />
            </button>
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{
                background: "var(--rm-purple-dim)",
                border: "1px solid var(--rm-purple-border)",
              }}
            >
              <Sparkles size={22} color="#C084FC" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">
              RhyMerge Pro
            </h3>
            <p className="text-sm" style={{ color: "var(--rm-text-muted)" }}>
              Pro plans are launching soon. Be the first to know — we'll notify
              you when it's ready.
            </p>
            <button
              onClick={() => setShowProModal(false)}
              className="w-full mt-5 py-2.5 rounded-xl text-sm font-medium text-white"
              style={{ background: "var(--rm-purple)" }}
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default RightPanel;
