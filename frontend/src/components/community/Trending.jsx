const trendingTags = ["Hip-Hop", "Rap", "EDM", "Jazz", "R&B", "Pop"];

const Trending = () => {
  return (
    <div className="bg-gray-900 p-5 rounded-xl border border-gray-800">
      <h2 className="font-semibold mb-3 flex justify-start">Trending</h2>

      <div className="flex flex-wrap gap-2">
        {trendingTags.map((tag) => (
          <span
            key={tag}
            className="bg-gray-800 px-3 py-1 rounded text-sm rounded-full hover:bg-purple-500/30 transition cursor-pointer"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Trending;
