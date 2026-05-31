import { useEffect, useState } from "react";

import Feed from "../components/community/Feed";
import RightPanel from "../components/community/RightPanel";

import { getPosts, createPost } from "../api/post";

const Community = () => {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [posting, setPosting] = useState(false);

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
    setPosting(true);

    const newPost = await createPost({
      content,
      tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    });

    setPosts((prev) => [newPost, ...prev]);

    setContent("");
    setTags("");
  } catch (err) {
    console.error(err);
  } finally {
    setPosting(false);
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
        <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-5">
  <textarea
    value={content}
    onChange={(e) => setContent(e.target.value)}
    placeholder="Share your music idea, project, or collaboration request..."
    maxLength={500}
    className="w-full bg-transparent outline-none resize-none text-white placeholder:text-gray-500"
    rows={4}
  />

  <div className="mt-3">
    <input
      type="text"
      value={tags}
      onChange={(e) => setTags(e.target.value)}
      placeholder="Tags (comma separated) e.g. RnB, Producer, LoFi"
      className="w-full rounded-xl bg-[#1A2230] px-4 py-2 text-sm text-white outline-none border border-white/10"
    />
  </div>

  <div className="mt-4 flex items-center justify-between">
    <span className="text-xs text-gray-500">
      {content.length}/500 characters
    </span>

    <button
      disabled={posting}
      onClick={handleCreatePost}
      className="rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-5 py-2 font-medium hover:opacity-90 disabled:opacity-50"
    >
      {posting ? "Posting..." : "Post"}
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
