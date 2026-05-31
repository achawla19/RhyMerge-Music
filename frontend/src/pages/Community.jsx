import { useEffect, useState } from "react";

import Feed from "../components/community/Feed";
import RightPanel from "../components/community/RightPanel";

import { getPosts, createPost } from "../api/post";

const Community = () => {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");

  // FETCH POSTS
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const data = await getPosts();
      setPosts(data);
    } catch (err) {
      console.error(err);
    }
  };

  // CREATE POST
  const handleCreatePost = async () => {
    if (!content.trim()) return;

    try {
      const newPost = await createPost({
        content,
        tags: [],
      });

      setPosts([newPost, ...posts]);

      setContent("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#121821] text-white">
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* TITLE */}
        <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
          Community Feed
        </h1>

        {/* CREATE POST */}
        <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your music ideas..."
            className="w-full bg-transparent outline-none resize-none text-white placeholder:text-gray-500"
            rows={4}
          />

          <div className="mt-4 flex justify-end">
            <button
              onClick={handleCreatePost}
              className="rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-5 py-2 font-medium hover:opacity-90"
            >
              Post
            </button>
          </div>
        </div>

        {/* FEED */}
        <div className="grid lg:grid-cols-[1fr_350px] gap-6">
          <Feed posts={posts} />

          <RightPanel />
        </div>
      </div>
    </div>
  );
};

export default Community;
