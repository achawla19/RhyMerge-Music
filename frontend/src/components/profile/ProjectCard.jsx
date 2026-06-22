import { Calendar, Users, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProjectCard = ({
  _id,
  title,
  description,
  collaborators = [],
  createdAt,
  genre,
  status,
}) => {
  const navigate = useNavigate();

  return (
    <div
      className="rounded-xl p-5 transition-all duration-300 group"
      style={{
        background: "var(--rm-bg)",
        border: "1px solid var(--rm-border)",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.borderColor = "rgba(124,58,237,0.4)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.borderColor = "var(--rm-border)")
      }
    >
      <div className="flex justify-between items-start mb-3 gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-white truncate">
            {title}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            {genre && (
              <span
                className="text-xs"
                style={{
                  color: "var(--rm-purple-light)",
                  fontFamily: "var(--rm-font-mono)",
                }}
              >
                {genre}
              </span>
            )}
            {status && (
              <span
                className="text-[10px] px-2 py-0.5 rounded-full"
                style={{
                  background: "var(--rm-purple-dim)",
                  color: "var(--rm-purple-light)",
                  fontFamily: "var(--rm-font-mono)",
                }}
              >
                {status}
              </span>
            )}
          </div>
        </div>

        {createdAt && (
          <span
            className="text-xs flex items-center gap-1 flex-shrink-0"
            style={{
              color: "var(--rm-text-muted)",
              fontFamily: "var(--rm-font-mono)",
            }}
          >
            <Calendar size={12} />
            {new Date(createdAt).toLocaleDateString()}
          </span>
        )}
      </div>

      <p
        className="text-sm leading-relaxed mb-4 line-clamp-2"
        style={{ color: "#9CA3AF" }}
      >
        {description || "No description yet."}
      </p>

      {collaborators.length > 0 && (
        <div className="flex items-start gap-2 mb-4">
          <Users size={14} color="#C084FC" className="mt-0.5 flex-shrink-0" />
          <div className="flex flex-wrap gap-2">
            {collaborators.map((collab) => (
              // collaborators are populated user objects ({_id, username, name, avatar}),
              // not strings — render the username, not the object itself.
              <span
                key={collab._id || collab.username}
                className="px-2 py-1 rounded-full text-xs"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  color: "var(--rm-text-secondary)",
                }}
              >
                {collab.username || collab.name}
              </span>
            ))}
          </div>
        </div>
      )}

      <div
        className="pt-4"
        style={{ borderTop: "1px solid rgba(124,58,237,0.1)" }}
      >
        <button
          onClick={() => navigate(`/projects/${_id}`)}
          className="text-sm flex items-center gap-1 transition-colors"
          style={{ color: "var(--rm-purple-light)" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "var(--rm-purple-light)")
          }
        >
          View Details
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default ProjectCard;
