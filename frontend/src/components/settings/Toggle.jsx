const Toggle = ({ enabled, onToggle }) => (
  <button
    onClick={onToggle}
    className={`relative w-12 h-6 rounded-full transition-colors duration-300 flex-shrink-0 ${
      enabled ? "bg-purple-600" : "bg-white/15"
    }`}
  >
    <span
      className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
        enabled ? "translate-x-6" : "translate-x-0"
      }`}
    />
  </button>
);
export default Toggle;
