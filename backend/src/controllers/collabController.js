import CollabPost from "../models/collabPost.js";
import CollabResponse from "../models/collabResponse.js";
import User from "../models/user.js";
import { createNotification } from "../utils/createNotification.js";
import { escapeRegex, stripHtml, isSafeString } from "../utils/sanitize.js";

const TERMS_TYPES = ["Paid", "Revenue Split", "Credit Only", "Just for Fun"];
const LOCATION_TYPES = ["Remote", "In-person", "Either"];

// ── CREATE ──────────────────────────────────────────────────────────────────
export const createCollabPost = async (req, res) => {
  try {
    const {
      title,
      description,
      lookingFor,
      genres,
      terms,
      termsNote,
      locationType,
      location,
      skillsNeeded,
    } = req.body;

    if (!isSafeString(title) || !title?.trim()) {
      return res.status(400).json({ msg: "Title is required" });
    }
    if (!isSafeString(description) || !description?.trim()) {
      return res.status(400).json({ msg: "Description is required" });
    }
    if (!isSafeString(lookingFor) || !lookingFor?.trim()) {
      return res
        .status(400)
        .json({ msg: "Let people know who you're looking for" });
    }
    if (terms && !TERMS_TYPES.includes(terms)) {
      return res.status(400).json({ msg: "Invalid terms" });
    }
    if (locationType && !LOCATION_TYPES.includes(locationType)) {
      return res.status(400).json({ msg: "Invalid location type" });
    }

    const post = await CollabPost.create({
      title: stripHtml(title).slice(0, 100),
      description: stripHtml(description).slice(0, 2000),
      lookingFor: lookingFor.trim(),
      genres: Array.isArray(genres) ? genres.slice(0, 10) : [],
      terms: terms || "Revenue Split",
      termsNote: termsNote ? stripHtml(termsNote).slice(0, 60) : "",
      locationType: locationType || "Remote",
      location: location ? stripHtml(location).slice(0, 100) : "",
      skillsNeeded: Array.isArray(skillsNeeded)
        ? skillsNeeded.slice(0, 15)
        : [],
      postedBy: req.user.id,
    });

    const populated = await CollabPost.findById(post._id).populate(
      "postedBy",
      "username name avatar role",
    );

    res.status(201).json(populated);
  } catch (err) {
    console.error("createCollabPost:", err);
    res.status(500).json({ msg: "Failed to post" });
  }
};

// ── LIST (paginated, filterable) ─────────────────────────────────────────────
export const getCollabPosts = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 20);

    const clean = (v) => (!v || v === "null" ? "" : v);
    const q = escapeRegex(clean(req.query.q));
    const lookingFor = clean(req.query.lookingFor);
    const genre = clean(req.query.genre);
    const terms = clean(req.query.terms);
    const locationType = clean(req.query.locationType);
    const status = clean(req.query.status) || "Open";

    const filter = { status };

    if (q.trim()) {
      filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { lookingFor: { $regex: q, $options: "i" } },
        { skillsNeeded: { $in: [new RegExp(q, "i")] } },
      ];
    }
    if (lookingFor) {
      filter.lookingFor = { $regex: escapeRegex(lookingFor), $options: "i" };
    }
    if (genre) filter.genres = { $in: [new RegExp(escapeRegex(genre), "i")] };
    if (terms && TERMS_TYPES.includes(terms)) filter.terms = terms;
    if (locationType && LOCATION_TYPES.includes(locationType)) {
      filter.locationType = locationType;
    }

    const [posts, total] = await Promise.all([
      CollabPost.find(filter)
        .populate("postedBy", "username name avatar role")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      CollabPost.countDocuments(filter),
    ]);

    res.json({ posts, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    console.error("getCollabPosts:", err);
    res.status(500).json({ msg: "Failed to load posts" });
  }
};

// ── GET ONE ───────────────────────────────────────────────────────────────────
export const getCollabPostById = async (req, res) => {
  try {
    const post = await CollabPost.findById(req.params.id).populate(
      "postedBy",
      "username name avatar role location",
    );
    if (!post) return res.status(404).json({ msg: "Post not found" });
    res.json(post);
  } catch (err) {
    console.error("getCollabPostById:", err);
    res.status(500).json({ msg: "Failed to load post" });
  }
};

// ── GET MINE (posts I've made) ────────────────────────────────────────────────
export const getMyCollabPosts = async (req, res) => {
  try {
    const posts = await CollabPost.find({ postedBy: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(posts);
  } catch (err) {
    console.error("getMyCollabPosts:", err);
    res.status(500).json({ msg: "Failed to load your posts" });
  }
};

// ── UPDATE ────────────────────────────────────────────────────────────────────
export const updateCollabPost = async (req, res) => {
  try {
    const post = await CollabPost.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: "Post not found" });
    if (post.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Forbidden" });
    }

    const {
      title,
      description,
      lookingFor,
      genres,
      terms,
      termsNote,
      locationType,
      location,
      skillsNeeded,
      status,
    } = req.body;

    if (title !== undefined) post.title = stripHtml(title).slice(0, 100);
    if (description !== undefined)
      post.description = stripHtml(description).slice(0, 2000);
    if (lookingFor !== undefined) post.lookingFor = lookingFor.trim();
    if (Array.isArray(genres)) post.genres = genres.slice(0, 10);
    if (terms && TERMS_TYPES.includes(terms)) post.terms = terms;
    if (termsNote !== undefined)
      post.termsNote = stripHtml(termsNote).slice(0, 60);
    if (locationType && LOCATION_TYPES.includes(locationType)) {
      post.locationType = locationType;
    }
    if (location !== undefined)
      post.location = stripHtml(location).slice(0, 100);
    if (Array.isArray(skillsNeeded))
      post.skillsNeeded = skillsNeeded.slice(0, 15);
    if (status && ["Open", "Collaborating", "Closed"].includes(status)) {
      post.status = status;
    }

    await post.save({ validateModifiedOnly: true });
    const updated = await CollabPost.findById(post._id).populate(
      "postedBy",
      "username name avatar role",
    );
    res.json(updated);
  } catch (err) {
    console.error("updateCollabPost:", err);
    res.status(500).json({ msg: "Failed to update post" });
  }
};

