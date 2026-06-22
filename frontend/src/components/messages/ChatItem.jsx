import Avatar from "../Avatar";

const ChatItem = ({
  conversation,
  isActive,
  online,
  currentUserId,
  onClick,
}) => {
  const { user, lastMessage } = conversation;

  const isUnread =
    lastMessage && !lastMessage.isRead && lastMessage.sender !== currentUserId;

  const preview = lastMessage
    ? `${lastMessage.sender === currentUserId ? "You: " : ""}${lastMessage.text}`
    : "Say hi 👋";

  const time = lastMessage
    ? new Date(lastMessage.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <div
      onClick={onClick}
      className="flex items-center gap-3 p-3 mx-2 my-1 rounded-xl cursor-pointer transition-all"
      style={
        isActive
          ? {
              background: "var(--rm-purple-dim)",
              border: "1px solid var(--rm-purple-border)",
            }
          : { border: "1px solid transparent" }
      }
      onMouseEnter={(e) =>
        !isActive &&
        (e.currentTarget.style.background = "rgba(255,255,255,0.04)")
      }
      onMouseLeave={(e) =>
        !isActive && (e.currentTarget.style.background = "transparent")
      }
    >
      <Avatar
        src={user.avatar}
        alt={user.name || user.username}
        online={online}
      />
      <div className="flex-1 min-w-0">
        <p
          className="text-sm truncate"
          style={{
            color: "var(--rm-text-primary)",
            fontWeight: isUnread ? 600 : 500,
          }}
        >
          {user.name || user.username}
        </p>
        <p
          className="text-xs truncate"
          style={{
            color: isUnread ? "var(--rm-purple-light)" : "var(--rm-text-muted)",
            fontWeight: isUnread ? 500 : 400,
          }}
        >
          {preview}
        </p>
      </div>
      <div className="flex flex-col items-end gap-1 flex-shrink-0">
        <span
          className="text-[10px]"
          style={{
            color: "var(--rm-text-muted)",
            fontFamily: "var(--rm-font-mono)",
          }}
        >
          {time}
        </span>
        {isUnread && (
          <span
            className="w-2 h-2 rounded-full"
            style={{ background: "var(--rm-purple)" }}
          />
        )}
      </div>
    </div>
  );
};

export default ChatItem;
