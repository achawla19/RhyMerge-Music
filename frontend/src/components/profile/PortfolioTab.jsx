import { useEffect, useState } from "react";
import { Music2, Mic, Play, Pause } from "lucide-react";

const PortfolioTrack = ({ track }) => {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audio] = useState(() => new Audio(track.url));

  useEffect(() => {
    const onTime = () =>
      setProgress((audio.currentTime / audio.duration) * 100 || 0);
    const onMeta = () => setDuration(audio.duration || 0);
    const onEnd = () => {
      setPlaying(false);
      setProgress(0);
    };
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("ended", onEnd);
    return () => {
      audio.pause();
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("ended", onEnd);
    };
  }, [audio]);

  const toggle = () => {
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play().catch(() => {});
      setPlaying(true);
    }
  };

  const fmtTime = (s) =>
    `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

  return (
    <div
      className="flex items-center gap-3 p-3 rounded-xl transition-all"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.borderColor = "rgba(124,58,237,0.3)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)")
      }
    >
      <button
        onClick={toggle}
        className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
        style={{
          background: playing ? "var(--rm-purple)" : "var(--rm-purple-dim)",
          border: "1px solid var(--rm-purple-border)",
        }}
      >
        {playing ? (
          <Pause size={13} color="#fff" />
        ) : (
          <Play size={13} color="#C084FC" />
        )}
      </button>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate">{track.name}</p>
        <div
          className="h-1 rounded-full mt-1.5 cursor-pointer"
          style={{ background: "rgba(255,255,255,0.08)" }}
          onClick={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            audio.currentTime =
              ((e.clientX - r.left) / r.width) * audio.duration;
          }}
        >
          <div
            className="h-full rounded-full"
            style={{ width: `${progress}%`, background: "var(--rm-purple)" }}
          />
        </div>
      </div>

      {duration > 0 && (
        <span
          className="text-[10px] flex-shrink-0"
          style={{
            fontFamily: "var(--rm-font-mono)",
            color: "var(--rm-text-muted)",
          }}
        >
          {fmtTime(duration)}
        </span>
      )}
    </div>
  );
};

export default function PortfolioTab({ projects, isOwnProfile }) {
  const tracks = projects
    .filter((p) => p.audioUrl)
    .slice(0, 6)
    .map((p) => ({ name: p.title, url: p.audioUrl }));

  return (
    <div
      className="rounded-2xl p-6"
      style={{
        background: "var(--rm-bg-card)",
        border: "1px solid var(--rm-border)",
      }}
    >
      <div className="flex items-center gap-2 mb-5">
        <Mic size={16} color="#C084FC" />
        <h2 className="text-white font-semibold">Portfolio</h2>
      </div>

      {tracks.length === 0 ? (
        <div className="py-16 text-center">
          <Music2 size={32} color="#6B7280" className="mx-auto mb-3" />
          <p className="text-sm text-white">No portfolio tracks yet</p>
          <p
            className="text-xs mt-1"
            style={{
              color: "var(--rm-text-muted)",
              fontFamily: "var(--rm-font-mono)",
            }}
          >
            {isOwnProfile
              ? "upload stems to your projects — they'll appear here"
              : "this creator hasn't added any samples yet"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {tracks.map((track, i) => (
            <PortfolioTrack key={i} track={track} />
          ))}
        </div>
      )}
    </div>
  );
}
