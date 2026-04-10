import Avatar from "../Avatar";

const ChatItem = ({ user, isActive, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition ${
        isActive
          ? "bg-purple-600/20 border border-purple-500"
          : "hover:bg-[#111118]"
      }`}
    >
      <Avatar src={user.avatar} alt={user.name} online={user.online} />

      <div className="flex-1">
        <p className="text-sm font-semibold text-white">{user.name}</p>
        <p className="text-xs text-gray-400 truncate">{user.lastMessage}</p>
      </div>

      <div className="text-xs text-gray-500">{user.time}</div>
    </div>
  );
};

export default ChatItem;
