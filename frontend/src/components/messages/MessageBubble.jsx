import { Paperclip } from "lucide-react";
import { motion } from "framer-motion";

const MessageBubble = ({ message }) => {
  const isMe = message.sender === "me";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isMe ? "justify-end" : "justify-start"} mb-3`}
    >
      <div className="max-w-xs">
        <div
          className={`px-4 py-3 rounded-2xl text-sm relative overflow-hidden
            ${
              isMe
                ? "bg-purple-500/30 border border-purple-400/30 text-white backdrop-blur-md shadow-[0_0_10px_rgba(168,85,247,0.15)]"
                : "bg-white/5 border border-white/10 text-gray-200 backdrop-blur-md shadow-[0_0_10px_rgba(168,85,247,0.15)]"
            }`}
        >
          <p>{message.text}</p>

          {/* FILE */}
          {message.file && (
            <div className="mt-2 flex items-center gap-2 bg-black/20 px-3 py-2 rounded-lg">
              <Paperclip size={14} />
              <span className="text-xs">{message.file}</span>
            </div>
          )}
        </div>

        <span className="text-[10px] text-gray-500 mt-1 block px-1">
          {message.time}
        </span>
      </div>
    </motion.div>
  );
};

export default MessageBubble;
