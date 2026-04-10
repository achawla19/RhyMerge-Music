import { useState } from "react";
import { MapPin, Users, BadgeCheck, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ArtistCard = ({ artist, index }) => {
  const [isConnected, setIsConnected] = useState(false);
  const navigate = useNavigate();

  const formatFollowers = (num) => {
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
  };

  return (
    <div
      className="group relative overflow-hidden rounded-2xl border border-white/5 bg-gray-900/50 transition-all duration-300 hover:border-purple-500/30 hover:shadow-[0_0_30px_rgba(168,85,247,0.1)] cursor-pointer"
      style={{ animationDelay: `${index * 50}ms` }}
      onClick={() => navigate(`/profile/${artist.username}`)}
    >
      {/* Hover gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative p-5">
        {/* Avatar + followers */}
        <div className="mb-4 flex items-start justify-between">
          <div className="relative">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 text-xl font-bold text-white shadow-lg transition-transform duration-300 group-hover:scale-105">
              {artist.avatar}
            </div>
            {artist.isVerified && (
              <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-purple-500 ring-2 ring-[#0B2540]">
                <BadgeCheck className="h-4 w-4 text-white" />
              </div>
            )}
          </div>
          <div className="flex items-center gap-1 rounded-full bg-white/5 px-2 py-1 text-xs text-gray-400">
            <Users className="h-3 w-3" />
            {formatFollowers(artist.followers)}
          </div>
        </div>

        {/* Name + role */}
        <div className="mb-2">
          <h3 className="text-white font-semibold group-hover:text-purple-400 transition-colors">
            {artist.name}
          </h3>
          <p className="text-gray-400 text-sm">{artist.role}</p>
        </div>

        {/* Location */}
        <div className="mb-3 flex items-center gap-1 text-xs text-gray-500">
          <MapPin className="h-3 w-3" />
          {artist.location}
        </div>

        {/* Genres */}
        <div className="mb-4 flex flex-wrap gap-1.5">
          {artist.genres.map((genre) => (
            <span
              key={genre}
              className="rounded-full bg-white/5 px-2.5 py-1 text-xs text-gray-400"
            >
              {genre}
            </span>
          ))}
        </div>

        {/* Connect button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsConnected(!isConnected);
          }}
          className={`w-full rounded-xl py-2 text-sm font-medium transition-all duration-300 ${
            isConnected
              ? "border border-purple-500/50 bg-purple-500/20 text-purple-400"
              : "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25 hover:from-purple-600 hover:to-pink-600"
          }`}
        >
          {isConnected ? (
            "Connected"
          ) : (
            <span className="flex items-center justify-center gap-1">
              <Plus className="w-4 h-4" /> Connect
            </span>
          )}
        </button>
      </div>
    </div>
  );
};
export default ArtistCard;
