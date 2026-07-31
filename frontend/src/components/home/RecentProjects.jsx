import { Music2, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProjects } from "../../api/projects";
import { useProjectPanel } from "../../context/ProjectPanelContext";

const statusStyle = {
  Planning: {
    bg: "var(--rm-pending-dim)",
    border: "rgba(234,176,84,0.35)",
    color: "var(--rm-pending)",
  },
  Recording: {
    bg: "var(--rm-coral-dim)",
    border: "var(--rm-coral-border)",
    color: "var(--rm-coral-light)",
  },
  Production: {
    bg: "var(--rm-coral-dim)",
    border: "var(--rm-coral-border)",
    color: "var(--rm-coral-light)",
  },
  Mixing: {
    bg: "var(--rm-accent-teal-dim)",
    border: "rgba(92,138,122,0.35)",
    color: "var(--rm-accent-teal)",
  },
  Completed: {
    bg: "var(--rm-success-dim)",
    border: "rgba(79,190,138,0.35)",
    color: "var(--rm-success)",
  },
};

export default function RecentProjects() {
  const navigate = useNavigate();
  const { openPanel } = useProjectPanel();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await getProjects(1, 6);
        // const sorted = [...data].sort(
        //   (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        // );
        setProjects(data.projects || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div
      className="rounded-2xl p-5"
      style={{
        background: "var(--rm-bg-card)",
        border: "1px solid var(--rm-border)",
      }}
    >
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-semibold text-white">Recent Projects</h2>
        <button
          onClick={() => navigate("/projects")}
          className="flex items-center gap-1 text-xs transition-colors"
          style={{
            color: "var(--rm-purple-light)",
            fontFamily: "var(--rm-font-mono)",
          }}
        >
          view all <ArrowRight size={13} />
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-16 rounded-xl animate-pulse"
              style={{ background: "rgba(255,255,255,0.03)" }}
            />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <p
          className="text-xs py-6 text-center"
          style={{
            color: "var(--rm-text-muted)",
            fontFamily: "var(--rm-font-mono)",
          }}
        >
          no projects yet — post one
        </p>
      ) : (
        <div className="space-y-3">
          {projects.map((project) => {
            const s = statusStyle[project.status] || statusStyle.Planning;
            return (
              <div
                key={project._id}
                onClick={() => openPanel(project._id)}
                className="p-3.5 rounded-xl cursor-pointer transition-all"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid transparent",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderColor = "var(--rm-coral-border)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.borderColor = "transparent")
                }
              >
                <div className="flex justify-between items-start gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 min-w-0">
                      <Music2
                        size={14}
                        color="#FF8B93"
                        className="flex-shrink-0"
                      />
                      <h3 className="text-sm font-medium text-white truncate">
                        {project.title}
                      </h3>
                    </div>
                    <p
                      className="text-[11px] mt-1.5"
                      style={{
                        color: "var(--rm-text-muted)",
                        fontFamily: "var(--rm-font-mono)",
                      }}
                    >
                      {project.genre || "—"}
                    </p>
                  </div>
                  <span
                    className="px-2.5 py-1 rounded-full text-[10px] flex-shrink-0"
                    style={{
                      background: s.bg,
                      border: `1px solid ${s.border}`,
                      color: s.color,
                      fontFamily: "var(--rm-font-mono)",
                    }}
                  >
                    {project.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
