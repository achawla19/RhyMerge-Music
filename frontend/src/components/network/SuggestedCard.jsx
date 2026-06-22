import { UserPlus, MapPin, Music2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SuggestedCard({ data, pending, onConnect }) {
  const navigate = useNavigate();

  return (
    <div
      className="rm-float-up relative overflow-hidden rounded-2xl p-6 transition-all"
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
      <button
        onClick={() => navigate(`/profile/${data.username}`)}
        className="flex items-center gap-4 text-left w-full"
      >
        <img
          src={
            data.avatar ||
            `https://ui-avatars.com/api/?name=${data.username}&background=7c3aed&color=fff`
          }
          alt=""
          className="w-16 h-16 rounded-2xl object-cover flex-shrink-0"
          style={{ border: "1.5px solid var(--rm-purple-border)" }}
        />
        <div className="min-w-0">
          <h3 className="font-semibold text-lg text-white truncate">
            {data.name || data.username}
          </h3>
          <p className="text-sm" style={{ color: "var(--rm-text-secondary)" }}>
            {data.role || "Music Creator"}
          </p>
        </div>
      </button>

      <p
        className="mt-5 text-sm leading-relaxed min-h-[44px]"
        style={{ color: "#9CA3AF" }}
      >
        {data.bio || "Looking for creative collaborations."}
      </p>

      {data.genres?.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {data.genres.slice(0, 3).map((genre) => (
            <span
              key={genre}
              className="px-2.5 py-1 rounded-full text-[10px]"
              style={{
                background: "var(--rm-purple-dim)",
                color: "var(--rm-purple-light)",
                border: "1px solid var(--rm-purple-border)",
                fontFamily: "var(--rm-font-mono)",
              }}
            >
              {genre}
            </span>
          ))}
        </div>
      )}

      <div className="mt-6 flex items-center justify-between flex-wrap gap-3">
        <div
          className="flex items-center gap-3 text-xs"
          style={{
            color: "var(--rm-text-muted)",
            fontFamily: "var(--rm-font-mono)",
          }}
        >
          <div className="flex items-center gap-1">
            <Music2 size={13} />
            <span>{data.experienceLevel || "Beginner"}</span>
          </div>
          {data.location && (
            <div className="flex items-center gap-1">
              <MapPin size={13} />
              <span>{data.location}</span>
            </div>
          )}
        </div>

        <button
          disabled={pending}
          onClick={() => onConnect(data)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all"
          style={
            pending
              ? {
                  background: "rgba(255,255,255,0.04)",
                  color: "var(--rm-text-muted)",
                  cursor: "not-allowed",
                }
              : { background: "var(--rm-purple)", color: "#fff" }
          }
          onMouseEnter={(e) =>
            !pending && (e.currentTarget.style.background = "#6D28D9")
          }
          onMouseLeave={(e) =>
            !pending && (e.currentTarget.style.background = "var(--rm-purple)")
          }
        >
          <UserPlus size={15} />
          {pending ? "pending" : "sync"}
        </button>
      </div>
    </div>
  );
}
