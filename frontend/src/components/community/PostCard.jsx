import { Heart, MessageCircle, Share2 } from "lucide-react";

import { useNavigate } from "react-router-dom";
import { useState } from "react";

import { toggleLike } from "../../api/post";

const PostCard = ({ post }) => {
  const navigate = useNavigate();

  const currentUser = JSON.parse(localStorage.getItem("user"));

  const [likes, setLikes] = useState(post.likes || []);

  // CHECK IF LIKED
  const isLiked = likes.some((id) => {
    const likeId = id?._id || id;
    return String(likeId) === String(currentUser?._id);
  });

  // HANDLE LIKE
  const handleLike = async () => {
    try {
      // OPTIMISTIC UPDATE
      if (isLiked) {
        setLikes(
          likes.filter((id) => {
            const likeId = id?._id || id;
            return String(likeId) !== String(currentUser?._id);
          }),
        );
      } else {
        setLikes([...likes, currentUser._id]);
      }

      // BACKEND UPDATE
      const updatedLikes = await toggleLike(post._id);

      setLikes(updatedLikes);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <article className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
      {/* HEADER */}
      <div className="flex gap-3 mb-4">
        <img
          src={
            post.author?.avatar ||
            `https://ui-avatars.com/api/?name=${post.author?.username}`
          }
          alt=""
          className="w-12 h-12 rounded-full object-cover"
        />

        <div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(`/profile/${post.author?.username}`)}
              className="font-semibold hover:text-purple-400"
            >
              {post.author?.username}
            </button>

            <span className="text-xs text-purple-400">{post.author?.role}</span>
          </div>

          <span className="text-xs text-gray-500">
            {new Date(post.createdAt).toLocaleString()}
          </span>
        </div>
      </div>

      {/* CONTENT */}
      <p className="text-gray-300 mb-4">{post.content}</p>

      {/* TAGS */}
      <div className="flex flex-wrap gap-2 mb-4">
        {post.tags?.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1 text-xs text-purple-300"
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* ACTIONS */}
      <div className="flex items-center gap-6 border-t border-white/10 pt-4 text-gray-400">
        {/* LIKE */}
        <button
          onClick={handleLike}
          className={`flex items-center gap-1 transition ${
            isLiked ? "text-pink-500" : "hover:text-pink-400"
          }`}
        >
          <Heart size={18} fill={isLiked ? "currentColor" : "none"} />

          {likes.length}
        </button>

        {/* COMMENTS */}
        <button className="flex items-center gap-1 hover:text-purple-400">
          <MessageCircle size={18} />
          {post.comments?.length || 0}
        </button>

        {/* SHARE */}
        <button className="hover:text-cyan-400">
          <Share2 size={18} />
        </button>
      </div>
    </article>
  );
};

export default PostCard;
