import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

import ChatItem from "../components/messages/ChatItem";
import ChatHeader from "../components/messages/ChatHeader";
import MessageBubble from "../components/messages/MessageBubble";
import MessageInput from "../components/messages/MessageInput";

const chats = [
  {
    id: 1,
    name: "Luna Ray",
    role: "Singer",
    avatar: "/assets/who1.jpg",
    lastMessage: "That verse sounds perfect! Sending the stem.",
    time: "2m",
    online: true,
  },
  {
    id: 2,
    name: "Alex Storm",
    role: "Guitarist",
    avatar: "/assets/who1.jpg",
    lastMessage: "Can you check the bridge...",
    time: "1h",
    online: false,
  },
  {
    id: 3,
    name: "Bass Phantom",
    role: "DJ",
    avatar: "/assets/who1.jpg",
    lastMessage: "Beat is ready...",
    time: "5m",
    online: true,
  },
];

const initialMessages = {
  1: [
    {
      id: 1,
      text: "That verse sounds perfect! Sending the stem now.",
      sender: "other",
      time: "2:30 PM",
    },
    {
      id: 2,
      text: "Hey Luna, just uploaded the new vocal take. Let me know what you think!",
      sender: "me",
      time: "2:45 PM",
      file: "vocals_take3.wav",
    },
    {
      id: 3,
      text: "That verse sounds perfect! Sending the stem now.",
      sender: "other",
      time: "3:00 PM",
    },
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
    <div className="h-screen flex text-white overflow-hidden">
      {/* LEFT SIDEBAR (CHAT LIST) */}
      <div className="w-80 glass border-r border-white/10 backdrop-blur-xl flex flex-col">
        {/* HEADER */}
        <div className="p-6 border-b border-white/10">
          <h2 className="text-2xl font-bold">Messages</h2>
        </div>

        {/* CHAT LIST */}
        <div className="flex-1 overflow-y-auto">
          {chats.map((chat) => (
            <motion.div
              key={chat.id}
              whileHover={{ backgroundColor: "rgba(255,255,255,0.04)" }}
            >
              <ChatItem
                user={chat}
                isActive={active === chat.id}
                onClick={() => setActive(chat.id)}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* RIGHT CHAT AREA */}
      <div className="flex-1 flex flex-col bg-[#0a0a12]">
        {currentChat ? (
          <>
            {/* HEADER */}
            <div className="glass border-b border-white/10 backdrop-blur-xl">
              <ChatHeader user={currentChat} />
            </div>

            {/* MESSAGES */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
              {currentMessages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
              ))}
              <div ref={bottomRef} />
            </div>

            {/* INPUT */}
            <div className="glass border-t border-white/10 backdrop-blur-xl">
              <MessageInput onSend={sendMessage} activeChat={active} />
            </div>
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
