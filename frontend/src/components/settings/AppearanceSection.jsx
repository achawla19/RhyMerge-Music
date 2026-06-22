import { useState } from "react";
import { Moon, Info } from "lucide-react";
import Toggle from "./Toggle";

const accentColors = [
  { hex: "#7C3AED", name: "Groove Violet" },
  { hex: "#EC4899", name: "Pink" },
  { hex: "#3B82F6", name: "Blue" },
  { hex: "#10B981", name: "Green" },
  { hex: "#F59E0B", name: "Warm Brass" },
];

const AppearanceSection = () => {
  const [accent, setAccent] = useState("#7C3AED");

  return (
    <div>
      <h2 className="text-white font-semibold text-lg mb-1">Appearance</h2>
      <p className="text-sm mb-5" style={{ color: "var(--rm-text-muted)" }}>
        Customize how RhyMerge looks
      </p>

      <div
        className="flex items-start gap-2 text-xs rounded-xl px-3 py-2.5 mb-5"
        style={{
          background: "rgba(245,158,11,0.08)",
          border: "1px solid rgba(245,158,11,0.25)",
          color: "#FBBF24",
        }}
      >
        <Info size={14} className="flex-shrink-0 mt-0.5" />
        <span style={{ fontFamily: "var(--rm-font-mono)" }}>
          theme preferences aren't saved yet — RhyMerge is dark-mode only for
          now
        </span>
      </div>

      <div className="space-y-5">
        <div
          className="flex items-center justify-between py-3"
          style={{ borderBottom: "1px solid rgba(124,58,237,0.1)" }}
        >
          <div className="flex items-center gap-3">
            <Moon size={16} color="#C084FC" />
            <div>
              <p className="text-white text-sm font-medium">Dark Mode</p>
              <p className="text-xs" style={{ color: "var(--rm-text-muted)" }}>
                always on
              </p>
            </div>
          </div>
          <Toggle enabled={true} onToggle={() => {}} disabled />
        </div>

        <div>
          <p className="text-white text-sm font-medium mb-3">Accent Color</p>
          <div className="flex gap-3">
            {accentColors.map((c) => (
              <button
                key={c.hex}
                onClick={() => setAccent(c.hex)}
                title={c.name}
                className="w-8 h-8 rounded-full transition-all"
                style={{
                  background: c.hex,
                  boxShadow:
                    accent === c.hex
                      ? `0 0 0 2px var(--rm-bg-card), 0 0 0 4px ${c.hex}`
                      : "none",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppearanceSection;
