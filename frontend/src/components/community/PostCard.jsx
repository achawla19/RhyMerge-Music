import { Heart, MessageCircle, Share2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PostCard = ({ post }) => {
  const navigate = useNavigate();

  return (
    <article className="rounded-xl border border-gray-800 bg-gray-900 p-5 hover:border-purple-500/30 transition">
      {/* HEADER */}
      <div className="flex gap-3 mb-4">
        <img src={post.avatar} alt="" className="w-12 h-12 rounded-full" />

        <div>
          <div className="flex gap-2 items-center">
            <span
              onClick={() => navigate(`/profile/${post.username}`)}
              className="font-semibold"
            >
              {post.username}
            </span>
            <span className="text-xs text-purple-400">{post.role}</span>
          </div>

          <span className="text-xs text-gray-500 flex justify-start">
            {post.timestamp}
          </span>
        </div>
      </div>

      {/* CONTENT */}
      <p className="text-gray-300 mb-4 flex justify-start">{post.content}</p>

      {/* TAGS */}
      <div className="flex gap-2 flex-wrap mb-4 ">
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="text-xs px-2 py-1 bg-gradient-to-br from-purple-900/40 to-pink-900/40 p-5 rounded-full border border-purple-500/20"
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* ACTIONS */}
      <div className="flex justify-between border-t border-gray-800 pt-4">
        <div className="flex gap-6 text-gray-400">
          <button className="flex items-center gap-1 hover:text-pink-500">
            <Heart size={18} /> {post.likes}
          </button>

          <button className="flex items-center gap-1 hover:text-purple-400">
            <MessageCircle size={18} /> {post.comments}
          </button>

          <button className="hover:text-blue-400">
            <Share2 size={18} />
          </button>
        </div>

        <button className="text-sm border border-purple-500 px-3 py-1 rounded hover:bg-purple-500/10">
          Open Thread
        </button>
      </div>
    </article>
  );
};

export default PostCard;
