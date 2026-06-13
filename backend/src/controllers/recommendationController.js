import User from "../models/user.js";

export const getRecommendations = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);

    const users = await User.find({
      _id: {
        $ne: req.user.id,
      },
    });

    const recommendations = users
      .map((user) => {
        let score = 0;

        if (user.role && user.role === currentUser.role) {
          score += 5;
        }

        const genreMatches =
          user.genres?.filter((g) => currentUser.genres?.includes(g)).length ||
          0;

        score += genreMatches * 3;

        const mutualConnections =
          user.connections?.filter((id) =>
            currentUser.connections?.map(String).includes(String(id)),
          ).length || 0;

        score += mutualConnections * 2;

        return {
          ...user.toObject(),
          score,
        };
      })
      .sort((a, b) => b.score - a.score);

    res.json(recommendations);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      msg: "Failed",
    });
  }
};
