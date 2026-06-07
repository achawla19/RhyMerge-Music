import { Search } from "lucide-react";

const SearchBar = ({ query, onChange, onFocus, onBlur }) => {
  return (
    <div className="relative w-full">
      <Search
        className="
          absolute
          left-4
          top-1/2
          -translate-y-1/2
          text-slate-500
          w-5
          h-5
        "
      />

      <input
        type="text"
        value={query}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder="Search creators, projects, genres..."
        className="
          w-full

          pl-12
          pr-4
          py-4

          rounded-2xl

          bg-white/[0.04]
          border border-white/[0.08]

          text-white
          placeholder:text-slate-500

          outline-none

          focus:border-purple-500/30
          focus:bg-white/[0.05]

          transition-all
        "
      />
    </div>
  );
};

export default SearchBar;
