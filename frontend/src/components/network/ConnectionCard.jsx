import { User, MessageCircle, Circle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ConnectionCard({ data }) {
  const navigate = useNavigate();

  // Stats now route somewhere meaningful instead of being static numbers
  const stats = [
    {
      label: "Followers",
      value: data.followers?.length || 0,
      onClick: () => navigate(`/profile/${data.username}`),
    },
    {
      label: "Network",
      value: data.connections?.length || 0,
      onClick: () => navigate(`/profile/${data.username}`),
    },
    {
      label: "Genres",
      value: data.genres?.length || 0,
      onClick: () =>
        navigate(`/search?genre=${encodeURIComponent(data.genres?.[0] || "")}`),
    },
  ];

  return (
    <div
      className="rm-float-up relative overflow-hidden rounded-2xl p-6 transition-all"
      style={{
        background: "var(--rm-bg-card)",
        border: "1px solid var(--rm-border)",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.borderColor = "rgba(249,87,111,0.4)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.borderColor = "var(--rm-border)")
      }
    >
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex gap-4 min-w-0">
          <img
            src={
              data.avatar ||
              `https://ui-avatars.com/api/?name=${data.username}&background=F9576F&color=fff`
            }
            alt=""
            onClick={() => navigate(`/profile/${data.username}`)}
            className="w-16 h-16 rounded-2xl object-cover flex-shrink-0 cursor-pointer"
            style={{ border: "1.5px solid var(--rm-purple-border)" }}
          />
          <div className="min-w-0">
            <h3
              onClick={() => navigate(`/profile/${data.username}`)}
              className="text-lg font-semibold text-white truncate cursor-pointer transition-colors"
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--rm-purple-light)")
              }
              onMouseLeave={(e) => (e.currentTarget.style.color = "#fff")}
            >
              {data.name || data.username}
            </h3>
            <p
              className="text-sm"
              style={{ color: "var(--rm-text-secondary)" }}
            >
              {data.role || "Music Creator"}
            </p>
            <div className="flex items-center gap-1.5 mt-2">
              <Circle size={8} fill="#10B981" color="#10B981" />
              <span
                className="text-xs"
                style={{ color: "#34D399", fontFamily: "var(--rm-font-mono)" }}
              >
                {data.availability || "Available"}
              </span>
            </div>
          </div>
        </div>

        <span
          className="px-3 py-1 rounded-full text-[10px] flex-shrink-0"
          style={{
            background: "var(--rm-purple-dim)",
            color: "var(--rm-purple-light)",
            border: "1px solid var(--rm-purple-border)",
            fontFamily: "var(--rm-font-mono)",
          }}
        >
          synced
        </span>
      </div>

      <p
        className="mt-5 text-sm leading-relaxed min-h-[44px]"
        style={{ color: "#9CA3AF" }}
      >
        {data.bio || "No bio yet."}
      </p>

      {/* Stats — now clickable */}
      <div className="mt-5 grid grid-cols-3 gap-3">
        {stats.map((stat) => (
          <button
            key={stat.label}
            onClick={stat.onClick}
            className="rounded-xl p-3 text-center transition-all"
            style={{ background: "var(--rm-bg)" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "var(--rm-purple-dim)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "var(--rm-bg)")
            }
          >
            <p
              className="text-lg font-bold text-white"
              style={{ fontFamily: "var(--rm-font-mono)" }}
            >
              {stat.value}
            </p>
            <p
              className="text-[10px] mt-0.5"
              style={{ color: "var(--rm-text-muted)" }}
            >
              {stat.label}
            </p>
          </button>
        ))}
      </div>

      {data.genres?.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {data.genres.slice(0, 3).map((genre) => (
            <button
              key={genre}
              onClick={() =>
                navigate(`/search?genre=${encodeURIComponent(genre)}`)
              }
              className="px-2.5 py-1 rounded-full text-[10px] transition-all"
              style={{
                background: "var(--rm-purple-dim)",
                color: "var(--rm-purple-light)",
                border: "1px solid var(--rm-purple-border)",
                fontFamily: "var(--rm-font-mono)",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(249,87,111,0.25)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "var(--rm-purple-dim)")
              }
            >
              {genre}
            </button>
          ))}
        </div>
      )}

      <div className="mt-6 flex gap-3">
        <button
          onClick={() => navigate(`/profile/${data.username}`)}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-white text-sm transition-all"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "rgba(255,255,255,0.08)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "rgba(255,255,255,0.04)")
          }
        >
          <User size={15} /> Profile
        </button>
        <button
          onClick={() =>
            navigate("/messages", {
              state: {
                startChatWithUser: {
                  _id: data._id,
                  username: data.username,
                  name: data.name,
                  avatar: data.avatar,
                  role: data.role,
                },
              },
            })
          }
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-white text-sm font-medium transition-all"
          style={{ background: "var(--rm-purple)" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#D63850")}
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "var(--rm-purple)")
          }
        >
          <MessageCircle size={15} /> Message
        </button>
      </div>
    </div>
  );
}
