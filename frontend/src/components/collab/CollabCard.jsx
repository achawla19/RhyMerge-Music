import { useNavigate } from "react-router-dom";
import { MapPin, Users, Sparkles } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const TERMS_COLOR = {
  Paid: "#34D399",
  "Revenue Split": "#C084FC",
  "Credit Only": "#60A5FA",
  "Just for Fun": "#F59E0B",
};

const timeAgo = (date) => {
  const s = Math.floor((Date.now() - new Date(date)) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
};

const CollabCard = ({ post, onOpen }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isMine = post.postedBy?._id === user?._id;
  const termsColor = TERMS_COLOR[post.terms] || "var(--rm-purple-light)";

  return (
    <article
      className="rm-float-up cursor-pointer"
      onClick={() => onOpen(post)}
      style={{
        background: "var(--rm-bg-card)",
        border: "1px solid var(--rm-border)",
        borderRadius: 14,
        padding: "16px",
        transition: "border-color 0.2s ease",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.borderColor = "rgba(124,58,237,0.4)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.borderColor = "var(--rm-border)")
      }
    >
      <div className="flex items-start gap-3 mb-3">
        <img
          src={
            post.postedBy?.avatar ||
            `https://ui-avatars.com/api/?name=${post.postedBy?.username}&background=7c3aed&color=fff`
          }
          alt=""
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/profile/${post.postedBy?.username}`);
          }}
          className="w-9 h-9 rounded-full object-cover flex-shrink-0 cursor-pointer"
          style={{ border: "1.5px solid var(--rm-purple-border)" }}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="text-sm font-semibold"
              style={{ color: "var(--rm-text-primary)" }}
            >
              {post.postedBy?.username}
            </span>
            {post.postedBy?.role && (
              <span
                className="text-[10px] px-2 py-0.5 rounded-full"
                style={{
                  fontFamily: "var(--rm-font-mono)",
                  background: "var(--rm-purple-dim)",
                  color: "var(--rm-purple-light)",
                  border: "1px solid var(--rm-purple-border)",
                }}
              >
                {post.postedBy.role}
              </span>
            )}
          </div>
          <p
            className="text-[11px] mt-0.5"
            style={{
              fontFamily: "var(--rm-font-mono)",
              color: "var(--rm-text-muted)",
            }}
          >
            {timeAgo(post.createdAt)}
          </p>
        </div>
        {post.status !== "Open" && (
          <span
            className="text-[10px] px-2 py-1 rounded-full flex-shrink-0"
            style={{
              fontFamily: "var(--rm-font-mono)",
              background: "rgba(255,255,255,0.05)",
              color: "var(--rm-text-muted)",
            }}
          >
            {post.status}
          </span>
        )}
      </div>

      <h3 className="text-white font-semibold text-[15px] leading-snug mb-1.5">
        {post.title}
      </h3>
      <p
        className="text-sm leading-relaxed mb-3 line-clamp-2"
        style={{ color: "#D1D5DB" }}
      >
        {post.description}
      </p>

      <div
        className="flex items-center gap-2 px-3 py-2 rounded-xl mb-3"
        style={{
          background: "var(--rm-bg)",
          border: "1px solid var(--rm-purple-border)",
        }}
      >
        <Sparkles
          size={13}
          color="var(--rm-purple-light)"
          className="flex-shrink-0"
        />
        <span className="text-xs" style={{ color: "var(--rm-text-secondary)" }}>
          Looking for{" "}
          <span className="font-semibold text-white">{post.lookingFor}</span>
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-3">
        {post.genres?.slice(0, 3).map((g) => (
          <span
            key={g}
            className="text-[10px] px-2.5 py-0.5 rounded-full"
            style={{
              fontFamily: "var(--rm-font-mono)",
              background: "var(--rm-purple-dim)",
              color: "var(--rm-purple-light)",
              border: "1px solid var(--rm-purple-border)",
            }}
          >
            {g}
          </span>
        ))}
      </div>

      <div
        className="flex items-center gap-4 pt-3 text-xs"
        style={{
          borderTop: "1px solid rgba(124,58,237,0.1)",
          fontFamily: "var(--rm-font-mono)",
        }}
      >
        <span style={{ color: termsColor }}>
          {post.terms}
          {post.termsNote ? ` · ${post.termsNote}` : ""}
        </span>
        {post.location && (
          <span
            className="flex items-center gap-1"
            style={{ color: "var(--rm-text-muted)" }}
          >
            <MapPin size={12} /> {post.location}
          </span>
        )}
        <span
          className="flex items-center gap-1 ml-auto"
          style={{ color: "var(--rm-text-muted)" }}
        >
          <Users size={12} />
          {post.responsesCount || 0} reached out
        </span>
      </div>

      {isMine && (
        <div
          className="mt-2 text-[11px] text-center py-1.5 rounded-lg"
          style={{
            fontFamily: "var(--rm-font-mono)",
            background: "rgba(124,58,237,0.08)",
            color: "var(--rm-purple-light)",
          }}
        >
          your post — tap to view responses
        </div>
      )}
    </article>
  );
};

export default CollabCard;
