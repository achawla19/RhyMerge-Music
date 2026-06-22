import { useEffect, useRef } from "react";

const stats = [
  { label: "Mixes", value: 24 },
  { label: "Syncs", value: 156 },
  { label: "Requests", value: 12 },
  { label: "Messages", value: 48 },
];

// ─── Count-up animation on mount ──────────────────────────────
const CountUp = ({ target }) => {
  const ref = useRef(null);
  useEffect(() => {
    let frame;
    let start = null;
    const duration = 900;
    const animate = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      if (ref.current) ref.current.textContent = Math.round(eased * target);
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [target]);
  return <span ref={ref}>0</span>;
};

const StatsSection = () => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((item, i) => (
        <div
          key={item.label}
          className="h-24 flex flex-col items-center justify-center rounded-2xl rm-float-up"
          style={{
            background: "var(--rm-bg-card)",
            border: "1px solid var(--rm-border)",
            animationDelay: `${i * 0.08}s`,
          }}
        >
          <h3
            className="text-2xl font-bold"
            style={{
              color: "var(--rm-purple-light)",
              fontFamily: "var(--rm-font-mono)",
            }}
          >
            <CountUp target={item.value} />
          </h3>
          <p className="text-xs mt-1" style={{ color: "var(--rm-text-muted)" }}>
            {item.label}
          </p>
        </div>
      ))}
    </div>
  );
};

export default StatsSection;
