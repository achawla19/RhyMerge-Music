import { Music2, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProjects } from "../../api/projects";

const statusStyle = {
  Planning: {
    bg: "rgba(245,158,11,0.1)",
    border: "rgba(245,158,11,0.3)",
    color: "#FBBF24",
  },
  Recording: {
    bg: "rgba(124,58,237,0.12)",
    border: "var(--rm-purple-border)",
    color: "var(--rm-purple-light)",
  },
  Production: {
    bg: "rgba(124,58,237,0.12)",
    border: "var(--rm-purple-border)",
    color: "var(--rm-purple-light)",
  },
  Mixing: {
    bg: "rgba(96,165,250,0.1)",
    border: "rgba(96,165,250,0.3)",
    color: "#60A5FA",
  },
  Completed: {
    bg: "rgba(16,185,129,0.1)",
    border: "rgba(16,185,129,0.3)",
    color: "#34D399",
  },
};

export default function RecentProjects() {
  const navigate = useNavigate();
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
        <h2 className="text-base font-semibold text-white">Recent Mixes</h2>
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
          no mixes yet — start one
        </p>
      ) : (
        <div className="space-y-3">
          {projects.map((project) => {
            const s = statusStyle[project.status] || statusStyle.Planning;
            return (
              <div
                key={project._id}
                onClick={() => navigate(`/projects/${project._id}`)}
                className="p-3.5 rounded-xl cursor-pointer transition-all"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid transparent",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderColor =
                    "var(--rm-purple-border)")
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
                        color="#C084FC"
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
