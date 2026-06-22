import ProjectRequest from "../models/projectRequest.js";
import Project from "../models/project.js";
import User from "../models/user.js";
import { createNotification } from "../utils/createNotification.js";

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
    const sender = await User.findById(req.user.id).select("username");

    // Notify the project owner that someone wants to join.
    // (Previously this referenced an undefined `user` variable and crashed
    // every single time — meaning the request was created in the database
    // but the API call always appeared to fail on the frontend.)
    await createNotification({
      recipient: project.owner,
      sender: req.user.id,
      type: "project_request",
      title: "New Project Request",
      description: `${sender.username} wants to join your project`,
      link: `/projects/${project._id}`,
      project: project._id,
      priority: 1,
    });

    res.status(201).json(request);
  } catch (err) {
    console.error("createProjectRequest error:", err);
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
    console.error("getProjectRequests error:", err);
    res.status(500).json({
      msg: "Failed to load requests",
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

    // Notify the PERSON WHO REQUESTED — not the owner. The original code
    // notified the owner with a "New Project Request" message here, which
    // was copy-pasted from createProjectRequest above and made no sense
    // (the owner is the one accepting, not receiving a new request).
    await createNotification({
      recipient: request.sender,
      sender: req.user.id,
      type: "request_accepted",
      title: "Request Accepted",
      description: `You're now a collaborator on "${project.title}"`,
      link: `/projects/${project._id}`,
      project: project._id,
      priority: 1,
    });

    res.json({
      msg: "Accepted",
    });
  } catch (err) {
    console.error("acceptProjectRequest error:", err);
    res.status(500).json({
      msg: "Failed to accept request",
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

    // FIX: `project` was never fetched here at all in the original code,
    // but was referenced below — guaranteed crash on every reject.
    const project = await Project.findById(request.project);

    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({
        msg: "Forbidden",
      });
    }

    request.status = "Rejected";
    await request.save();

    await createNotification({
      recipient: request.sender,
      sender: req.user.id,
      type: "request_rejected",
      title: "Request Declined",
      description: `Your request to join "${project.title}" was declined`,
      link: `/projects/${project._id}`,
      project: project._id,
      priority: 1,
    });

    res.json({
      msg: "Rejected",
    });
  } catch (err) {
    console.error("rejectProjectRequest error:", err);
    res.status(500).json({
      msg: "Failed to reject request",
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
    console.error("getMyProjectRequest error:", err);
    res.status(500).json({
      msg: "Failed to check request status",
    });
  }
};
