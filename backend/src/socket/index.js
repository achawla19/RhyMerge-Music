import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import Message from "../models/message.js";
import Conversation from "../models/conversation.js";
import { persistMessage } from "../controllers/messageController.js";
import { setNotificationSocket } from "../utils/createNotification.js";

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
      origin: (process.env.CLIENT_URL || "http://localhost:5173")
        .split(",")
        .map((o) => o.trim()),
      credentials: true,
    },
  });

  // ── Auth middleware ─────────────────────────────────────────────────────────
  // Accept token from either:
  //   1. httpOnly cookie (Chrome, Firefox, Safari — standard flow)
  //   2. socket.handshake.auth.token (Brave, cross-origin WS scenarios)
  // Both are JWT — verified identically. REST API always uses cookie only.
  io.use((socket, next) => {
    try {
      const token =
        parseCookie(socket.handshake.headers.cookie, "token") ||
        socket.handshake.auth?.token;

      if (!token) return next(new Error("Not authorized"));

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", async (socket) => {
    const userId = socket.userId;
    const wasOffline = !isOnline(userId);

    addOnlineSocket(userId, socket.id);
    socket.join(`user:${userId}`);

    if (wasOffline) {
      const partnerIds = await getConversationPartnerIds(userId);
      partnerIds.forEach((partnerId) => {
        io.to(`user:${partnerId}`).emit("presence_update", {
          userId,
          online: true,
        });
      });
    }

    const myPartnerIds = await getConversationPartnerIds(userId);
    const onlinePartnerIds = myPartnerIds.filter((id) => isOnline(id));
    socket.emit("online_users", onlinePartnerIds);

    // ── SEND MESSAGE ──────────────────────────────────────────────────────────
    socket.on(
      "send_message",
      async ({ recipientId, text, attachment }, callback) => {
        try {
          const hasText = text && text.trim();
          const hasAttachment = attachment?.url;

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

          io.to(`user:${recipientId}`).emit("receive_message", payload);
          io.to(`user:${userId}`).emit("receive_message", payload);
          callback?.({ success: true, message: payload });
        } catch (err) {
          console.error("send_message error:", err);
          callback?.({ error: "Failed to send message" });
        }
      },
    );

    // ── TYPING ────────────────────────────────────────────────────────────────
    socket.on("typing", ({ recipientId }) => {
      if (recipientId) io.to(`user:${recipientId}`).emit("typing", { userId });
    });
    socket.on("stop_typing", ({ recipientId }) => {
      if (recipientId)
        io.to(`user:${recipientId}`).emit("stop_typing", { userId });
    });

    // ── READ RECEIPTS ─────────────────────────────────────────────────────────
    socket.on("mark_read", async ({ conversationId, otherUserId }) => {
      try {
        if (!conversationId) return;
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

    // ── DISCONNECT ────────────────────────────────────────────────────────────
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

  setNotificationSocket(io);
  return io;
};
