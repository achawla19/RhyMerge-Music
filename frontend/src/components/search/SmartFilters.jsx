import { Mic, Headphones, Music2, Disc3, Guitar, X } from "lucide-react";

const ROLES = [
  { name: "Singer", icon: Mic },
  { name: "Producer", icon: Headphones },
  { name: "Songwriter", icon: Music2 },
  { name: "DJ", icon: Disc3 },
  { name: "Musician", icon: Guitar },
];

const GENRES = [
  "Hip-Hop",
  "LoFi",
  "EDM",
  "Indie",
  "R&B",
  "Pop",
  "Rock",
  "Jazz",
  "Soul",
  "Trap",
];

const SmartFilters = ({
  selectedRole,
  selectedGenre,
  onSelectRole,
  onSelectGenre,
}) => {
  const hasActiveFilters = selectedRole || selectedGenre;

  return (
    <div className="rounded-2xl border border-white/5 bg-gray-900/50 p-5 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={() => {
              onSelectRole(null);
              onSelectGenre(null);
            }}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition"
          >
            <X className="w-3 h-3" /> Clear all
          </button>
        )}
      </div>

      {/* Roles */}
      <div className="mb-4">
        <p className="text-gray-500 text-sm mb-2">Role</p>
        <div className="flex flex-wrap gap-2">
          {ROLES.map(({ name, icon: Icon }) => (
            <button
              key={name}
              onClick={() => onSelectRole(selectedRole === name ? null : name)}
              className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm transition-all ${
                selectedRole === name
                  ? "border-purple-500 bg-purple-500/20 text-purple-400"
                  : "border-white/10 bg-white/5 text-gray-400 hover:border-purple-500/30"
              }`}
            >
              <Icon className="w-4 h-4" />
              {name}
            </button>
          ))}
        </div>
      </div>

      {/* Genres */}
      <div>
        <p className="text-gray-500 text-sm mb-2">Genre</p>
        <div className="flex flex-wrap gap-2">
          {GENRES.map((genre) => (
            <button
              key={genre}
              onClick={() =>
                onSelectGenre(selectedGenre === genre ? null : genre)
              }
              className={`rounded-full border px-3 py-1.5 text-sm transition-all ${
                selectedGenre === genre
                  ? "border-pink-500 bg-pink-500/20 text-pink-400"
                  : "border-white/10 bg-white/5 text-gray-400 hover:border-pink-500/30"
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
export default SmartFilters;
