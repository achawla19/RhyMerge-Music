import Avatar from "../Avatar";
import { Phone, Info } from "lucide-react";
import { motion } from "framer-motion";

const ChatHeader = ({ user }) => {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 backdrop-blur-xl bg-white/5">
      {/* LEFT */}
      <div className="flex items-center gap-3">
        <Avatar src={user.avatar} alt={user.name} online={user.online} />

        <div>
          <p className="text-white font-semibold">{user.name}</p>
          <p className="text-xs text-gray-400">
            {user.online ? "● Online" : "● Offline"}
          </p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex gap-2">
        <motion.button
          whileHover={{ scale: 1.1 }}
          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10"
        >
          <Phone size={18} />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10"
        >
          <Info size={18} />
        </motion.button>
      </div>
    </div>
  );
};

export default ChatHeader;
