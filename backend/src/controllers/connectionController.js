import User from "../models/user.js";
import { createNotification } from "../utils/createNotification.js";

// SEND CONNECTION REQUEST
export const sendRequest = async (req, res) => {
  try {
    const senderId = req.user.id;
    const receiverId = req.params.id;

    if (senderId === receiverId) {
      return res.status(400).json({
        message: "You cannot connect with yourself",
      });
    }

    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    if (!receiver) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // FIX: .includes() on an array of Mongoose ObjectIds checked against
    // a plain string (req.params.id) always returns false — ObjectId
    // !== string under strict equality, even for the same ID. These
    // guards never actually fired, silently allowing duplicate requests
    // to pile up. Using .some() with .toString() comparison instead,
    // matching the pattern acceptRequest already uses correctly below.
    const alreadyConnected = sender.connections.some(
      (id) => id.toString() === receiverId,
    );
    if (alreadyConnected) {
      return res.status(400).json({
        message: "Already connected",
      });
    }

    const alreadySent = sender.sentRequests.some(
      (id) => id.toString() === receiverId,
    );
    if (alreadySent) {
      return res.status(400).json({
        message: "Request already sent",
      });
    }

    sender.sentRequests.push(receiverId);

    if (!receiver.receivedRequests.some((id) => id.toString() === senderId)) {
      receiver.receivedRequests.push(senderId);
    }

    // validateModifiedOnly guards against the exact same class of bug
    // found earlier in updateMyProfile: a corrupted legacy value sitting
    // in an unrelated field (e.g. a bad old receivedRequests entry) can
    // otherwise fail full-document validation and 500 on a save that has
    // nothing to do with that field.
    await sender.save({ validateModifiedOnly: true });
    await receiver.save({ validateModifiedOnly: true });

    await createNotification({
      recipient: receiverId,
      sender: senderId,
      type: "connection_request",
      title: "New Sync Request",
      description: `${sender.username} wants to sync with you`,
      link: `/profile/${sender.username}`,
      priority: 2,
    });

    res.json({
      message: "Connection request sent",
    });
  } catch (err) {
    console.error("connectionController error:", err);
    res.status(500).json({
      message: "Something went wrong. Please try again.",
    });
  }
};

// ACCEPT REQUEST
export const acceptRequest = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const senderId = req.params.id;

    const currentUser = await User.findById(currentUserId);
    const sender = await User.findById(senderId);

    if (!sender) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // FIX: this previously accepted ANY id passed in the URL, even if
    // that user never actually sent a request — meaning anyone could
    // force a connection onto another account without their consent.
    const hasPendingRequest = currentUser.receivedRequests.some(
      (id) => id.toString() === senderId,
    );

    if (!hasPendingRequest) {
      return res.status(400).json({
        message: "No pending request from this user",
      });
    }

    currentUser.receivedRequests = currentUser.receivedRequests.filter(
      (id) => id.toString() !== senderId,
    );

    sender.sentRequests = sender.sentRequests.filter(
      (id) => id.toString() !== currentUserId,
    );

    if (!currentUser.connections.some((id) => id.toString() === senderId)) {
      currentUser.connections.push(senderId);
    }

    if (!sender.connections.some((id) => id.toString() === currentUserId)) {
      sender.connections.push(currentUserId);
    }

    await currentUser.save({ validateModifiedOnly: true });
    await sender.save({ validateModifiedOnly: true });

    await createNotification({
      recipient: senderId,
      sender: currentUserId,
      type: "connection_accepted",
      title: "Sync Accepted",
      description: `${currentUser.username} accepted your sync request`,
      link: `/profile/${currentUser.username}`,
      priority: 2,
    });

    res.json({
      message: "Request accepted",
    });
  } catch (err) {
    console.error("connectionController error:", err);
    res.status(500).json({
      message: "Something went wrong. Please try again.",
    });
  }
};

// REJECT REQUEST
export const rejectRequest = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const senderId = req.params.id;

    const currentUser = await User.findById(currentUserId);
    const sender = await User.findById(senderId);

    currentUser.receivedRequests = currentUser.receivedRequests.filter(
      (id) => id.toString() !== senderId,
    );

    sender.sentRequests = sender.sentRequests.filter(
      (id) => id.toString() !== currentUserId,
    );

    await currentUser.save({ validateModifiedOnly: true });
    await sender.save({ validateModifiedOnly: true });

    res.json({
      message: "Request rejected",
    });
  } catch (err) {
    console.error("connectionController error:", err);
    res.status(500).json({
      message: "Something went wrong. Please try again.",
    });
  }
};

// GET CONNECTIONS
export const getConnections = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate(
      "connections",
      "username role avatar genres",
    );

    res.json(user.connections);
  } catch (err) {
    console.error("connectionController error:", err);
    res.status(500).json({
      message: "Something went wrong. Please try again.",
    });
  }
};

// GET RECEIVED REQUESTS
export const getRequests = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate(
      "receivedRequests",
      "username role avatar genres",
    );

    res.json(user.receivedRequests);
  } catch (err) {
    console.error("connectionController error:", err);
    res.status(500).json({
      message: "Something went wrong. Please try again.",
    });
  }
};

// GET SENT REQUESTS
export const getSentRequests = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate(
      "sentRequests",
      "username role avatar genres",
    );

    res.json(user.sentRequests);
  } catch (err) {
    console.error("connectionController error:", err);
    res.status(500).json({
      message: "Something went wrong. Please try again.",
    });
  }
};
