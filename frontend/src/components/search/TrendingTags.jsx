import { Hash } from "lucide-react";

const TRENDING_TAGS = [
  "HipHop",
  "LoFi",
  "EDM",
  "Indie",
  "Collab",
  "Beats",
  "Vocals",
  "Remix",
];

const TrendingTags = ({ selectedTag, onSelectTag }) => {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-pink-400 text-sm font-semibold">Trending</span>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {TRENDING_TAGS.map((tag) => (
          <button
            key={tag}
            onClick={() => onSelectTag(selectedTag === tag ? null : tag)}
            className={`flex items-center gap-1 whitespace-nowrap rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-200 ${
              selectedTag === tag
                ? "border-purple-500 bg-purple-500/20 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                : "border-white/10 bg-white/5 text-gray-400 hover:border-purple-500/30 hover:text-purple-400"
            }`}
          >
            <Hash className="w-3 h-3" />
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
};
export default TrendingTags;
