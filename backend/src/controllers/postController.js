import Post from "../models/post.js";

// CREATE POST
export const createPost = async (req, res) => {
  try {
    const { content, tags } = req.body;

    const post = await Post.create({
      author: req.user.id,
      content,
      tags,
    });

    const populatedPost = await Post.findById(post._id).populate(
      "author",
      "username role avatar",
    );

    res.status(201).json(populatedPost);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// GET ALL POSTS
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "username role avatar")
      .populate("comments.user", "username avatar")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    res.status(500).json({
      message: err.message,
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
    res.status(500).json({
      message: err.message,
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
    res.status(500).json({
      message: err.message,
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
    res.status(500).json({
      message: err.message,
    });
  }
};
