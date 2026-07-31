import Avatar from "../Avatar";
import { Phone, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ChatHeader = ({ user, online, isTyping }) => {
  const navigate = useNavigate();

  return (
    <div
      className="flex items-center justify-between px-6 py-4"
      style={{
        borderBottom: "1px solid rgba(249,87,111,0.15)",
        background: "rgba(249,87,111,0.04)",
      }}
    >
      <button
        onClick={() => navigate(`/profile/${user.username}`)}
        className="flex items-center gap-3 text-left"
      >
        <Avatar
          src={user.avatar}
          alt={user.name || user.username}
          online={online}
        />
        <div>
          <p
            className="font-medium text-sm"
            style={{ color: "var(--rm-text-primary)" }}
          >
            {user.name || user.username}
          </p>
          <p
            className="text-xs"
            style={{
              color: isTyping
                ? "var(--rm-purple-light)"
                : online
                  ? "#34D399"
                  : "var(--rm-text-muted)",
              fontFamily: "var(--rm-font-mono)",
            }}
          >
            {isTyping ? "typing..." : online ? "● online" : "● offline"}
          </p>
        </div>
      </button>

      <div className="flex gap-2">
        <button
          disabled
          title="Voice calls aren't available yet"
          className="p-2 rounded-lg opacity-30 cursor-not-allowed"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <Phone size={16} color="var(--rm-text-muted)" />
        </button>
        <button
          onClick={() => navigate(`/profile/${user.username}`)}
          title="View profile"
          className="p-2 rounded-lg transition-all"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.borderColor = "var(--rm-purple-border)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")
          }
        >
          <Info size={16} color="var(--rm-purple-light)" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
