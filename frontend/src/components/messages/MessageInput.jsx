import { Send, Paperclip } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const TYPING_TIMEOUT_MS = 2000;

const MessageInput = ({ onSend, onTypingChange, activeChat }) => {
  const [text, setText] = useState("");
  const typingTimeoutRef = useRef(null);
  const isTypingRef = useRef(false);

  // Reset draft + typing state when switching chats
  useEffect(() => {
    setText("");
    if (isTypingRef.current) {
      onTypingChange?.(false);
      isTypingRef.current = false;
    }
    clearTimeout(typingTimeoutRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeChat]);

  const handleChange = (e) => {
    setText(e.target.value);

    if (!isTypingRef.current) {
      isTypingRef.current = true;
      onTypingChange?.(true);
    }

    // Debounced stop_typing — only fires once the user actually pauses,
    // instead of emitting on every single keystroke.
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      isTypingRef.current = false;
      onTypingChange?.(false);
    }, TYPING_TIMEOUT_MS);
  };

  const send = () => {
    if (!text.trim()) return;
    onSend(text.trim());
    setText("");

    clearTimeout(typingTimeoutRef.current);
    isTypingRef.current = false;
    onTypingChange?.(false);
  };

  useEffect(() => {
    return () => clearTimeout(typingTimeoutRef.current);
  }, []);

  return (
    <div
      className="p-4 flex gap-3 items-center"
      style={{
        borderTop: "1px solid rgba(124,58,237,0.15)",
        background: "rgba(124,58,237,0.04)",
      }}
    >
      <button
        disabled
        title="File attachments aren't available yet"
        className="p-2.5 rounded-lg flex-shrink-0 opacity-30 cursor-not-allowed"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <Paperclip size={16} color="var(--rm-text-muted)" />
      </button>

      <input
        value={text}
        onChange={handleChange}
        onKeyDown={(e) => e.key === "Enter" && send()}
        placeholder="type a message..."
        className="flex-1 px-4 py-2.5 rounded-full outline-none transition-all"
        style={{
          background: "var(--rm-bg)",
          border: "1px solid var(--rm-purple-border)",
          color: "var(--rm-text-primary)",
        }}
        onFocus={(e) =>
          (e.currentTarget.style.borderColor = "var(--rm-purple)")
        }
        onBlur={(e) =>
          (e.currentTarget.style.borderColor = "var(--rm-purple-border)")
        }
      />

      <button
        onClick={send}
        className="p-3 rounded-full transition-all flex-shrink-0"
        style={{ background: "var(--rm-purple)" }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "#6D28D9")}
        onMouseLeave={(e) =>
          (e.currentTarget.style.background = "var(--rm-purple)")
        }
      >
        <Send size={16} color="#fff" />
      </button>
    </div>
  );
};

export default MessageInput;
