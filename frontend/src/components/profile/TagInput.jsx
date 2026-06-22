import { X, Plus } from "lucide-react";
import { useState } from "react";

// Reusable add/remove tag input — used for instruments & certificates
const TagInput = ({ label, hint, items = [], onChange, placeholder }) => {
  const [draft, setDraft] = useState("");

  const addTag = () => {
    const value = draft.trim();
    if (!value || items.includes(value)) {
      setDraft("");
      return;
    }
    onChange([...items, value]);
    setDraft("");
  };

  const removeTag = (tag) => {
    onChange(items.filter((t) => t !== tag));
  };

  return (
    <div>
      <label
        className="text-xs mb-1.5 block"
        style={{
          fontFamily: "var(--rm-font-mono)",
          color: "var(--rm-text-muted)",
        }}
      >
        {label}
      </label>
      {hint && (
        <p
          className="text-[11px] mb-2"
          style={{ color: "var(--rm-text-muted)" }}
        >
          {hint}
        </p>
      )}

      <div className="flex gap-2 mb-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addTag();
            }
          }}
          placeholder={placeholder}
          className="flex-1 rounded-xl px-4 py-2.5 outline-none transition-all text-sm"
          style={{
            background: "var(--rm-bg)",
            border: "1px solid var(--rm-purple-border)",
            color: "var(--rm-text-primary)",
          }}
          onFocus={(e) =>
            (e.currentTarget.style.borderColor = "var(--rm-purple)")
          }
          onBlur={(e) =>
            (e.currentTarget.style.borderColor = "var(--rm-purple-border)")
          }
        />
        <button
          type="button"
          onClick={addTag}
          className="px-3 rounded-xl flex items-center justify-center transition-all flex-shrink-0"
          style={{
            background: "var(--rm-purple-dim)",
            border: "1px solid var(--rm-purple-border)",
            color: "var(--rm-purple-light)",
          }}
        >
          <Plus size={16} />
        </button>
      </div>

      {items.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {items.map((tag) => (
            <span
              key={tag}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs"
              style={{
                background: "var(--rm-purple-dim)",
                border: "1px solid var(--rm-purple-border)",
                color: "var(--rm-purple-light)",
              }}
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="hover:opacity-70"
              >
                <X size={11} />
              </button>
            </span>
          ))}
        </div>
      ) : (
        <p className="text-xs" style={{ color: "var(--rm-text-muted)" }}>
          none added yet
        </p>
      )}
    </div>
  );
};

export default TagInput;
