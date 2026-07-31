import { useEffect, useRef } from "react";
import { Radio } from "lucide-react";
import PostCard from "./PostCard";

// ─── Empty state with breathing pulse ────────────────────────
const EmptyFeed = () => {
  const ref = useRef(null);
  useEffect(() => {
    const id = setInterval(() => {
      if (ref.current) {
        ref.current.style.transform =
          ref.current.style.transform === "scale(1.08)"
            ? "scale(1)"
            : "scale(1.08)";
      }
    }, 900);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="flex flex-col items-center justify-center py-16 rounded-2xl"
      style={{
        background: "var(--rm-bg-card)",
        border: "1px dashed var(--rm-purple-border)",
      }}
    >
      <div
        ref={ref}
        className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
        style={{
          background: "var(--rm-purple-dim)",
          border: "1px solid var(--rm-purple-border)",
          transition: "transform 0.9s ease",
        }}
      >
        <Radio size={22} color="#FF8B93" />
      </div>
      <p
        className="text-sm font-medium"
        style={{ color: "var(--rm-text-primary)" }}
      >
        No signals yet
      </p>
      <p
        className="text-xs mt-1"
        style={{
          fontFamily: "var(--rm-font-mono)",
          color: "var(--rm-text-muted)",
        }}
      >
        be the first to broadcast something
      </p>
    </div>
  );
};

const Feed = ({ posts }) => {
  if (!posts.length) return <EmptyFeed />;

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
    </div>
  );
};

export default Feed;
