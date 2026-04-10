const MessageBubble = ({ message }) => {
  const isMe = message.sender === "me";

  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"} mb-2`}>
      <div
        className={`px-4 py-2 rounded-lg max-w-xs text-sm ${
          isMe ? "bg-purple-600 text-white" : "bg-[#111118] text-gray-300"
        }`}
      >
        <p>{message.text}</p>
        <span className="text-[10px] text-gray-400">{message.time}</span>
      </div>
    </div>
  );
};

export default MessageBubble;
