import { Send } from "lucide-react";
import { useState, useEffect } from "react";

const MessageInput = ({ onSend, activeChat }) => {
  const [text, setText] = useState("");

  useEffect(() => {
    setText("");
  }, [activeChat]);

  const send = () => {
    if (!text.trim()) return;
    onSend(text);
    setText("");
  };

  return (
    <div className="p-4 border-t border-gray-800 flex gap-2">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && send()}
        placeholder="Type a message..."
        className="flex-1 bg-[#111118] px-3 py-2 rounded-lg text-white outline-none"
      />

      <button onClick={send} className="bg-purple-600 px-3 rounded-lg">
        <Send size={18} />
      </button>
    </div>
  );
};

export default MessageInput;
