const map = {
  Available: {
    color: "#34D399",
    bg: "rgba(16,185,129,0.1)",
    border: "rgba(16,185,129,0.3)",
  },
  Busy: {
    color: "#FBBF24",
    bg: "rgba(245,158,11,0.1)",
    border: "rgba(245,158,11,0.3)",
  },
  "Not Looking": {
    color: "#6B7280",
    bg: "rgba(107,114,128,0.1)",
    border: "rgba(107,114,128,0.3)",
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
