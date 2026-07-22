import Conversation, { buildParticipantsKey } from "../models/conversation.js";
import Message from "../models/message.js";
import User from "../models/user.js";
import { encrypt, decrypt } from "../utils/encryption.js";

export const getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({ participants: req.user.id })
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
              // Show "📎 Attachment" in preview if message is attachment-only
              hasAttachment: !!c.lastMessage.attachment?.url,
            }
          : null,
        updatedAt: c.lastMessageAt,
      };
    });

    res.json(result);
  } catch (err) {
    console.error("getConversations:", err);
    res.status(500).json({ msg: "Failed to load conversations" });
  }
};

export const getMessagesWithUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (userId === req.user.id) {
      return res.status(400).json({ msg: "Can't message yourself" });
    }

    const otherUser = await User.findById(userId).select(
      "username name avatar",
    );
    if (!otherUser) return res.status(404).json({ msg: "User not found" });

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
      text: decrypt(m.content) ?? "",
      sender: m.sender._id,
      isRead: m.isRead,
      readAt: m.readAt,
      createdAt: m.createdAt,
      // Include attachment metadata if present
      attachment: m.attachment?.url
        ? {
            url: m.attachment.url,
            name: m.attachment.name,
            type: m.attachment.type,
            size: m.attachment.size,
          }
        : null,
    }));

    res.json({
      conversationId: conversation._id,
      user: otherUser,
      messages: decrypted,
    });
  } catch (err) {
    console.error("getMessagesWithUser:", err);
    res.status(500).json({ msg: "Failed to load messages" });
  }
};

/**
 * Shared helper used by the socket layer.
 * Now also accepts and persists attachment metadata.
 */
export const persistMessage = async ({
  senderId,
  recipientId,
  text,
  attachment,
}) => {
  const participantsKey = buildParticipantsKey(senderId, recipientId);

  let conversation = await Conversation.findOne({ participantsKey });
  if (!conversation) {
    // Only gate the START of a new conversation — someone who already has
    // an existing thread with you (from back when you were open to it, or
    // from before you tightened this setting) can still reply. "Who can
    // message you" is about fielding new contact, not retroactively
    // cutting off conversations you were already part of.
    const recipient = await User.findById(recipientId).select(
      "preferences.privacy connections",
    );
    const permission =
      recipient?.preferences?.privacy?.messagePermission || "everyone";

    if (permission === "nobody") {
      throw new Error("This person isn't accepting new messages right now");
    }
    if (permission === "connections") {
      const isConnection = recipient.connections.some(
        (c) => c.toString() === senderId,
      );
      if (!isConnection) {
        throw new Error("This person only accepts messages from connections");
      }
    }

    conversation = await Conversation.create({
      participants: [senderId, recipientId],
      participantsKey,
    });
  }

  const message = await Message.create({
    conversation: conversation._id,
    sender: senderId,
    content: encrypt(text || ""), // empty string for attachment-only messages
    attachment: attachment?.url
      ? {
          url: attachment.url,
          name: attachment.name || "",
          type: attachment.type || "",
          size: attachment.size || 0,
        }
      : undefined,
  });

  conversation.lastMessage = message._id;
  conversation.lastMessageAt = message.createdAt;
  await conversation.save();

  return { conversation, message };
};
