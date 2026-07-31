import { Search } from "lucide-react";
import ArtistCard from "./ArtistCard";

const ArtistGrid = ({ artists = [], pendingIds = [] }) => {
  const safeArtists = Array.isArray(artists) ? artists : [];

  if (safeArtists.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center py-20 rounded-2xl"
        style={{
          background: "var(--rm-bg-card)",
          border: "1px dashed var(--rm-purple-border)",
        }}
      >
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
          style={{ background: "var(--rm-purple-dim)" }}
        >
          <Search size={22} color="#FF8B93" />
        </div>
        <h3 className="text-white text-base font-medium">No creators found</h3>
        <p
          className="text-sm mt-1"
          style={{
            color: "var(--rm-text-muted)",
            fontFamily: "var(--rm-font-mono)",
          }}
        >
          try another search or filter
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      {safeArtists.map((artist) => (
        <ArtistCard
          key={artist._id}
          artist={artist}
          initiallyPending={pendingIds.includes(artist._id)}
        />
      ))}
    </div>
  );
};

export default ArtistGrid;
