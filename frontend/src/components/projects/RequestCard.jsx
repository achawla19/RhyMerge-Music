import { Music, Users, Gauge, Hash } from "lucide-react";
import { useEffect, useRef } from "react";
import { useProjectPanel } from "../../context/ProjectPanelContext";

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
            opacity: active ? 1 : 0.35,
          }}
        />
      ))}
    </div>
  );
};

export default function ProjectCard({ project }) {
  const { openPanel, openProjectId } = useProjectPanel();
  const isActive = openProjectId === project._id;
  const s = statusStyle[project.status] || statusStyle.Planning;

  return (
    <div
      onClick={() => openPanel(project._id)}
      className="cursor-pointer rounded-2xl overflow-hidden transition-all"
      style={{
        background: "var(--rm-bg-card)",
        border: isActive
          ? "1px solid rgba(124,58,237,0.6)"
          : "1px solid var(--rm-border)",
        boxShadow: isActive ? "0 0 0 1px rgba(124,58,237,0.3)" : "none",
      }}
      onMouseEnter={(e) => {
        if (!isActive)
          e.currentTarget.style.borderColor = "rgba(124,58,237,0.45)";
      }}
      onMouseLeave={(e) => {
        if (!isActive) e.currentTarget.style.borderColor = "var(--rm-border)";
      }}
    >
      {/* Cover strip */}
      {project.coverImage ? (
        <div
          className="h-28 w-full overflow-hidden"
          style={{ background: `url(${project.coverImage}) center/cover` }}
        />
      ) : (
        <div
          className="h-2 w-full"
          style={{
            background:
              "linear-gradient(90deg, var(--rm-purple) 0%, #C084FC 100%)",
            opacity: 0.6,
          }}
        />
      )}

      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex gap-3 min-w-0">
            {!project.coverImage && (
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "var(--rm-purple-dim)" }}
              >
                <Music size={16} color="#C084FC" />
              </div>
            )}
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
                {project.genre || "No genre set"}
              </p>
            </div>
          </div>
          <MiniWave active={project.lookingForCollaborators} />
        </div>

        <p
          className="text-sm leading-relaxed line-clamp-2 mb-4"
          style={{ color: "#9CA3AF", minHeight: 40 }}
        >
          {project.description || "No description yet."}
        </p>

        {(project.bpm || project.musicalKey) && (
          <div className="flex gap-3 mb-3">
            {project.bpm && (
              <span
                className="flex items-center gap-1 text-xs"
                style={{ fontFamily: "var(--rm-font-mono)", color: "#60A5FA" }}
              >
                <Gauge size={11} />
                {project.bpm} BPM
              </span>
            )}
            {project.musicalKey && (
              <span
                className="flex items-center gap-1 text-xs"
                style={{ fontFamily: "var(--rm-font-mono)", color: "#FBBF24" }}
              >
                <Hash size={11} />
                {project.musicalKey}
              </span>
            )}
          </div>
        )}

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
          <div className="flex items-center gap-2">
            <div
              className="flex items-center gap-1 text-xs"
              style={{
                color: "var(--rm-text-muted)",
                fontFamily: "var(--rm-font-mono)",
              }}
            >
              <Users size={12} />
              {(project.collaborators?.length || 0) + 1}
            </div>
            {project.owner?.avatar && (
              <img
                src={project.owner.avatar}
                alt=""
                className="w-5 h-5 rounded-full"
                style={{ border: "1px solid var(--rm-purple-border)" }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
