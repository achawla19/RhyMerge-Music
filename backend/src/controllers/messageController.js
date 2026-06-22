import Conversation, { buildParticipantsKey } from "../models/conversation.js";
import Message from "../models/message.js";
import User from "../models/user.js";
import { encrypt, decrypt } from "../utils/encryption.js";

// GET /api/messages/conversations
// Returns every conversation the current user is part of, with the other
// participant's info and a decrypted preview of the last message.
export const getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user.id,
    })
      .sort({ lastMessageAt: -1 })
      .populate("participants", "username name avatar")
      .populate("lastMessage");

    const result = conversations.map((c) => {
      const other = c.participants.find(
        (p) => p._id.toString() !== req.user.id,
      );

      return {
        _id: c._id,
        user: other,
        lastMessage: c.lastMessage
          ? {
              text: decrypt(c.lastMessage.content) ?? "",
              sender: c.lastMessage.sender,
              isRead: c.lastMessage.isRead,
              createdAt: c.lastMessage.createdAt,
            }
          : null,
        updatedAt: c.lastMessageAt,
      };
    });

    res.json(result);
  } catch (err) {
    console.error("getConversations error:", err);
    res.status(500).json({ msg: "Failed to load conversations" });
  }
};

// GET /api/messages/:userId
// Gets (or implicitly prepares to create) the conversation with a specific
// user and returns full decrypted message history. The conversation
// itself is only actually created in the DB once a message is sent
// (see socket handler) — viewing an empty chat shouldn't write anything.
export const getMessagesWithUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (userId === req.user.id) {
      return res.status(400).json({ msg: "Can't message yourself" });
    }

    const otherUser = await User.findById(userId).select(
      "username name avatar",
    );
    if (!otherUser) {
      return res.status(404).json({ msg: "User not found" });
    }

    const participantsKey = buildParticipantsKey(req.user.id, userId);
    const conversation = await Conversation.findOne({ participantsKey });

    if (!conversation) {
      return res.json({ conversationId: null, user: otherUser, messages: [] });
    }

    const messages = await Message.find({ conversation: conversation._id })
      .sort({ createdAt: 1 })
      .populate("sender", "username name avatar");

    const decrypted = messages.map((m) => ({
      _id: m._id,
      text: decrypt(m.content) ?? "[message could not be decrypted]",
      sender: m.sender._id,
      isRead: m.isRead,
      readAt: m.readAt,
      createdAt: m.createdAt,
    }));

    res.json({
      conversationId: conversation._id,
      user: otherUser,
      messages: decrypted,
    });
  } catch (err) {
    console.error("getMessagesWithUser error:", err);
    res.status(500).json({ msg: "Failed to load messages" });
  }
};

/**
 * Shared helper used by the socket layer too — finds-or-creates the
 * conversation between two users and persists one encrypted message.
 * Exported so socket/index.js can reuse the exact same write path
 * instead of duplicating this logic.
 */
export const persistMessage = async ({ senderId, recipientId, text }) => {
  const participantsKey = buildParticipantsKey(senderId, recipientId);

  let conversation = await Conversation.findOne({ participantsKey });
  if (!conversation) {
    conversation = await Conversation.create({
      participants: [senderId, recipientId],
      participantsKey,
    });
  }

  const message = await Message.create({
    conversation: conversation._id,
    sender: senderId,
    content: encrypt(text),
  });

  conversation.lastMessage = message._id;
  conversation.lastMessageAt = message.createdAt;
  await conversation.save();

  return { conversation, message };
};
