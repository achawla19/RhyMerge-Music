import { Send, Paperclip } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

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
    <div className="p-4 border-t border-white/10 backdrop-blur-xl bg-white/5 flex gap-3 items-center">
      {/* ATTACH */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10"
      >
        <Paperclip size={18} />
      </motion.button>

      {/* INPUT */}
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && send()}
        placeholder="Type a message..."
        className="flex-1 bg-white/5 border border-white/10 px-4 py-2 rounded-full text-white outline-none placeholder-gray-400 backdrop-blur-md"
      />

      {/* SEND */}
      <motion.button
        onClick={send}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="p-3 rounded-full bg-white/15 border border-purple-400/30 backdrop-blur-md
hover:bg-purple-500/30  text-white shadow-[0_0_20px_rgba(168,85,247,0.5)]"
      >
        <Send size={18} />
      </motion.button>
    </div>
  );
};

export default MessageInput;
