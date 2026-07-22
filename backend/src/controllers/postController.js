import Post from "../models/post.js";
import Project from "../models/project.js";
import CollabPost from "../models/collabPost.js";
import { stripHtml } from "../utils/sanitize.js";

// CREATE POST
export const createPost = async (req, res) => {
  try {
    const { content, tags, linkedProject, linkedCollabPost } = req.body;

    // Only let someone embed a project/collab post they actually own —
    // otherwise anyone could pin their update to someone else's work.
    let projectRef = null;
    if (linkedProject) {
      const project = await Project.findById(linkedProject);
      if (project && project.owner?.toString() === req.user.id) {
        projectRef = project._id;
      }
    }

    let collabRef = null;
    if (linkedCollabPost) {
      const collab = await CollabPost.findById(linkedCollabPost);
      if (collab && collab.postedBy?.toString() === req.user.id) {
        collabRef = collab._id;
      }
    }

    const post = await Post.create({
      author: req.user.id,
      content: stripHtml(content).slice(0, 500),
      tags,
      linkedProject: projectRef,
      linkedCollabPost: collabRef,
    });

    const populatedPost = await Post.findById(post._id)
      .populate("author", "username role avatar")
      .populate("linkedProject", "title coverImage genre bpm musicalKey")
      .populate("linkedCollabPost", "title lookingFor terms genres");

    res.status(201).json(populatedPost);
  } catch (err) {
    console.error("postController error:", err);
    res.status(500).json({
      message: "Something went wrong. Please try again.",
    });
  }
};

// GET ALL POSTS
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "username role avatar")
      .populate("comments.user", "username avatar")
      .populate("linkedProject", "title coverImage genre bpm musicalKey")
      .populate("linkedCollabPost", "title lookingFor terms genres")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    console.error("postController error:", err);
    res.status(500).json({
      message: "Something went wrong. Please try again.",
    });
  }
};

// LIKE / UNLIKE POST
export const toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const alreadyLiked = post.likes.includes(req.user.id);

    if (alreadyLiked) {
      post.likes = post.likes.filter((id) => id.toString() !== req.user.id);
    } else {
      post.likes.push(req.user.id);
    }

    await post.save();

    res.json(post.likes);
  } catch (err) {
    console.error("postController error:", err);
    res.status(500).json({
      message: "Something went wrong. Please try again.",
    });
  }
};

// COMMENT ON POST
export const addComment = async (req, res) => {
  try {
    const { text } = req.body;

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    post.comments.push({
      user: req.user.id,
      text,
    });

    await post.save();

    const updatedPost = await Post.findById(post._id)
      .populate("author", "username role avatar")
      .populate("comments.user", "username avatar");

    res.json(updatedPost);
  } catch (err) {
    console.error("postController error:", err);
    res.status(500).json({
      message: "Something went wrong. Please try again.",
    });
  }
};

// Reply
export const addReply = async (req, res) => {
  try {
    const { text } = req.body;

    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const comment = post.comments.id(req.params.commentId);

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    comment.replies.push({
      user: req.user.id,
      text,
    });

    await post.save();

    const updatedPost = await Post.findById(post._id)
      .populate("author", "username role avatar")
      .populate("comments.user", "username avatar")
      .populate("comments.replies.user", "username avatar");

    res.json(updatedPost);
  } catch (err) {
    console.error("postController error:", err);
    res.status(500).json({
      message: "Something went wrong. Please try again.",
    });
  }
};
