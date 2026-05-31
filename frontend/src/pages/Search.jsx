import { useEffect, useState } from "react";
import { Filter } from "lucide-react";

import SearchBar from "../components/search/SearchBar";
import TrendingTags from "../components/search/TrendingTags";
import SmartFilters from "../components/search/SmartFilters";
import ArtistGrid from "../components/search/ArtistGrid";

import { searchUsers } from "../api/user";

const Search = () => {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const [selectedTag, setSelectedTag] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState(null);

  const [showFilters, setShowFilters] = useState(false);

  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(false);

  // FETCH USERS
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);

        const data = await searchUsers({
          q: query,
          role: selectedRole,
          genre: selectedGenre || selectedTag,
        });

        setArtists(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [query, selectedRole, selectedGenre, selectedTag]);

  return (
    <div className="min-h-screen bg-[#0B2540] text-white lg:ml-20">
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* HEADER */}
        <h1 className="bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-4xl font-bold mb-6 text-transparent">
          Explore Artists
        </h1>

        {/* SEARCH */}
        <div className="flex items-center gap-3 mb-6">
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

        {/* TRENDING */}
        <TrendingTags selectedTag={selectedTag} onSelectTag={setSelectedTag} />

        {/* FILTERS */}
        {showFilters && (
          <div className="mt-6">
            <SmartFilters
              selectedRole={selectedRole}
              selectedGenre={selectedGenre}
              onSelectRole={setSelectedRole}
              onSelectGenre={setSelectedGenre}
            />
          </div>
        )}

        {/* COUNT */}
        <p className="text-gray-400 text-sm mt-6 mb-4">
          {loading ? "Loading artists..." : `${artists.length} artists found`}
        </p>

        {/* GRID */}
        <ArtistGrid artists={artists} />
      </div>
    </div>
  );
};

export default Search;
