import { useNavigate } from "react-router-dom";

const statusStyle = {
  Planning: { bg: "rgba(245,158,11,0.1)", color: "#FBBF24" },
  Recording: { bg: "rgba(124,58,237,0.12)", color: "var(--rm-purple-light)" },
  Production: { bg: "rgba(124,58,237,0.12)", color: "var(--rm-purple-light)" },
  Mixing: { bg: "rgba(96,165,250,0.1)", color: "#60A5FA" },
  Completed: { bg: "rgba(16,185,129,0.1)", color: "#34D399" },
};

const ProjectGrid = ({ projects }) => {
  const navigate = useNavigate();

  if (!projects?.length) {
    return (
      <div
        className="rounded-2xl p-16 text-center"
        style={{
          background: "var(--rm-bg-card)",
          border: "1px dashed var(--rm-purple-border)",
        }}
      >
        <h3 className="text-lg font-semibold text-white">No mixes found</h3>
        <p
          className="mt-2 text-sm"
          style={{
            color: "var(--rm-text-muted)",
            fontFamily: "var(--rm-font-mono)",
          }}
        >
          try another search or filter
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {projects.map((project) => {
        const s = statusStyle[project.status] || statusStyle.Planning;
        return (
          <div
            key={project._id}
            onClick={() => navigate(`/projects/${project._id}`)}
            className="rm-float-up rounded-2xl p-5 cursor-pointer transition-all"
            style={{
              background: "var(--rm-bg-card)",
              border: "1px solid var(--rm-border)",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.borderColor = "rgba(124,58,237,0.4)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.borderColor = "var(--rm-border)")
            }
          >
            <div className="flex items-center justify-between">
              <span
                className="px-2.5 py-1 rounded-full text-[10px]"
                style={{
                  background: "var(--rm-purple-dim)",
                  color: "var(--rm-purple-light)",
                  fontFamily: "var(--rm-font-mono)",
                }}
              >
                {project.genre || "Music"}
              </span>
              <span
                className="px-2.5 py-1 rounded-full text-[10px]"
                style={{
                  background: s.bg,
                  color: s.color,
                  fontFamily: "var(--rm-font-mono)",
                }}
              >
                {project.status}
              </span>
            </div>

            <h3 className="mt-4 text-base font-semibold text-white">
              {project.title}
            </h3>
            <p
              className="mt-2 text-sm line-clamp-3"
              style={{ color: "#9CA3AF" }}
            >
              {project.description || "No description available."}
            </p>

            <div
              className="mt-5 pt-4 flex items-center gap-3"
              style={{ borderTop: "1px solid rgba(124,58,237,0.12)" }}
            >
              <img
                src={
                  project.owner?.avatar ||
                  `https://ui-avatars.com/api/?name=${project.owner?.username || "User"}&background=7c3aed&color=fff`
                }
                alt=""
                className="w-9 h-9 rounded-full"
                style={{ border: "1.5px solid var(--rm-purple-border)" }}
              />
              <div>
                <p className="text-sm text-white">{project.owner?.username}</p>
                <p
                  className="text-[10px]"
                  style={{
                    color: "var(--rm-text-muted)",
                    fontFamily: "var(--rm-font-mono)",
                  }}
                >
                  project owner
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProjectGrid;
