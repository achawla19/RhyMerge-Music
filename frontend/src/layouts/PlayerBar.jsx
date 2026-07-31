import { Play, Pause, X, Volume2, VolumeX, Music2 } from "lucide-react";
import { usePlayer } from "./PlayerContext";

const fmt = (s) => {
  if (!s || isNaN(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${String(sec).padStart(2, "0")}`;
};

export default function PlayerBar() {
  const {
    track,
    isPlaying,
    progress,
    duration,
    volume,
    togglePlay,
    seek,
    changeVolume,
    closePlayer,
  } = usePlayer();

  if (!track) return null;

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    seek(pct * duration);
  };

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center gap-4 px-4 lg:px-6"
      style={{
        height: 72,
        background: "rgba(11,8,20,0.98)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderTop: "1px solid rgba(249,87,111,0.2)",
      }}
    >
      {/* Track info */}
      <div
        className="flex items-center gap-3 flex-shrink-0"
        style={{ width: 240 }}
      >
        <div
          className="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden"
          style={{
            background: "var(--rm-purple-dim)",
            border: "1px solid var(--rm-purple-border)",
          }}
        >
          {track.artwork ? (
            <img
              src={track.artwork}
              alt=""
              className="w-full h-full object-cover"
            />
          ) : (
            <Music2 size={16} color="#FF8B93" />
          )}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-white truncate">
            {track.title}
          </p>
          <p
            className="text-xs truncate"
            style={{
              color: "var(--rm-text-muted)",
              fontFamily: "var(--rm-font-mono)",
            }}
          >
            {track.subtitle || "—"}
          </p>
        </div>
      </div>

      {/* Center — controls + progress */}
      <div className="flex-1 flex flex-col items-center gap-1.5 max-w-2xl mx-auto">
        <button
          onClick={togglePlay}
          className="w-9 h-9 rounded-full flex items-center justify-center transition-all"
          style={{ background: "var(--rm-purple)" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#D63850")}
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "var(--rm-purple)")
          }
        >
          {isPlaying ? (
            <Pause size={15} color="#fff" />
          ) : (
            <Play size={15} color="#fff" style={{ marginLeft: 1 }} />
          )}
        </button>

        <div className="flex items-center gap-2 w-full">
          <span
            className="text-[10px] flex-shrink-0"
            style={{
              fontFamily: "var(--rm-font-mono)",
              color: "var(--rm-text-muted)",
            }}
          >
            {fmt(progress)}
          </span>
          <div
            className="flex-1 h-1 rounded-full cursor-pointer relative group"
            style={{ background: "rgba(255,255,255,0.1)" }}
            onClick={handleSeek}
          >
            <div
              className="h-full rounded-full relative"
              style={{
                width: `${duration ? (progress / duration) * 100 : 0}%`,
                background: "var(--rm-purple-light)",
              }}
            >
              <div
                className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                style={{
                  background: "#fff",
                  transform: "translate(50%, -50%)",
                }}
              />
            </div>
          </div>
          <span
            className="text-[10px] flex-shrink-0"
            style={{
              fontFamily: "var(--rm-font-mono)",
              color: "var(--rm-text-muted)",
            }}
          >
            {fmt(duration)}
          </span>
        </div>
      </div>

      {/* Volume + close */}
      <div
        className="flex items-center gap-3 flex-shrink-0"
        style={{ width: 160 }}
      >
        <button
          onClick={() => changeVolume(volume > 0 ? 0 : 0.8)}
          style={{ color: "var(--rm-text-muted)" }}
        >
          {volume > 0 ? <Volume2 size={15} /> : <VolumeX size={15} />}
        </button>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => changeVolume(Number(e.target.value))}
          className="flex-1"
          style={{ accentColor: "var(--rm-purple)" }}
        />
        <button
          onClick={closePlayer}
          style={{ color: "var(--rm-text-muted)" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#F87171")}
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "var(--rm-text-muted)")
          }
        >
          <X size={15} />
        </button>
      </div>
    </div>
  );
}
