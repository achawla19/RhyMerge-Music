import { Search } from "lucide-react";
import ArtistCard from "./ArtistCard";

const ArtistGrid = ({ artists = [] }) => {
  const safeArtists = Array.isArray(artists) ? artists : [];

  if (safeArtists.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
          <Search className="w-8 h-8 text-slate-500" />
        </div>

        <h3 className="text-white text-lg font-medium">No creators found</h3>

        <p className="text-slate-500 mt-1">Try another search or filter.</p>
      </div>
    );
  }

  return (
    <div
      className="
        grid
        grid-cols-1
        md:grid-cols-2
        xl:grid-cols-3
        gap-5
      "
    >
      {safeArtists.map((artist, index) => (
        <ArtistCard key={artist?._id || index} artist={artist} index={index} />
      ))}
    </div>
  );
};

export default ArtistGrid;
