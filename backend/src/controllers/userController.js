import User from "../models/user.js";

export const searchUsers = async (req, res) => {
  try {
    const { q, role, genre } = req.query;

    let query = {};

    if (q) {
      query.$or = [
        { username: { $regex: q, $options: "i" } },
        { name: { $regex: q, $options: "i" } },
        { bio: { $regex: q, $options: "i" } },
      ];
    }

    if (role) query.role = role;
    if (genre) query.genres = genre;

    const users = await User.find(query).limit(20);

    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: "Search failed" });
  }
};

export const sendRequest = async (req, res) => {
  try {
    const senderId = req.user.id;
    const targetId = req.params.id;

    if (senderId === targetId) {
      return res.status(400).json({ msg: "Cannot connect to yourself" });
    }

    const targetUser = await User.findById(targetId);

    if (!targetUser) {
      return res.status(404).json({ msg: "User not found" });
    }

    if (targetUser.followers.includes(senderId)) {
      return res.status(400).json({ msg: "Request already sent" });
    }

    // Add sender to target user's requests
    targetUser.requests.push(senderId);
    await targetUser.save();

    res.json({ msg: "Request sent" });
  } catch (err) {
    res.status(500).json({ msg: "Failed to send request" });
  }
};

export const acceptRequest = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    const sender = await User.findById(req.params.id);

    if (!sender) {
      return res.status(404).json({ msg: "User not found" });
    }

    // remove request
    currentUser.requests = currentUser.requests.filter(
      (id) => id.toString() !== sender._id.toString(),
    );

    // add followers/following
    currentUser.followers.push(sender._id);
    sender.following.push(currentUser._id);

    await currentUser.save();
    await sender.save();

    res.json({ msg: "Connection accepted" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};
