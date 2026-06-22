import { Heart, MessageCircle, Share2, Waves } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { toggleLike } from "../../api/post";
import { addComment } from "../../api/comment";

// ─── Animated waveform (pure CSS, no deps) ───────────────────
const Waveform = ({ bars = 36 }) => {
  const refs = useRef([]);
  useEffect(() => {
    const ids = refs.current.map((bar, i) =>
      setInterval(
        () => {
          if (bar) bar.style.height = `${Math.round(3 + Math.random() * 16)}px`;
        },
        280 + i * 55,
      ),
    );
    return () => ids.forEach(clearInterval);
  }, []);
  return (
    <div className="flex items-center gap-[2px]" style={{ height: 20 }}>
      {Array.from({ length: bars }).map((_, i) => (
        <div
          key={i}
          ref={(el) => (refs.current[i] = el)}
          style={{
            width: 2.5,
            height: Math.round(3 + Math.random() * 14),
            borderRadius: 2,
            background: "var(--rm-purple)",
            opacity: 0.7,
            transition: "height 0.28s ease",
            flexShrink: 0,
          }}
        />
      ))}
    </div>
  );
};

// ─── Signal Card ─────────────────────────────────────────────
const PostCard = ({ post }) => {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const [likes, setLikes] = useState(post.likes || []);
  const [comments, setComments] = useState(post.comments || []);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");

  const isLiked = likes.some((id) => {
    const likeId = id?._id || id;
    return String(likeId) === String(currentUser?._id);
  });

  const handleLike = async () => {
    try {
      if (isLiked) {
        setLikes(
          likes.filter(
            (id) => String(id?._id || id) !== String(currentUser?._id),
          ),
        );
      } else {
        setLikes([...likes, currentUser._id]);
      }
      const updatedLikes = await toggleLike(post._id);
      setLikes(updatedLikes);
    } catch (err) {
      console.error(err);
    }
  };

  const handleComment = async () => {
    if (!commentText.trim()) return;
    try {
      const updatedPost = await addComment(post._id, commentText);
      setComments(updatedPost.comments);
      setCommentText("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <article
      className="rm-float-up"
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
      {/* ── Header ── */}
      <div className="flex items-start gap-3 mb-3">
        <img
          src={
            post.author?.avatar ||
            `https://ui-avatars.com/api/?name=${post.author?.username}&background=7c3aed&color=fff`
          }
          alt=""
          className="w-9 h-9 rounded-full object-cover flex-shrink-0"
          style={{ border: "1.5px solid var(--rm-purple-border)" }}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => navigate(`/profile/${post.author?.username}`)}
              className="text-sm font-semibold transition-colors"
              style={{ color: "var(--rm-text-primary)" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--rm-purple-light)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--rm-text-primary)")
              }
            >
              {post.author?.username}
            </button>
            {post.author?.role && (
              <span
                className="text-[10px] px-2 py-0.5 rounded-full"
                style={{
                  fontFamily: "var(--rm-font-mono)",
                  background: "var(--rm-purple-dim)",
                  color: "var(--rm-purple-light)",
                  border: "1px solid var(--rm-purple-border)",
                }}
              >
                {post.author.role}
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
            {new Date(post.createdAt).toLocaleString()}
          </p>
        </div>
      </div>

      {/* ── Content ── */}
      <p className="text-sm leading-relaxed mb-3" style={{ color: "#D1D5DB" }}>
        {post.content}
      </p>

      {/* ── Waveform player strip ── */}
      <div
        className="flex items-center gap-3 px-3 py-2.5 rounded-xl mb-3"
        style={{
          background: "var(--rm-bg)",
          border: "1px solid var(--rm-purple-border)",
        }}
      >
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: "var(--rm-purple)" }}
        >
          <Waves size={12} color="#fff" />
        </div>
        <Waveform bars={40} />
      </div>

      {/* ── Tags ── */}
      {post.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] px-2.5 py-0.5 rounded-full"
              style={{
                fontFamily: "var(--rm-font-mono)",
                background: "var(--rm-purple-dim)",
                color: "var(--rm-purple-light)",
                border: "1px solid var(--rm-purple-border)",
              }}
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* ── Actions ── */}
      <div
        className="flex items-center gap-5 pt-3"
        style={{ borderTop: "1px solid rgba(124,58,237,0.1)" }}
      >
        {/* Vibe (like) */}
        <button
          onClick={handleLike}
          className="flex items-center gap-1.5 text-xs transition-all"
          style={{
            color: isLiked ? "#C084FC" : "var(--rm-text-muted)",
            fontFamily: "var(--rm-font-mono)",
          }}
        >
          <Heart size={15} fill={isLiked ? "currentColor" : "none"} />
          <span>{likes.length} vibes</span>
        </button>

        {/* Comments */}
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-1.5 text-xs transition-all"
          style={{
            fontFamily: "var(--rm-font-mono)",
            color: "var(--rm-text-muted)",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.color = "var(--rm-purple-light)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "var(--rm-text-muted)")
          }
        >
          <MessageCircle size={15} />
          <span>{comments.length} replies</span>
        </button>

        {/* Broadcast */}
        <button
          className="flex items-center gap-1.5 text-xs transition-all ml-auto"
          style={{
            fontFamily: "var(--rm-font-mono)",
            color: "var(--rm-text-muted)",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.color = "var(--rm-purple-light)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "var(--rm-text-muted)")
          }
        >
          <Share2 size={15} />
          <span>broadcast</span>
        </button>
      </div>

      {/* ── Comments section ── */}
      {showComments && (
        <div
          className="mt-3 pt-3 space-y-2"
          style={{ borderTop: "1px solid rgba(124,58,237,0.1)" }}
        >
          {comments.map((comment) => (
            <div
              key={comment._id}
              className="rounded-xl p-3"
              style={{
                background: "var(--rm-bg)",
                border: "1px solid var(--rm-purple-border)",
              }}
            >
              <p
                className="text-xs font-medium mb-1"
                style={{
                  color: "var(--rm-purple-light)",
                  fontFamily: "var(--rm-font-mono)",
                }}
              >
                {comment.user?.username}
              </p>
              <p className="text-sm" style={{ color: "#D1D5DB" }}>
                {comment.text}
              </p>
            </div>
          ))}

          <div className="flex gap-2 mt-2">
            <input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleComment()}
              placeholder="drop a reply..."
              className="flex-1 rounded-xl px-4 py-2 text-sm outline-none"
              style={{
                background: "var(--rm-bg)",
                border: "1px solid var(--rm-purple-border)",
                color: "white",
                fontFamily: "var(--rm-font-mono)",
              }}
            />
            <button
              onClick={handleComment}
              className="px-4 py-2 rounded-xl text-sm font-medium text-white transition-all"
              style={{ background: "var(--rm-purple)" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#6D28D9")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "var(--rm-purple)")
              }
            >
              send
            </button>
          </div>
        </div>
      )}
    </article>
  );
};

export default PostCard;