// ── DELETE (soft) ──────────────────────────────────────────────────────────────
export const deleteCollabPost = async (req, res) => {
  try {
    const post = await CollabPost.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: "Post not found" });
    if (post.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Forbidden" });
    }
    post.deletedAt = new Date();
    await post.save({ validateModifiedOnly: true });
    res.json({ msg: "Post removed" });
  } catch (err) {
    console.error("deleteCollabPost:", err);
    res.status(500).json({ msg: "Failed to remove post" });
  }
};

// ── REACH OUT (express interest in collaborating) ────────────────────────────
export const respondToCollab = async (req, res) => {
  try {
    const { message } = req.body;
    const post = await CollabPost.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: "Post not found" });

    if (post.postedBy.toString() === req.user.id) {
      return res.status(400).json({ msg: "This is your own post" });
    }
    if (post.status !== "Open") {
      return res.status(400).json({ msg: "This post is no longer open" });
    }

    const existing = await CollabResponse.findOne({
      post: post._id,
      responder: req.user.id,
      status: "Pending",
    });
    if (existing) {
      return res
        .status(400)
        .json({ msg: "You've already reached out on this one" });
    }

    const response = await CollabResponse.create({
      post: post._id,
      responder: req.user.id,
      message: message ? stripHtml(message).slice(0, 1000) : "",
    });

    post.responsesCount += 1;
    await post.save({ validateModifiedOnly: true });

    const responder = await User.findById(req.user.id).select("username");

    await createNotification({
      recipient: post.postedBy,
      sender: req.user.id,
      type: "collab_interest",
      title: "Someone wants to collaborate",
      description: `${responder.username} reached out about "${post.title}"`,
      link: `/collab/${post._id}`,
      collabPost: post._id,
      priority: 1,
    });

    res.status(201).json(response);
  } catch (err) {
    console.error("respondToCollab:", err);
    res.status(500).json({ msg: "Failed to reach out" });
  }
};

// ── GET RESPONSES FOR A POST (post author only) ──────────────────────────────
export const getCollabResponses = async (req, res) => {
  try {
    const post = await CollabPost.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: "Post not found" });
    if (post.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Forbidden" });
    }

    const responses = await CollabResponse.find({ post: post._id })
      .populate("responder", "username name avatar role genres experienceLevel")
      .sort({ createdAt: -1 });

    res.json(responses);
  } catch (err) {
    console.error("getCollabResponses:", err);
    res.status(500).json({ msg: "Failed to load responses" });
  }
};

// ── MY RESPONSE STATUS FOR A POST ───────────────────────────────────────────
export const getMyResponseStatus = async (req, res) => {
  try {
    const response = await CollabResponse.findOne({
      post: req.params.id,
      responder: req.user.id,
    }).sort({ createdAt: -1 });

    res.json({ status: response?.status || null });
  } catch (err) {
    console.error("getMyResponseStatus:", err);
    res.status(500).json({ msg: "Failed to check your status" });
  }
};

// ── ACCEPT / DECLINE A RESPONSE ──────────────────────────────────────────────
const settleResponse = (targetStatus) => async (req, res) => {
  try {
    const response = await CollabResponse.findById(req.params.id).populate(
      "post",
    );
    if (!response) return res.status(404).json({ msg: "Response not found" });

    const post = response.post;
    if (!post || post.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Forbidden" });
    }

    response.status = targetStatus;
    await response.save();

    if (targetStatus === "Accepted") {
      post.status = "Collaborating";
      await post.save({ validateModifiedOnly: true });
    }

    await createNotification({
      recipient: response.responder,
      sender: req.user.id,
      type: targetStatus === "Accepted" ? "collab_accepted" : "collab_declined",
      title:
        targetStatus === "Accepted" ? "Let's collaborate!" : "Collab update",
      description:
        targetStatus === "Accepted"
          ? `Your reach-out on "${post.title}" was accepted`
          : `Your reach-out on "${post.title}" wasn't a fit this time`,
      link: `/collab/${post._id}`,
      collabPost: post._id,
      priority: 1,
    });

    res.json({ msg: targetStatus });
  } catch (err) {
    console.error("settleResponse:", err);
    res.status(500).json({ msg: "Failed to update response" });
  }
};

export const acceptResponse = settleResponse("Accepted");
export const declineResponse = settleResponse("Declined");
