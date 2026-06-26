import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

/**
 * Custom Select — replaces every native <select> in the app.
 * Matches the dark card aesthetic exactly.
 *
 * Props:
 *   value        — current value string
 *   onChange     — (value) => void
 *   options      — [{ value, label }] OR ["string", ...]
 *   placeholder  — shown when value is ""
 *   disabled     — greys out
 */
export default function Select({
  value,
  onChange,
  options = [],
  placeholder = "Select...",
  disabled = false,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Normalise options to [{ value, label }]
  const normalised = options.map((o) =>
    typeof o === "string" ? { value: o, label: o } : o,
  );

  const selected = normalised.find((o) => o.value === value);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const pick = (val) => {
    onChange(val);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative w-full" style={{ userSelect: "none" }}>
      {/* Trigger */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm transition-all"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: `1px solid ${open ? "var(--rm-purple)" : "rgba(255,255,255,0.08)"}`,
          color: selected ? "var(--rm-text-primary)" : "var(--rm-text-muted)",
          outline: "none",
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.5 : 1,
        }}
      >
        <span className="truncate">{selected?.label || placeholder}</span>
        <ChevronDown
          size={15}
          style={{
            color: "var(--rm-text-muted)",
            flexShrink: 0,
            marginLeft: 8,
            transition: "transform 0.18s",
            transform: open ? "rotate(180deg)" : "none",
          }}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute z-50 w-full mt-1 rounded-xl overflow-hidden"
          style={{
            background: "#130d24",
            border: "1px solid rgba(124,58,237,0.3)",
            boxShadow: "0 16px 40px rgba(0,0,0,0.55)",
            maxHeight: 240,
            overflowY: "auto",
          }}
        >
          {normalised.map((opt) => {
            const active = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => pick(opt.value)}
                className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-left transition-all"
                style={{
                  background: active ? "rgba(124,58,237,0.18)" : "transparent",
                  color: active
                    ? "var(--rm-purple-light)"
                    : "var(--rm-text-secondary)",
                  borderBottom: "1px solid rgba(255,255,255,0.04)",
                }}
                onMouseEnter={(e) => {
                  if (!active)
                    e.currentTarget.style.background = "rgba(124,58,237,0.08)";
                }}
                onMouseLeave={(e) => {
                  if (!active) e.currentTarget.style.background = "transparent";
                }}
              >
                <span>{opt.label}</span>
                {active && <Check size={13} color="var(--rm-purple-light)" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
