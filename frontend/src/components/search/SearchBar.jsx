import { Search } from "lucide-react";

const SearchBar = ({ query, onChange, onFocus, onBlur, isFocused }) => {
  return (
    <div
      className={`relative w-full max-w-2xl transition-all duration-300 ${isFocused ? "scale-[1.02]" : ""}`}
    >
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
      <input
        type="text"
        placeholder="Search artists, genres, vibes..."
        value={query}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
        className={`w-full px-4 py-3 pl-11 rounded-full bg-gray-900 border transition-all duration-300 focus:outline-none text-white placeholder-gray-500 ${
          isFocused
            ? "border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.15)]"
            : "border-gray-700"
        }`}
      />
    </div>
  );
};
export default SearchBar;
