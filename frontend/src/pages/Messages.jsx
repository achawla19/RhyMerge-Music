import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { MessageSquareOff } from "lucide-react";

import ChatItem from "../components/messages/ChatItem";
import ChatHeader from "../components/messages/ChatHeader";
import MessageBubble from "../components/messages/MessageBubble";
import MessageInput from "../components/messages/MessageInput";

import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import { useMessages } from "../context/MessagesContext";
import { getMessagesWithUser } from "../api/messages";

const Messages = () => {
  const { user } = useAuth();
  const { socket, isOnline } = useSocket();
  const {
    conversations,
    loaded: loadingListDone,
    markConversationReadLocally,
  } = useMessages();
  const location = useLocation();

  const [activeUser, setActiveUser] = useState(null);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [hasPickedInitial, setHasPickedInitial] = useState(false);

  const bottomRef = useRef();
  const loadingListPending = !loadingListDone;

  // Pick which chat opens first — either one passed via navigation state
  // (a "Message" button elsewhere), or the most recent conversation.
  useEffect(() => {
    if (hasPickedInitial || loadingListPending) return;

    const target = location.state?.startChatWithUser;
    if (target) {
      setActiveUser(target);
    } else if (conversations.length > 0) {
      setActiveUser(conversations[0].user);
    }
    setHasPickedInitial(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadingListPending, conversations.length, hasPickedInitial]);

  // ── Load message history whenever the active chat changes ───
  useEffect(() => {
    if (!activeUser) return;
    setLoadingMessages(true);
    setIsTyping(false);

    (async () => {
      try {
        const data = await getMessagesWithUser(activeUser._id);
        setMessages(data.messages);
        setActiveConversationId(data.conversationId);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingMessages(false);
      }
    })();
  }, [activeUser?._id]);

  // ── Mark unread messages as read when a conversation is open ──
  useEffect(() => {
    if (!socket || !activeConversationId || !activeUser) return;
    const hasUnread = messages.some((m) => m.sender !== user._id && !m.isRead);
    if (hasUnread) {
      socket.emit("mark_read", {
        conversationId: activeConversationId,
        otherUserId: activeUser._id,
      });
      // Updates the navbar badge / conversation list instantly — the
      // socket round trip would eventually do this too, but this avoids
      // a flash of "still unread" while that's in flight.
      markConversationReadLocally(activeConversationId);
    }
  }, [
    socket,
    activeConversationId,
    activeUser,
    messages,
    user._id,
    markConversationReadLocally,
  ]);

  // ── Socket listeners scoped to the OPEN chat only — the conversation
  // list itself (and therefore the navbar badge) is kept in sync by
  // MessagesContext globally, so this only needs to handle what's
  // currently on screen. ──
  useEffect(() => {
    if (!socket) return;

    const handleReceive = (payload) => {
      const isForActiveChat =
        payload.sender === activeUser?._id || payload.sender === user._id;
      const matchesConversation =
        payload.conversationId === activeConversationId ||
        (!activeConversationId && isForActiveChat);

      if (isForActiveChat && matchesConversation) {
        if (!activeConversationId)
          setActiveConversationId(payload.conversationId);
        setMessages((prev) => [...prev, payload]);
      }
    };

    const handleTyping = ({ userId }) => {
      if (userId === activeUser?._id) setIsTyping(true);
    };

    const handleStopTyping = ({ userId }) => {
      if (userId === activeUser?._id) setIsTyping(false);
    };

    const handleMessagesRead = ({ conversationId }) => {
      if (conversationId === activeConversationId) {
        setMessages((prev) =>
          prev.map((m) => (m.sender === user._id ? { ...m, isRead: true } : m)),
        );
      }
    };

    socket.on("receive_message", handleReceive);
    socket.on("typing", handleTyping);
    socket.on("stop_typing", handleStopTyping);
    socket.on("messages_read", handleMessagesRead);

    return () => {
      socket.off("receive_message", handleReceive);
      socket.off("typing", handleTyping);
      socket.off("stop_typing", handleStopTyping);
      socket.off("messages_read", handleMessagesRead);
    };
  }, [socket, activeUser?._id, activeConversationId, user._id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // ── Send ──────────────────────────────────────────────────────
  const sendMessage = useCallback(
    (text, attachment) => {
      if (!socket || !activeUser) return;
      socket.emit(
        "send_message",
        { recipientId: activeUser._id, text, attachment },
        (res) => {
          if (res?.error) console.error(res.error);
        },
      );
      socket.emit("stop_typing", { recipientId: activeUser._id });
    },
    [socket, activeUser],
  );

  const handleTypingChange = useCallback(
    (typing) => {
      if (!socket || !activeUser) return;
      socket.emit(typing ? "typing" : "stop_typing", {
        recipientId: activeUser._id,
      });
    },
    [socket, activeUser],
  );

  return (
    <div
      className="flex flex-col h-full"
      style={{ minHeight: "calc(100vh - 220px)" }}
    >
      <div
        className="flex flex-1 rounded-2xl overflow-hidden"
        style={{ border: "1px solid var(--rm-border)" }}
      >
        {/* CHAT LIST */}
        <div
          className="w-72 flex flex-col flex-shrink-0"
          style={{
            background: "var(--rm-bg-card)",
            borderRight: "1px solid rgba(124,58,237,0.15)",
          }}
        >
          <div
            className="p-5"
            style={{ borderBottom: "1px solid rgba(124,58,237,0.12)" }}
          >
            <h2 className="text-lg font-semibold text-white">Messages</h2>
            <p
              className="text-xs mt-1"
              style={{
                color: "var(--rm-text-muted)",
                fontFamily: "var(--rm-font-mono)",
              }}
            >
              {conversations.length} conversation
              {conversations.length === 1 ? "" : "s"}
            </p>
          </div>

          <div className="flex-1 overflow-y-auto py-2">
            {loadingListPending ? (
              <div className="space-y-2 px-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-14 rounded-xl animate-pulse"
                    style={{ background: "rgba(255,255,255,0.03)" }}
                  />
                ))}
              </div>
            ) : conversations.length === 0 && !activeUser ? (
              <div className="px-4 py-10 text-center">
                <MessageSquareOff
                  size={22}
                  color="#6B7280"
                  className="mx-auto mb-2"
                />
                <p
                  className="text-xs"
                  style={{
                    color: "var(--rm-text-muted)",
                    fontFamily: "var(--rm-font-mono)",
                  }}
                >
                  sync with someone to start messaging
                </p>
              </div>
            ) : (
              conversations.map((convo) => (
                <ChatItem
                  key={convo.user._id}
                  conversation={convo}
                  isActive={activeUser?._id === convo.user._id}
                  online={isOnline(convo.user._id)}
                  currentUserId={user._id}
                  onClick={() => setActiveUser(convo.user)}
                />
              ))
            )}
          </div>
        </div>

        {/* CHAT AREA */}
        <div
          className="flex-1 flex flex-col"
          style={{ background: "var(--rm-bg)" }}
        >
          {activeUser ? (
            <>
              <ChatHeader
                user={activeUser}
                online={isOnline(activeUser._id)}
                isTyping={isTyping}
              />

              <div className="flex-1 overflow-y-auto px-6 py-6">
                {loadingMessages ? (
                  <div className="h-full flex items-center justify-center">
                    <span
                      style={{
                        fontFamily: "var(--rm-font-mono)",
                        fontSize: 12,
                        color: "var(--rm-text-muted)",
                      }}
                    >
                      loading messages...
                    </span>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="h-full flex items-center justify-center">
                    <p
                      className="text-sm"
                      style={{
                        color: "var(--rm-text-muted)",
                        fontFamily: "var(--rm-font-mono)",
                      }}
                    >
                      no messages yet — say hi to{" "}
                      {activeUser.name || activeUser.username}
                    </p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <MessageBubble
                      key={msg._id}
                      message={msg}
                      isMe={msg.sender === user._id}
                    />
                  ))
                )}
                {isTyping && (
                  <div className="flex items-center gap-1.5 px-1 mt-1">
                    <span
                      className="rm-pulse"
                      style={{ width: 5, height: 5 }}
                    />
                    <span
                      style={{
                        fontFamily: "var(--rm-font-mono)",
                        fontSize: 11,
                        color: "var(--rm-text-muted)",
                      }}
                    >
                      {activeUser.name || activeUser.username} is typing...
                    </span>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              <MessageInput
                onSend={sendMessage}
                onTypingChange={handleTypingChange}
                activeChat={activeUser._id}
              />
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-sm" style={{ color: "var(--rm-text-muted)" }}>
                {loadingListPending
                  ? "loading..."
                  : "select a chat to get started"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
