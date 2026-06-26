import { useState } from "react";
import {
  Sparkles,
  Loader2,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Users,
  Music2,
  RefreshCw,
} from "lucide-react";

const API = import.meta.env.VITE_API_URL;

const Section = ({ icon, title, children }) => (
  <div className="space-y-2">
    <div className="flex items-center gap-2">
      {icon}
      <span
        className="text-xs font-semibold uppercase tracking-wider"
        style={{
          color: "var(--rm-text-muted)",
          fontFamily: "var(--rm-font-mono)",
        }}
      >
        {title}
      </span>
    </div>
    {children}
  </div>
);

export default function AIInsightsPanel({ projectId }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [insight, setInsight] = useState(null);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/api/ai-insights/${projectId}`, {
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Failed");
      setInsight(data.insight);
      setOpen(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggle = () => {
    if (!insight && !loading) {
      load();
      return;
    }
    setOpen((v) => !v);
  };

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, rgba(124,58,237,0.1), rgba(192,132,252,0.06))",
        border: "1px solid var(--rm-purple-border)",
      }}
    >
      <button
        onClick={toggle}
        className="w-full flex items-center justify-between px-5 py-4 transition-all"
        onMouseEnter={(e) =>
          (e.currentTarget.style.background = "rgba(124,58,237,0.08)")
        }
        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{
              background: "var(--rm-purple-dim)",
              border: "1px solid var(--rm-purple-border)",
            }}
          >
            {loading ? (
              <Loader2 size={14} color="#C084FC" className="animate-spin" />
            ) : (
              <Sparkles size={14} color="#C084FC" />
            )}
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-white">
              AI Collab Insights
            </p>
            <p
              className="text-xs"
              style={{
                fontFamily: "var(--rm-font-mono)",
                color: "var(--rm-text-muted)",
              }}
            >
              {loading
                ? "analysing your project..."
                : insight
                  ? "powered by Claude"
                  : "tap to generate"}
            </p>
          </div>
        </div>
        {insight &&
          (open ? (
            <ChevronUp size={16} color="#9CA3AF" />
          ) : (
            <ChevronDown size={16} color="#9CA3AF" />
          ))}
      </button>

      {open && insight && (
        <div
          className="px-5 pb-5 space-y-5 border-t"
          style={{ borderColor: "rgba(124,58,237,0.15)" }}
        >
          <div className="pt-4">
            <p
              className="text-sm leading-relaxed italic"
              style={{ color: "#D1D5DB" }}
            >
              "{insight.summary}"
            </p>
          </div>
          {insight.suggestions?.length > 0 && (
            <Section
              icon={<Lightbulb size={13} color="#FBBF24" />}
              title="Suggestions"
            >
              <ul className="space-y-2">
                {insight.suggestions.map((s, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm"
                    style={{ color: "#9CA3AF" }}
                  >
                    <span
                      className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold"
                      style={{
                        background: "var(--rm-purple-dim)",
                        color: "var(--rm-purple-light)",
                        fontFamily: "var(--rm-font-mono)",
                      }}
                    >
                      {i + 1}
                    </span>
                    {s}
                  </li>
                ))}
              </ul>
            </Section>
          )}
          {insight.idealCollaborators?.length > 0 && (
            <Section
              icon={<Users size={13} color="#34D399" />}
              title="Ideal Collaborators"
            >
              <div className="flex flex-wrap gap-2">
                {insight.idealCollaborators.map((c) => (
                  <span
                    key={c}
                    className="px-3 py-1 rounded-full text-xs"
                    style={{
                      background: "rgba(16,185,129,0.1)",
                      border: "1px solid rgba(16,185,129,0.25)",
                      color: "#34D399",
                    }}
                  >
                    {c}
                  </span>
                ))}
              </div>
            </Section>
          )}
          {insight.productionTips && (
            <Section
              icon={<Music2 size={13} color="#60A5FA" />}
              title="Production Tips"
            >
              <p
                className="text-sm leading-relaxed"
                style={{ color: "#9CA3AF" }}
              >
                {insight.productionTips}
              </p>
            </Section>
          )}
          <button
            onClick={load}
            className="flex items-center gap-1.5 text-xs transition-colors"
            style={{
              color: "var(--rm-text-muted)",
              fontFamily: "var(--rm-font-mono)",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "var(--rm-purple-light)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "var(--rm-text-muted)")
            }
          >
            <RefreshCw size={11} /> regenerate
          </button>
        </div>
      )}
      {error && (
        <p
          className="px-5 pb-4 text-xs"
          style={{ color: "#F87171", fontFamily: "var(--rm-font-mono)" }}
        >
          {error}
        </p>
      )}
    </div>
  );
}
