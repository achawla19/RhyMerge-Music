import User from "../models/user.js";

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

    if (sender.connections.includes(receiverId)) {
      return res.status(400).json({
        message: "Already connected",
      });
    }

    if (sender.sentRequests.includes(receiverId)) {
      return res.status(400).json({
        message: "Request already sent",
      });
    }

    sender.sentRequests.push(receiverId);
    receiver.receivedRequests.push(senderId);

    await sender.save();
    await receiver.save();

    res.json({
      message: "Connection request sent",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
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

    currentUser.receivedRequests = currentUser.receivedRequests.filter(
      (id) => id.toString() !== senderId,
    );

    sender.sentRequests = sender.sentRequests.filter(
      (id) => id.toString() !== currentUserId,
    );

    currentUser.connections.push(senderId);
    sender.connections.push(currentUserId);

    await currentUser.save();
    await sender.save();

    res.json({
      message: "Request accepted",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
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

    await currentUser.save();
    await sender.save();

    res.json({
      message: "Request rejected",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
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
    res.status(500).json({
      message: err.message,
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
    res.status(500).json({
      message: err.message,
    });
  }
};
