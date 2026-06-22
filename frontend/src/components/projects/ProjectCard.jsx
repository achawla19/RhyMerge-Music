import { Music, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";

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

// Tiny waveform, just enough to feel alive on hover
const MiniWave = ({ active }) => {
  const refs = useRef([]);
  useEffect(() => {
    if (!active) return;
    const ids = refs.current.map((bar, i) =>
      setInterval(
        () => {
          if (bar) bar.style.height = `${Math.round(3 + Math.random() * 11)}px`;
        },
        260 + i * 60,
      ),
    );
    return () => ids.forEach(clearInterval);
  }, [active]);

  return (
    <div className="flex items-center gap-[2px]" style={{ height: 14 }}>
      {[5, 9, 6, 11, 7, 4, 8].map((h, i) => (
        <div
          key={i}
          ref={(el) => (refs.current[i] = el)}
          style={{
            width: 2,
            height: h,
            borderRadius: 1,
            background: "var(--rm-purple-light)",
            transition: "height 0.26s ease",
            flexShrink: 0,
            opacity: active ? 1 : 0.4,
          }}
        />
      ))}
    </div>
  );
};

export default function ProjectCard({ project }) {
  const navigate = useNavigate();
  const s = statusStyle[project.status] || statusStyle.Planning;

  return (
    <div
      onClick={() => navigate(`/projects/${project._id}`)}
      className="rm-float-up cursor-pointer rounded-2xl p-5 transition-all"
      style={{
        background: "var(--rm-bg-card)",
        border: "1px solid var(--rm-border)",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.borderColor = "rgba(124,58,237,0.45)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.borderColor = "var(--rm-border)")
      }
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex gap-3 min-w-0">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "var(--rm-purple-dim)" }}
          >
            <Music size={17} color="#C084FC" />
          </div>
          <div className="min-w-0">
            <h3 className="text-white font-semibold text-base truncate">
              {project.title}
            </h3>
            <p
              className="text-xs mt-0.5"
              style={{
                fontFamily: "var(--rm-font-mono)",
                color: "var(--rm-text-muted)",
              }}
            >
              {project.genre || "Untitled genre"}
            </p>
          </div>
        </div>
        <MiniWave active={project.lookingForCollaborators} />
      </div>

      <p
        className="text-sm leading-relaxed line-clamp-3 mb-5"
        style={{ color: "#9CA3AF", minHeight: 60 }}
      >
        {project.description || "No description yet."}
      </p>

      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex gap-2 flex-wrap">
          <span
            className="px-2.5 py-1 rounded-full text-[10px]"
            style={{
              background: s.bg,
              border: `1px solid ${s.border}`,
              color: s.color,
              fontFamily: "var(--rm-font-mono)",
            }}
          >
            {project.status}
          </span>

          {project.lookingForCollaborators ? (
            <span
              className="px-2.5 py-1 rounded-full text-[10px]"
              style={{
                background: "var(--rm-purple-dim)",
                border: "1px solid var(--rm-purple-border)",
                color: "var(--rm-purple-light)",
                fontFamily: "var(--rm-font-mono)",
              }}
            >
              open mix
            </span>
          ) : (
            <span
              className="px-2.5 py-1 rounded-full text-[10px]"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "var(--rm-text-muted)",
                fontFamily: "var(--rm-font-mono)",
              }}
            >
              team complete
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div
            className="flex items-center gap-1 text-xs"
            style={{
              color: "var(--rm-text-muted)",
              fontFamily: "var(--rm-font-mono)",
            }}
          >
            <Users size={12} />
            <span>{(project.collaborators?.length || 0) + 1}</span>
          </div>
          {project.createdAt && (
            <span
              className="text-[10px]"
              style={{
                color: "var(--rm-text-muted)",
                fontFamily: "var(--rm-font-mono)",
              }}
            >
              {new Date(project.createdAt).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
