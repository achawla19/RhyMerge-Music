import { TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { getPosts } from "../../api/post";

const Trending = ({ onTagClick }) => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const posts = await getPosts();
        const counts = {};
        posts.forEach((post) => {
          (post.tags || []).forEach((tag) => {
            counts[tag] = (counts[tag] || 0) + 1;
          });
        });
        setTags(
          Object.entries(counts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 6)
            .map(([tag, count]) => ({ tag, count })),
        );
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
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp size={15} color="#C084FC" />
        <h2
          className="text-xs font-semibold uppercase tracking-wider"
          style={{
            fontFamily: "var(--rm-font-mono)",
            color: "var(--rm-purple-light)",
          }}
        >
          trending frequencies
        </h2>
      </div>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-9 rounded-xl animate-pulse"
              style={{ background: "rgba(255,255,255,0.03)" }}
            />
          ))}
        </div>
      ) : tags.length === 0 ? (
        <p
          className="text-xs py-4 text-center"
          style={{
            color: "var(--rm-text-muted)",
            fontFamily: "var(--rm-font-mono)",
          }}
        >
          no tagged signals yet
        </p>
      ) : (
        <div className="space-y-2">
          {tags.map((t, i) => (
            <button
              key={t.tag}
              onClick={() => onTagClick?.(t.tag)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all"
              style={{ background: "rgba(255,255,255,0.02)" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "var(--rm-purple-dim)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.02)")
              }
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span
                  className="text-[10px] w-4 flex-shrink-0"
                  style={{
                    fontFamily: "var(--rm-font-mono)",
                    color: "var(--rm-text-muted)",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className="text-sm truncate"
                  style={{ color: "var(--rm-text-primary)" }}
                >
                  #{t.tag}
                </span>
              </div>
              <span
                className="text-[10px] flex-shrink-0"
                style={{
                  fontFamily: "var(--rm-font-mono)",
                  color: "var(--rm-purple-light)",
                }}
              >
                {t.count}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Trending;
