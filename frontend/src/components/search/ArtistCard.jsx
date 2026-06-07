import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const ArtistCard = ({ artist }) => {
  const navigate = useNavigate();

  const [connected, setConnected] = useState(false);

  return (
    <div
      onClick={() => navigate(`/profile/${artist.username}`)}
      className="
        cursor-pointer

        rounded-2xl
        border border-white/[0.06]

        bg-white/[0.03]
        backdrop-blur-xl

        p-4

        hover:border-purple-500/20
        hover:bg-white/[0.05]

        transition-all duration-300
      "
    >
      <div className="flex items-start gap-3">
        <img
          src={
            artist.avatar ||
            `https://ui-avatars.com/api/?name=${artist.username}&background=7c3aed&color=fff`
          }
          alt=""
          className="
            w-14
            h-14

            rounded-xl
            object-cover
            flex-shrink-0
          "
        />

        <div className="flex-1 min-w-0">
          <h3 className="text-white text-sm font-medium truncate">
            {artist.username}
          </h3>

          <p className="text-xs text-slate-500 mt-1">
            {artist.role || "Music Creator"}
          </p>

          <div className="flex flex-wrap gap-1 mt-3 text-xs">
            {(artist.genres || []).slice(0, 3).map((genre) => (
              <span
                key={genre}
                className="
                  px-2
                  py-1

                  rounded-lg

                  bg-purple-500/10
                  text-purple-300

                  text-[11px]
                "
              >
                {genre}
              </span>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          setConnected(!connected);
        }}
        className={`
          mt-4
          w-full

          h-10

          rounded-xl

          text-sm
          font-medium

          transition-all

          ${
            connected
              ? "bg-purple-500/10 border border-purple-500/30 text-purple-300"
              : "bg-purple-600 hover:bg-purple-500 text-white"
          }
        `}
      >
        {connected ? (
          "Connected"
        ) : (
          <span className="flex items-center justify-center gap-2">
            <Plus size={14} />
            Connect
          </span>
        )}
      </button>
    </div>
  );
};

export default ArtistCard;
