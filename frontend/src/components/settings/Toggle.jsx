const Toggle = ({ enabled, onToggle, disabled = false }) => (
  <button
    onClick={onToggle}
    disabled={disabled}
    className="relative w-12 h-6 rounded-full transition-colors flex-shrink-0 disabled:opacity-40"
    style={{
      background: enabled ? "var(--rm-purple)" : "rgba(255,255,255,0.12)",
    }}
  >
    <span
      className="absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform"
      style={{ transform: enabled ? "translateX(24px)" : "translateX(0)" }}
    />
  </button>
);

export default Toggle;
