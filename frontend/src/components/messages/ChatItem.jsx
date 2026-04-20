import Avatar from "../Avatar";
import { motion } from "framer-motion";

const ChatItem = ({ user, isActive, onClick }) => {
  return (
    <motion.div
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      className={`flex items-center gap-3 p-3 mx-2 my-1 rounded-xl cursor-pointer transition-all duration-300
        ${
          isActive
            ? "bg-purple-500/30 border border-purple-500/40 shadow-[0_0_20px_rgba(168,85,247,0.25)]"
            : "hover:bg-white/5 border border-transparent"
        } backdrop-blur-md`}
    >
      <Avatar src={user.avatar} alt={user.name} online={user.online} />

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white">{user.name}</p>
        <p className="text-xs text-gray-400 truncate">{user.lastMessage}</p>
      </div>

      <div className="text-[10px] text-gray-500">{user.time}</div>
    </motion.div>
  );
};

export default ChatItem;
