import { useNavigate } from "react-router-dom";

const RequestCard = ({ data, onAccept, onDecline }) => {
  const navigate = useNavigate();

  return (
    <div
      className="flex items-center justify-between gap-4 rounded-2xl p-5 flex-wrap transition-all"
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
      <button
        onClick={() => navigate(`/profile/${data.username}`)}
        className="flex items-center gap-4 text-left min-w-0"
      >
        <img
          src={
            data.avatar ||
            `https://ui-avatars.com/api/?name=${data.username || data.name}&background=7c3aed&color=fff`
          }
          alt=""
          className="w-13 h-13 rounded-full object-cover flex-shrink-0"
          style={{
            width: 52,
            height: 52,
            border: "1.5px solid var(--rm-purple-border)",
          }}
        />
        <div className="min-w-0">
          <p className="font-semibold text-white truncate">{data.username}</p>
          <p
            className="text-sm truncate"
            style={{ color: "var(--rm-text-secondary)" }}
          >
            {data.role || "Music Creator"}
          </p>
          {data.message && (
            <p
              className="text-xs mt-1 italic truncate"
              style={{ color: "var(--rm-text-muted)" }}
            >
              "{data.message}"
            </p>
          )}
        </div>
      </button>

      <div className="flex gap-2 flex-shrink-0">
        <button
          onClick={() => onAccept(data._id)}
          className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
          style={{
            background: "var(--rm-success-dim)",
            color: "var(--rm-success)",
            border: "1px solid rgba(79,190,138,0.35)",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "rgba(79,190,138,0.24)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "var(--rm-success-dim)")
          }
        >
          Accept
        </button>
        <button
          onClick={() => onDecline(data._id)}
          className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
          style={{
            background: "var(--rm-error-dim)",
            color: "var(--rm-error)",
            border: "1px solid rgba(229,72,77,0.3)",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "rgba(229,72,77,0.22)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "var(--rm-error-dim)")
          }
        >
          Decline
        </button>
      </div>
    </div>
  );
};

export default RequestCard;
