import { Search } from "lucide-react";
import ArtistCard from "./ArtistCard";

const ArtistGrid = ({ artists }) => {
  if (artists.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/5">
          <Search className="h-8 w-8 text-gray-500" />
        </div>
        <h3 className="text-white font-semibold mb-1">No artists found</h3>
        <p className="text-gray-500 text-sm">
          Try adjusting your search or filters
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {artists.map((artist, index) => (
        <ArtistCard key={artist.id} artist={artist} index={index} />
      ))}
    </div>
  );
};
export default ArtistGrid;
