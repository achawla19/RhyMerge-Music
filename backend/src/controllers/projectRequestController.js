import ProjectRequest from "../models/projectRequest.js";
import Project from "../models/project.js";
import Notification from "../models/notification.js";

export const createProjectRequest = async (req, res) => {
  try {
    const { projectId, role, message } = req.body;

    const existing = await ProjectRequest.findOne({
      project: projectId,
      sender: req.user.id,
      status: "Pending",
    });

    if (existing) {
      return res.status(400).json({
        msg: "Request already sent",
      });
    }

    const request = await ProjectRequest.create({
      project: projectId,
      sender: req.user.id,
      role,
      message,
    });
    const project = await Project.findById(projectId);

    await Notification.create({
      recipient: project.owner,

      sender: req.user.id,

      type: "project_request",

      project: projectId,
    });

    res.status(201).json(request);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      msg: "Failed to send request",
    });
  }
};

export const getProjectRequests = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        msg: "Project not found",
      });
    }

    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({
        msg: "Forbidden",
      });
    }

    const requests = await ProjectRequest.find({
      project: projectId,
      status: "Pending",
    })
      .populate("sender", "username avatar role")
      .sort({
        createdAt: -1,
      });

    res.json(requests);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      msg: "Failed",
    });
  }
};

export const acceptProjectRequest = async (req, res) => {
  try {
    const request = await ProjectRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        msg: "Request not found",
      });
    }

    const project = await Project.findById(request.project);

    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({
        msg: "Forbidden",
      });
    }

    request.status = "Accepted";

    await request.save();

    if (
      !project.collaborators.some(
        (id) => id.toString() === request.sender.toString(),
      )
    ) {
      project.collaborators.push(request.sender);
    }

    await project.save();

    await Notification.create({
      recipient: request.sender,
      sender: req.user.id,
      type: "request_accepted",
      project: request.project,
    });

    res.json({
      msg: "Accepted",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      msg: "Failed",
    });
  }
};

export const rejectProjectRequest = async (req, res) => {
  try {
    const request = await ProjectRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        msg: "Request not found",
      });
    }

    request.status = "Rejected";

    await request.save();

    await Notification.create({
      recipient: request.sender,
      sender: req.user.id,
      type: "request_rejected",
      project: request.project,
    });

    res.json({
      msg: "Rejected",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      msg: "Failed",
    });
  }
};

export const getMyProjectRequest = async (req, res) => {
  try {
    const request = await ProjectRequest.findOne({
      project: req.params.projectId,
      sender: req.user.id,
      status: "Pending",
    });

    res.json({
      exists: !!request,
    });
  } catch (err) {
    res.status(500).json({
      msg: "Failed",
    });
  }
};
