const map = {
  Available: {
    color: "var(--rm-success)",
    bg: "var(--rm-success-dim)",
    border: "rgba(79,190,138,0.35)",
  },
  Busy: {
    color: "var(--rm-pending)",
    bg: "var(--rm-pending-dim)",
    border: "rgba(234,176,84,0.35)",
  },
  "Not Looking": {
    color: "var(--rm-text-muted)",
    bg: "var(--rm-offline-dim)",
    border: "rgba(90,78,73,0.4)",
  },
};

export default function AvailabilityBadge({ availability }) {
  const s = map[availability] || map["Not Looking"];
  const pulse = availability === "Available" || availability === "Busy";
  return (
    <span
      className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
      style={{
        background: s.bg,
        border: `1px solid ${s.border}`,
        color: s.color,
      }}
    >
      {pulse && (
        <span
          className="w-1.5 h-1.5 rounded-full animate-pulse"
          style={{ background: s.color }}
        />
      )}
      {availability || "Not Looking"}
    </span>
  );
}
