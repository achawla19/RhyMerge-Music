import { useState, useEffect, useRef } from "react";
import ChatItem from "../components/messages/ChatItem";
import ChatHeader from "../components/messages/ChatHeader";
import MessageBubble from "../components/messages/MessageBubble";
import MessageInput from "../components/messages/MessageInput";

const chats = [
  {
    id: 1,
    name: "Chhavi",
    avatar: "/assets/who1.jpg",
    lastMessage: "Hey let's collab 🎵",
    time: "2m",
    online: true,
  },
  {
    id: 2,
    name: "Arjun",
    avatar: "/assets/who1.jpg",
    lastMessage: "Sending you the track",
    time: "1h",
    online: false,
  },
];

const initialMessages = {
  1: [
    { id: 1, text: "Hey!", sender: "other", time: "10:00" },
    { id: 2, text: "What's up?", sender: "me", time: "10:02" },
  ],
};

const Messages = () => {
  const [active, setActive] = useState(1);
  const [messages, setMessages] = useState(initialMessages);

  const bottomRef = useRef();

  const sendMessage = (text) => {
    const newMsg = {
      id: Date.now(),
      text,
      sender: "me",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => ({
      ...prev,
      [active]: [...(prev[active] || []), newMsg],
    }));
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, active]);

  const currentChat = chats.find((c) => c.id === active);
  const currentMessages = messages[active] || [];

  return (
    <div className="flex h-screen bg-[#0a0a12] text-white">
      {/* LEFT */}
      <div className="w-80 border-r border-gray-800">
        <div className="p-4 font-bold text-lg">Messages</div>

        {chats.map((chat) => (
          <ChatItem
            key={chat.id}
            user={chat}
            isActive={active === chat.id}
            onClick={() => setActive(chat.id)}
          />
        ))}
      </div>

      {/* RIGHT */}
      <div className="flex-1 flex flex-col">
        {currentChat ? (
          <>
            <ChatHeader user={currentChat} />

            <div className="flex-1 overflow-y-auto p-4">
              {currentMessages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
              ))}
              <div ref={bottomRef} />
            </div>

            <MessageInput onSend={sendMessage} activeChat={active} />
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a chat
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
