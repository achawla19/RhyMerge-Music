import Avatar from "../Avatar";
import { Phone, Info } from "lucide-react";

const ChatHeader = ({ user }) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-800">
      <div className="flex items-center gap-3">
        <Avatar src={user.avatar} alt={user.name} online={user.online} />

        <div>
          <p className="text-white font-semibold">{user.name}</p>
          <p className="text-xs text-gray-400">
            {user.online ? "Online" : "Offline"}
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        <button className="p-2 hover:bg-[#111118] rounded-lg">
          <Phone size={18} />
        </button>
        <button className="p-2 hover:bg-[#111118] rounded-lg">
          <Info size={18} />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
