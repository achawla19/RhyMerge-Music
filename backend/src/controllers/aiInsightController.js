import User from "../models/user.js";
import Project from "../models/project.js";
import Notification from "../models/notification.js";

export const generateAIInsights = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        msg: "User not found",
      });
    }

    const insights = [];

    // ROLE INSIGHT

    if (user.role) {
      const similarUsers = await User.countDocuments({
        role: user.role,
      });

      insights.push({
        type: "ai_insight",
        title: `✨ There are ${similarUsers} ${user.role}s on RhyMerge`,
        description:
          "Build more connections to increase collaboration opportunities.",
        link: "/network",
        priority: 1,
      });
    }

    // GENRE INSIGHT

    if (user.genres?.length > 0) {
      insights.push({
        type: "ai_insight",
        title: `🎵 Your strongest genre is ${user.genres[0]}`,
        description:
          "Projects matching this genre are more likely to accept you.",
        link: "/projects",
        priority: 1,
      });
    }

    // CONNECTION INSIGHT

    const connectionCount = user.connections?.length || 0;

    if (connectionCount < 5) {
      insights.push({
        type: "ai_insight",
        title: "🤝 Grow your network",
        description:
          "Creators with 5+ collaborators get significantly more opportunities.",
        link: "/network",
        priority: 1,
      });
    }

    // PROJECT INSIGHT

    const openProjects = await Project.countDocuments({
      status: "open",
    });

    insights.push({
      type: "ai_insight",
      title: `🚀 ${openProjects} projects are actively recruiting`,
      description: "Explore projects that match your role and genres.",
      link: "/projects",
      priority: 2,
    });

    // SAVE INSIGHTS AS NOTIFICATIONS

    for (const insight of insights) {
      const exists = await Notification.findOne({
        recipient: user._id,
        title: insight.title,
      });

      if (!exists) {
        await createNotification({
          recipient: project.owner,
          sender: user._id,

          type: "project_request",

          title: "New Project Request",

          description: `${user.username} wants to join your project`,

          link: `/projects/${project._id}`,

          project: project._id,

          priority: 1,
        });
      }
    }

    res.json(insights);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      msg: "Failed to generate insights",
    });
  }
};
