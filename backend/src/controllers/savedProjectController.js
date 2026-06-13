import User from "../models/user.js";

export const toggleSavedProject = async (req, res) => {
  try {
    const { projectId } = req.body;

    const user = await User.findById(req.user.id);

    const exists = user.savedProjects?.some(
      (id) => id.toString() === projectId,
    );

    await User.findByIdAndUpdate(
      req.user.id,
      exists
        ? {
            $pull: {
              savedProjects: projectId,
            },
          }
        : {
            $addToSet: {
              savedProjects: projectId,
            },
          },
    );

    res.json({
      saved: !exists,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      msg: err.message,
    });
  }
};

export const getSavedProjects = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: "savedProjects",
      populate: {
        path: "owner",
        select: "username avatar",
      },
    });

    res.json(user.savedProjects);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      msg: "Failed",
    });
  }
};
