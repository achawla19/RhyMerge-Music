import { useState } from "react";
import { Filter } from "lucide-react";
import SearchBar from "../components/search/SearchBar";
import TrendingTags from "../components/search/TrendingTags";
import SmartFilters from "../components/search/SmartFilters";
import ArtistGrid from "../components/search/ArtistGrid";

const ARTISTS = [
  {
    id: 1,
    username: "luna_beats",
    name: "Luna Beats",
    role: "Producer",
    genres: ["LoFi", "Hip-Hop"],
    avatar: "LB",
    location: "Los Angeles",
    followers: 12400,
    isVerified: true,
  },
  {
    id: 2,
    username: "vox_eternal",
    name: "Vox Eternal",
    role: "Singer",
    genres: ["R&B", "Soul"],
    avatar: "VE",
    location: "Atlanta",
    followers: 8900,
    isVerified: false,
  },
  {
    id: 3,
    username: "synthwave_kid",
    name: "SynthWave Kid",
    role: "Producer",
    genres: ["EDM", "Synthwave"],
    avatar: "SK",
    location: "Berlin",
    followers: 23100,
    isVerified: true,
  },
  {
    id: 4,
    username: "melody_rivers",
    name: "Melody Rivers",
    role: "Songwriter",
    genres: ["Pop", "Indie"],
    avatar: "MR",
    location: "Nashville",
    followers: 5600,
    isVerified: false,
  },
  {
    id: 5,
    username: "bass_phantom",
    name: "Bass Phantom",
    role: "DJ",
    genres: ["Dubstep", "Drum & Bass"],
    avatar: "BP",
    location: "London",
    followers: 18700,
    isVerified: true,
  },
  {
    id: 6,
    username: "aurora_keys",
    name: "Aurora Keys",
    role: "Singer",
    genres: ["Indie", "Folk"],
    avatar: "AK",
    location: "Portland",
    followers: 7200,
    isVerified: false,
  },
  {
    id: 7,
    username: "trap_lord_mike",
    name: "Trap Lord Mike",
    role: "Producer",
    genres: ["Trap", "Hip-Hop"],
    avatar: "TM",
    location: "Houston",
    followers: 31500,
    isVerified: true,
  },
  {
    id: 8,
    username: "jazzy_mae",
    name: "Jazzy Mae",
    role: "Singer",
    genres: ["Jazz", "Neo-Soul"],
    avatar: "JM",
    location: "Chicago",
    followers: 9800,
    isVerified: false,
  },
];

const Search = () => {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [selectedTag, setSelectedTag] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = ARTISTS.filter((artist) => {
    const matchesQuery =
      artist.name.toLowerCase().includes(query.toLowerCase()) ||
      artist.role.toLowerCase().includes(query.toLowerCase()) ||
      artist.genres.some((g) => g.toLowerCase().includes(query.toLowerCase()));
    const matchesTag =
      !selectedTag ||
      artist.genres.some((g) =>
        g.toLowerCase().includes(selectedTag.toLowerCase()),
      );
    const matchesRole = !selectedRole || artist.role === selectedRole;
    const matchesGenre =
      !selectedGenre || artist.genres.includes(selectedGenre);
    return matchesQuery && matchesTag && matchesRole && matchesGenre;
  });

  return (
    <div className="min-h-screen mx-auto max-w-7xl bg-[#0B2540] text-white px-4 py-6 lg:ml-64">
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-4xl font-bold mb-6 text-transparent">
          Explore Artists
        </h1>
        <div className="flex items-center gap-3">
          <SearchBar
            query={query}
            onChange={setQuery}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            isFocused={isFocused}
          />
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-3 rounded-xl border transition ${
              showFilters
                ? "border-purple-500 bg-purple-500/20 text-purple-400"
                : "border-white/10 bg-white/5 text-gray-400 hover:text-white"
            }`}
          >
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* TRENDING */}
      <TrendingTags selectedTag={selectedTag} onSelectTag={setSelectedTag} />

      {/* FILTERS */}
      {showFilters && (
        <SmartFilters
          selectedRole={selectedRole}
          selectedGenre={selectedGenre}
          onSelectRole={setSelectedRole}
          onSelectGenre={setSelectedGenre}
        />
      )}

      {/* COUNT */}
      <p className="text-gray-500 text-sm mb-4">
        {filtered.length} artists found
      </p>

      {/* GRID */}
      <ArtistGrid artists={filtered} />
    </div>
  );
};
export default Search;
