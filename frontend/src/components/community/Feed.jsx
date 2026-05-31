import PostCard from "./PostCard";

const Feed = ({ posts }) => {
  if (!posts.length) {
    return <div className="text-gray-500">No posts yet</div>;
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
    </div>
  );
};

export default Feed;
