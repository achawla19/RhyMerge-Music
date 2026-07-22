import { useState } from "react";
import { Moon, Check, Loader2 } from "lucide-react";
import Toggle from "./Toggle";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../ui/Toast";
import { updatePreferences } from "../../api/user";
import { applyAccentColor } from "../../utils/theme";

const accentColors = [
  { hex: "#7C3AED", name: "Groove Violet" },
  { hex: "#EC4899", name: "Pink" },
  { hex: "#3B82F6", name: "Blue" },
  { hex: "#10B981", name: "Green" },
  { hex: "#F59E0B", name: "Warm Brass" },
];

const AppearanceSection = () => {
  const { user, updateUser } = useAuth();
  const toast = useToast();

  const savedAccent = user?.preferences?.accentColor || "#7C3AED";
  const [accent, setAccent] = useState(savedAccent);
  const [saving, setSaving] = useState(false);

  const handlePick = async (hex) => {
    if (hex === accent || saving) return;
    const previous = accent;
    setAccent(hex); // optimistic — the swatch responds instantly
    setSaving(true);
    try {
      const { user: updated } = await updatePreferences({ accentColor: hex });
      updateUser(updated);
      applyAccentColor(hex);
      toast.success("Accent color updated");
    } catch (err) {
      setAccent(previous); // roll back the swatch on failure
      toast.error(err.message || "Couldn't save accent color");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h2 className="text-white font-semibold text-lg mb-1">Appearance</h2>
      <p className="text-sm mb-5" style={{ color: "var(--rm-text-muted)" }}>
        Customize how RhyMerge looks
      </p>

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
                RhyMerge is dark-mode only for now — light mode is on the
                roadmap
              </p>
            </div>
          </div>
          <Toggle enabled={true} onToggle={() => {}} disabled />
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-white text-sm font-medium">Accent Color</p>
            {saving && (
              <Loader2
                size={13}
                className="animate-spin"
                color="var(--rm-text-muted)"
              />
            )}
          </div>
          <div className="flex gap-3">
            {accentColors.map((c) => (
              <button
                key={c.hex}
                type="button"
                onClick={() => handlePick(c.hex)}
                disabled={saving}
                title={c.name}
                aria-label={c.name}
                aria-pressed={accent === c.hex}
                className="w-8 h-8 rounded-full transition-all flex items-center justify-center disabled:cursor-wait"
                style={{
                  background: c.hex,
                  boxShadow:
                    accent === c.hex
                      ? `0 0 0 2px var(--rm-bg-card), 0 0 0 4px ${c.hex}`
                      : "none",
                }}
              >
                {accent === c.hex && (
                  <Check size={14} color="#fff" strokeWidth={3} />
                )}
              </button>
            ))}
          </div>
          <p className="text-xs mt-3" style={{ color: "var(--rm-text-muted)" }}>
            Applies across buttons, links, and highlights. Saved to your
            account.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AppearanceSection;
