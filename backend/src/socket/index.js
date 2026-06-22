import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import Message from "../models/message.js";
import Conversation from "../models/conversation.js";
import { persistMessage } from "../controllers/messageController.js";
import { setNotificationSocket } from "../utils/createNotification.js";

// userId -> Set of socket.ids. A Set (not a single value) because the same
// person can have the app open in multiple tabs/devices at once — they
// should only show "offline" once ALL of those connections close.
const onlineUsers = new Map();

const addOnlineSocket = (userId, socketId) => {
  if (!onlineUsers.has(userId)) onlineUsers.set(userId, new Set());
  onlineUsers.get(userId).add(socketId);
};

const removeOnlineSocket = (userId, socketId) => {
  const sockets = onlineUsers.get(userId);
  if (!sockets) return;
  sockets.delete(socketId);
  if (sockets.size === 0) onlineUsers.delete(userId);
};

const isOnline = (userId) => onlineUsers.has(userId);

// Presence is scoped to people you actually have a CONVERSATION with —
// not the separate "connections" (synced) social graph. Messaging has no
// requirement to be synced first, so using `user.connections` here meant
// two people actively chatting (but not synced) would never see each
// other's online status, even while messages and typing worked fine.
const getConversationPartnerIds = async (userId) => {
  const conversations = await Conversation.find({
    participants: userId,
  }).select("participants");
  const ids = new Set();
  conversations.forEach((c) => {
    c.participants.forEach((p) => {
      const id = p.toString();
      if (id !== userId) ids.add(id);
    });
  });
  return [...ids];
};

// Minimal manual cookie parsing — avoids depending on the `cookie` package
// being a direct dependency (cookie-parser uses it internally, but that
// doesn't guarantee it's resolvable as a top-level import here).
const parseCookie = (cookieHeader, name) => {
  if (!cookieHeader) return null;
  const match = cookieHeader
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.split("=").slice(1).join("=")) : null;
};

export const initSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      credentials: true,
    },
  });

  // Auth middleware — every socket connection must present the same
  // httpOnly JWT cookie used by the REST API. Unauthenticated sockets are
  // rejected before `connection` ever fires.
  io.use((socket, next) => {
    try {
      const token = parseCookie(socket.handshake.headers.cookie, "token");
      if (!token) return next(new Error("Not authorized"));

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch (err) {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", async (socket) => {
    const userId = socket.userId;
    const wasOffline = !isOnline(userId);

    addOnlineSocket(userId, socket.id);
    socket.join(`user:${userId}`);

    // Only broadcast "online" on the FIRST connection for this user (not
    // on every extra tab they open), and only to people you actually
    // have a conversation with.
    if (wasOffline) {
      const partnerIds = await getConversationPartnerIds(userId);
      partnerIds.forEach((partnerId) => {
        io.to(`user:${partnerId}`).emit("presence_update", {
          userId,
          online: true,
        });
      });
    }

    // Let the newly-connected client know who among their conversation
    // partners is currently online, so the UI can show correct dots
    // immediately instead of waiting for the next presence_update.
    const myPartnerIds = await getConversationPartnerIds(userId);
    const onlinePartnerIds = myPartnerIds.filter((id) => isOnline(id));
    socket.emit("online_users", onlinePartnerIds);

    // ── SEND MESSAGE ──────────────────────────────────────────────
    socket.on(
      "send_message",
      async ({ recipientId, text, attachment }, callback) => {
        try {
          const hasText = text && text.trim();
          const hasAttachment = attachment && attachment.url;

          if ((!hasText && !hasAttachment) || !recipientId) {
            return callback?.({ error: "Invalid message" });
          }
          if (recipientId === userId) {
            return callback?.({ error: "Can't message yourself" });
          }

          const { conversation, message } = await persistMessage({
            senderId: userId,
            recipientId,
            text: hasText ? text.trim() : "",
            attachment: hasAttachment ? attachment : null,
          });

          const payload = {
            _id: message._id,
            conversationId: conversation._id,
            text: hasText ? text.trim() : "",
            attachment: hasAttachment ? attachment : null,
            sender: userId,
            isRead: false,
            createdAt: message.createdAt,
          };

          // Deliver to both participants — the sender's other open tabs
          // included, so their UI stays in sync across devices too.
          io.to(`user:${recipientId}`).emit("receive_message", payload);
          io.to(`user:${userId}`).emit("receive_message", payload);

          callback?.({ success: true, message: payload });
        } catch (err) {
          console.error("send_message error:", err);
          callback?.({ error: "Failed to send message" });
        }
      },
    );

    // ── TYPING INDICATORS ─────────────────────────────────────────
    socket.on("typing", ({ recipientId }) => {
      if (!recipientId) return;
      io.to(`user:${recipientId}`).emit("typing", { userId });
    });

    socket.on("stop_typing", ({ recipientId }) => {
      if (!recipientId) return;
      io.to(`user:${recipientId}`).emit("stop_typing", { userId });
    });

    // ── READ RECEIPTS ─────────────────────────────────────────────
    socket.on("mark_read", async ({ conversationId, otherUserId }) => {
      try {
        if (!conversationId) return;

        // Only mark messages the OTHER person sent as read by me —
        // you can't "read" your own messages.
        await Message.updateMany(
          {
            conversation: conversationId,
            sender: { $ne: userId },
            isRead: false,
          },
          { isRead: true, readAt: new Date() },
        );

        if (otherUserId) {
          io.to(`user:${otherUserId}`).emit("messages_read", {
            conversationId,
            readBy: userId,
          });
        }
      } catch (err) {
        console.error("mark_read error:", err);
      }
    });

    // ── DISCONNECT ─────────────────────────────────────────────────
    socket.on("disconnect", async () => {
      removeOnlineSocket(userId, socket.id);

      if (!isOnline(userId)) {
        const partnerIds = await getConversationPartnerIds(userId);
        partnerIds.forEach((partnerId) => {
          io.to(`user:${partnerId}`).emit("presence_update", {
            userId,
            online: false,
          });
        });
      }
    });
  });

  // Lets createNotification() push live updates over this same socket
  // server, instead of recipients only finding out on their next REST poll.
  setNotificationSocket(io);

  return io;
};
