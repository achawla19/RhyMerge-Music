import { Check, CheckCheck } from "lucide-react";

const MessageBubble = ({ message, isMe }) => {
  return (
    <div
      className={`flex ${isMe ? "justify-end" : "justify-start"} mb-3 rm-slide-in`}
    >
      <div className="max-w-xs">
        <div
          className="px-4 py-2.5 rounded-2xl text-sm"
          style={
            isMe
              ? {
                  background: "var(--rm-purple-dim)",
                  border: "1px solid var(--rm-purple-border)",
                  color: "var(--rm-text-primary)",
                }
              : {
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "#D1D5DB",
                }
          }
        >
          <p style={{ wordBreak: "break-word" }}>{message.text}</p>
        </div>
        <div
          className="flex items-center gap-1 mt-1 px-1"
          style={{ justifyContent: isMe ? "flex-end" : "flex-start" }}
        >
          <span
            className="text-[10px]"
            style={{
              color: "var(--rm-text-muted)",
              fontFamily: "var(--rm-font-mono)",
            }}
          >
            {new Date(message.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
          {/* Read receipts only make sense on messages I sent */}
          {isMe &&
            (message.isRead ? (
              <CheckCheck size={12} color="#C084FC" />
            ) : (
              <Check size={12} color="var(--rm-text-muted)" />
            ))}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
