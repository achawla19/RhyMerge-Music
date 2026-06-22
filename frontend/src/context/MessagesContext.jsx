import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useSocket } from "./SocketContext";
import { useAuth } from "./AuthContext";
import { getConversations } from "../api/messages";

const MessagesContext = createContext();

export const MessagesProvider = ({ children }) => {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [conversations, setConversations] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const loadConversations = useCallback(async () => {
    try {
      const data = await getConversations();
      setConversations(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!user) {
      setConversations([]);
      setLoaded(false);
      return;
    }
    loadConversations();
  }, [user?._id, loadConversations]);

  // Real-time — keeps the conversation list (and therefore the navbar
  // badge) in sync no matter which page you're on, not just while the
  // Messages page itself is open.
  useEffect(() => {
    if (!socket || !user) return;

    const handleReceive = (payload) => {
      setConversations((prev) => {
        const exists = prev.some((c) => c._id === payload.conversationId);
        const previewEntry = {
          text: payload.text,
          sender: payload.sender,
          isRead: payload.isRead,
          createdAt: payload.createdAt,
          hasAttachment: !!payload.attachment?.url,
        };

        let next;
        if (exists) {
          next = prev.map((c) =>
            c._id === payload.conversationId
              ? {
                  ...c,
                  lastMessage: previewEntry,
                  updatedAt: payload.createdAt,
                }
              : c,
          );
        } else {
          // Brand-new conversation we didn't have yet — refetch to get
          // the other user's info properly populated rather than
          // guessing at a partial shape.
          loadConversations();
          return prev;
        }

        return next.sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt),
        );
      });
    };

    const handleMessagesRead = ({ conversationId, readBy }) => {
      // Someone read MY message — update that conversation's read state
      // so the sent ticks reflect it everywhere, not just inside an open chat.
      setConversations((prev) =>
        prev.map((c) =>
          c._id === conversationId && c.lastMessage?.sender === user._id
            ? { ...c, lastMessage: { ...c.lastMessage, isRead: true } }
            : c,
        ),
      );
    };

    socket.on("receive_message", handleReceive);
    socket.on("messages_read", handleMessagesRead);
    return () => {
      socket.off("receive_message", handleReceive);
      socket.off("messages_read", handleMessagesRead);
    };
  }, [socket, user, loadConversations]);

  // Called by Messages.jsx the moment a conversation is opened/marked
  // read, so the badge count drops immediately instead of waiting for a
  // round trip.
  const markConversationReadLocally = useCallback((conversationId) => {
    setConversations((prev) =>
      prev.map((c) =>
        c._id === conversationId && c.lastMessage
          ? { ...c, lastMessage: { ...c.lastMessage, isRead: true } }
          : c,
      ),
    );
  }, []);

  const unreadCount = conversations.filter(
    (c) =>
      c.lastMessage &&
      !c.lastMessage.isRead &&
      c.lastMessage.sender !== user?._id,
  ).length;

  return (
    <MessagesContext.Provider
      value={{
        conversations,
        loaded,
        unreadCount,
        loadConversations,
        markConversationReadLocally,
      }}
    >
      {children}
    </MessagesContext.Provider>
  );
};

export const useMessages = () => useContext(MessagesContext);
