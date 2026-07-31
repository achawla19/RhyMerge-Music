import { useEffect, useState } from "react";
import { Radio, X } from "lucide-react";

import Feed from "../components/community/Feed";
import RightPanel from "../components/community/RightPanel";

import { getPosts, createPost } from "../api/post";

const Community = () => {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [posting, setPosting] = useState(false);
  const [activeTag, setActiveTag] = useState(null);

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

  const handleCreatePost = async () => {
    if (!content.trim()) return;
    try {
      setPosting(true);
      const newPost = await createPost({
        content,
        tags: tags
          .split(",")
          .map((t) => t.trim())
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

  // Clicking a trending tag filters the feed — clicking it again clears the filter
  const handleTagClick = (tag) =>
    setActiveTag((prev) => (prev === tag ? null : tag));

  const visiblePosts = activeTag
    ? posts.filter((p) => p.tags?.includes(activeTag))
    : posts;

  return (
    <div>
      {/* ── Composer ── */}
      <div
        className="mb-6 rounded-2xl p-5"
        style={{
          background: "var(--rm-bg-card)",
          border: "1px solid var(--rm-border)",
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Radio size={14} color="#FF8B93" />
          <span
            className="text-[11px] uppercase tracking-wider"
            style={{
              fontFamily: "var(--rm-font-mono)",
              color: "var(--rm-purple-light)",
            }}
          >
            broadcast a signal
          </span>
        </div>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="share a hook, an open collab, a raw idea..."
          maxLength={500}
          className="w-full bg-transparent outline-none resize-none text-sm"
          style={{ color: "var(--rm-text-primary)" }}
          rows={4}
        />

        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="tags, comma separated — e.g. RnB, Producer, LoFi"
          className="w-full mt-3 rounded-xl px-4 py-2.5 text-sm outline-none"
          style={{
            background: "var(--rm-bg)",
            border: "1px solid var(--rm-purple-border)",
            color: "var(--rm-text-primary)",
            fontFamily: "var(--rm-font-mono)",
          }}
        />

        <div className="mt-4 flex items-center justify-between">
          <span
            className="text-[11px]"
            style={{
              fontFamily: "var(--rm-font-mono)",
              color: "var(--rm-text-muted)",
            }}
          >
            {content.length}/500
          </span>
          <button
            disabled={posting || !content.trim()}
            onClick={handleCreatePost}
            className="rounded-xl px-5 py-2 text-sm font-medium text-white transition-all disabled:opacity-40"
            style={{ background: "var(--rm-purple)" }}
            onMouseEnter={(e) =>
              !e.currentTarget.disabled &&
              (e.currentTarget.style.background = "#D63850")
            }
            onMouseLeave={(e) =>
              !e.currentTarget.disabled &&
              (e.currentTarget.style.background = "var(--rm-purple)")
            }
          >
            {posting ? "broadcasting..." : "broadcast"}
          </button>
        </div>
      </div>

      {/* Active tag filter banner */}
      {activeTag && (
        <div
          className="flex items-center gap-2 mb-4 px-4 py-2.5 rounded-xl w-fit"
          style={{
            background: "var(--rm-purple-dim)",
            border: "1px solid var(--rm-purple-border)",
          }}
        >
          <span className="text-sm" style={{ color: "var(--rm-purple-light)" }}>
            filtering by #{activeTag}
          </span>
          <button
            onClick={() => setActiveTag(null)}
            style={{ color: "var(--rm-purple-light)" }}
          >
            <X size={13} />
          </button>
        </div>
      )}

      {/* ── Feed + sidebar ── */}
      <div className="grid lg:grid-cols-[1fr_340px] gap-6">
        <Feed posts={visiblePosts} />
        <RightPanel onTagClick={handleTagClick} />
      </div>
    </div>
  );
};

export default Community;
