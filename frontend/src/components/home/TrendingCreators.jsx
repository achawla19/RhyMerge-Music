import Avatar from "../Avatar";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getRecommendations } from "../../api/recommendations";

export default function TrendingCreators() {
  const navigate = useNavigate();
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await getRecommendations();
        setCreators(data.slice(0, 3));
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
        <h2 className="text-base font-semibold text-white">Trending Stems</h2>
        <button
          onClick={() => navigate("/network")}
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
              className="h-14 rounded-xl animate-pulse"
              style={{ background: "rgba(255,255,255,0.03)" }}
            />
          ))}
        </div>
      ) : creators.length === 0 ? (
        <p
          className="text-xs py-6 text-center"
          style={{
            color: "var(--rm-text-muted)",
            fontFamily: "var(--rm-font-mono)",
          }}
        >
          no recommendations yet
        </p>
      ) : (
        <div className="space-y-3">
          {creators.map((creator) => (
            <div
              key={creator._id}
              onClick={() => navigate(`/profile/${creator.username}`)}
              className="flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid transparent",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor = "var(--rm-purple-border)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor = "transparent")
              }
            >
              <div className="flex items-center gap-3 min-w-0">
                <Avatar
                  src={creator.avatar}
                  alt={creator.username}
                  size="md"
                  online
                />
                <div className="min-w-0">
                  <h3 className="text-sm font-medium text-white truncate">
                    {creator.name || creator.username}
                  </h3>
                  <p
                    className="text-[11px] truncate"
                    style={{
                      color: "var(--rm-text-muted)",
                      fontFamily: "var(--rm-font-mono)",
                    }}
                  >
                    {creator.role || "Music Creator"}
                  </p>
                </div>
              </div>
              {creator.genres?.[0] && (
                <span
                  className="px-2.5 py-1 rounded-full text-[10px] flex-shrink-0"
                  style={{
                    background: "var(--rm-purple-dim)",
                    color: "var(--rm-purple-light)",
                    border: "1px solid var(--rm-purple-border)",
                    fontFamily: "var(--rm-font-mono)",
                  }}
                >
                  {creator.genres[0]}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
