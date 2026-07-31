import { Plus, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { sendConnectionRequest } from "../../api/connection";

const ArtistCard = ({ artist, initiallyPending = false }) => {
  const navigate = useNavigate();
  const [pending, setPending] = useState(initiallyPending);
  const [sending, setSending] = useState(false);

  const handleConnect = async (e) => {
    e.stopPropagation();
    if (pending || sending) return;
    setSending(true);
    try {
      await sendConnectionRequest(artist._id);
      setPending(true);
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      onClick={() => navigate(`/profile/${artist.username}`)}
      className="rm-float-up cursor-pointer rounded-2xl p-4 transition-all"
      style={{
        background: "var(--rm-bg-card)",
        border: "1px solid var(--rm-border)",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.borderColor = "rgba(249,87,111,0.4)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.borderColor = "var(--rm-border)")
      }
    >
      <div className="flex items-start gap-3">
        <img
          src={
            artist.avatar ||
            `https://ui-avatars.com/api/?name=${artist.username}&background=F9576F&color=fff`
          }
          alt=""
          className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
          style={{ border: "1.5px solid var(--rm-purple-border)" }}
        />
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-white truncate">
            {artist.username}
          </h3>
          <p
            className="text-xs mt-1"
            style={{
              color: "var(--rm-text-muted)",
              fontFamily: "var(--rm-font-mono)",
            }}
          >
            {artist.role || "Music Creator"}
          </p>
          {artist.genres?.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {artist.genres.slice(0, 3).map((genre) => (
                <span
                  key={genre}
                  className="px-2 py-1 rounded-lg text-[10px]"
                  style={{
                    background: "var(--rm-accent-violet-dim)",
                    color: "var(--rm-accent-violet)",
                    fontFamily: "var(--rm-font-mono)",
                  }}
                >
                  {genre}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <button
        onClick={handleConnect}
        disabled={pending || sending}
        className="mt-4 w-full h-10 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2"
        style={
          pending
            ? {
                background: "var(--rm-purple-dim)",
                border: "1px solid var(--rm-purple-border)",
                color: "var(--rm-purple-light)",
              }
            : {
                background: "var(--rm-purple)",
                color: "#fff",
                opacity: sending ? 0.6 : 1,
              }
        }
      >
        {pending ? (
          <>
            <Check size={14} /> Pending
          </>
        ) : (
          <>
            <Plus size={14} /> {sending ? "sending..." : "Sync"}
          </>
        )}
      </button>
    </div>
  );
};

export default ArtistCard;
