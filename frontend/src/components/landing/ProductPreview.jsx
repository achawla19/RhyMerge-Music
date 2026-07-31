import { motion } from "framer-motion";
import { Layers, Users, FileAudio, CheckCircle2 } from "lucide-react";
import TiltCard from "./TiltCard";

/**
 * Replaces the old WebGL hero. This isn't decorative — it's a static
 * mock of the actual project panel UI (status badge, Overview/Files/Team
 * tabs, a couple of real-looking stem rows, two collaborators), so a
 * visitor who's never seen the app gets an honest preview of what they'd
 * actually be looking at, not an abstract 3D shape with no relationship
 * to the product.
 */
const FILES = [
  { name: "coastal_drift_vocals_v2.wav", type: "Vocals" },
  { name: "coastal_drift_full_mix.wav", type: "Full mix" },
];

const COLLABORATORS = [
  { name: "M. Reyes", role: "Producer" },
  { name: "J. Okafor", role: "Vocalist" },
];

const ProductPreview = () => (
  <TiltCard max={5}>
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="rm-card p-5 md:p-6 max-w-sm mx-auto md:mx-0"
    >
      {/* header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <span className="rm-badge rm-badge-green mb-2 inline-flex items-center gap-1">
            <CheckCircle2 size={10} />
            Completed
          </span>
          <h3 className="text-white font-semibold text-lg leading-tight">
            Coastal Drift
          </h3>
          <div
            className="flex items-center gap-2 mt-1 text-xs"
            style={{ fontFamily: "var(--rm-font-mono)" }}
          >
            <span style={{ color: "var(--rm-coral-light)" }}>LoFi</span>
            <span style={{ color: "var(--rm-text-muted)" }}>·</span>
            <span style={{ color: "var(--rm-accent-teal)" }}>80 BPM</span>
            <span style={{ color: "var(--rm-text-muted)" }}>·</span>
            <span style={{ color: "var(--rm-accent-gold)" }}>G major</span>
          </div>
        </div>
        <div className="rm-waveform h-6 items-end flex-shrink-0">
          {[6, 12, 8, 16, 10, 14, 7].map((h, i) => (
            <span
              key={i}
              className="rm-waveform-bar"
              style={{ height: `${h}px` }}
            />
          ))}
        </div>
      </div>

      {/* tabs (static, decorative — mirrors the real project panel) */}
      <div
        className="flex items-center gap-1 p-1 rounded-xl mb-4"
        style={{ background: "var(--rm-bg-raised)" }}
      >
        <span
          className="flex-1 text-center text-xs py-1.5 rounded-lg"
          style={{ color: "var(--rm-text-muted)" }}
        >
          Overview
        </span>
        <span
          className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium py-1.5 rounded-lg"
          style={{
            background: "var(--rm-coral-dim)",
            color: "var(--rm-coral-light)",
            border: "1px solid var(--rm-coral-border)",
          }}
        >
          <Layers size={11} />
          Files
        </span>
        <span
          className="flex-1 flex items-center justify-center gap-1.5 text-xs py-1.5 rounded-lg"
          style={{ color: "var(--rm-text-muted)" }}
        >
          <Users size={11} />
          Team
        </span>
      </div>

      {/* file rows */}
      <div className="space-y-2 mb-4">
        {FILES.map((f) => (
          <div
            key={f.name}
            className="flex items-center gap-2.5 p-2 rounded-lg"
            style={{ background: "rgba(255,255,255,0.02)" }}
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: "var(--rm-coral-dim)" }}
            >
              <FileAudio size={12} color="var(--rm-coral-light)" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-white truncate">{f.name}</p>
            </div>
            <span
              className="text-[10px] flex-shrink-0"
              style={{
                color: "var(--rm-text-muted)",
                fontFamily: "var(--rm-font-mono)",
              }}
            >
              {f.type}
            </span>
          </div>
        ))}
      </div>

      {/* collaborators */}
      <div
        className="flex items-center justify-between pt-3"
        style={{ borderTop: "1px solid var(--rm-border)" }}
      >
        <div className="flex -space-x-2">
          {COLLABORATORS.map((c) => (
            <img
              key={c.name}
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(c.name)}&background=F9576F&color=fff&size=64`}
              alt={c.name}
              className="w-7 h-7 rounded-full"
              style={{ border: "2px solid var(--rm-bg-card)" }}
            />
          ))}
        </div>
        <span
          className="text-[11px]"
          style={{
            color: "var(--rm-text-muted)",
            fontFamily: "var(--rm-font-mono)",
          }}
        >
          2 collaborators
        </span>
      </div>
    </motion.div>
  </TiltCard>
);

export default ProductPreview;
