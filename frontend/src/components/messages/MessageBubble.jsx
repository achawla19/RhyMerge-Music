import {
  Check,
  CheckCheck,
  FileAudio,
  FileImage,
  File,
  Download,
  Play,
  Pause,
} from "lucide-react";
import { useState, useRef } from "react";

const fmtSize = (bytes) => {
  if (!bytes) return "";
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const fmtTime = (secs) => {
  if (!secs || isNaN(secs)) return "0:00";
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
};

// ── Inline audio player ───────────────────────────────────────────────────────
const AudioAttachment = ({ url, name, isMe }) => {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play().catch(() => {});
      setPlaying(true);
    }
  };

  const accentColor = isMe ? "#C084FC" : "#60A5FA";

  return (
    <div className="flex items-center gap-3 py-1">
      <audio
        ref={audioRef}
        src={url}
        preload="metadata"
        onTimeUpdate={() => {
          const a = audioRef.current;
          if (a?.duration) setProgress((a.currentTime / a.duration) * 100);
        }}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
        onEnded={() => {
          setPlaying(false);
          setProgress(0);
        }}
      />

      <button
        onClick={toggle}
        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
        style={{
          background: isMe ? "rgba(192,132,252,0.2)" : "rgba(96,165,250,0.15)",
          border: `1px solid ${accentColor}44`,
        }}
      >
        {playing ? (
          <Pause size={13} color={accentColor} />
        ) : (
          <Play size={13} color={accentColor} />
        )}
      </button>

      <div className="flex-1 min-w-0 space-y-1">
        <p
          className="text-xs truncate"
          style={{ color: "var(--rm-text-primary)" }}
        >
          {name}
        </p>
        <div
          className="h-1.5 rounded-full overflow-hidden cursor-pointer"
          style={{ background: "rgba(255,255,255,0.1)" }}
          onClick={(e) => {
            const a = audioRef.current;
            if (!a?.duration) return;
            const r = e.currentTarget.getBoundingClientRect();
            a.currentTime = ((e.clientX - r.left) / r.width) * a.duration;
          }}
        >
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${progress}%`, background: accentColor }}
          />
        </div>
      </div>

      <span
        className="text-[10px] flex-shrink-0"
        style={{
          color: "var(--rm-text-muted)",
          fontFamily: "var(--rm-font-mono)",
        }}
      >
        {fmtTime(duration)}
      </span>
    </div>
  );
};

// ── Attachment renderer ───────────────────────────────────────────────────────
const Attachment = ({ attachment, isMe }) => {
  const { url, name, type, size } = attachment;

  if (type?.startsWith("image/")) {
    return (
      <div className="mt-1 mb-1">
        <img
          src={url}
          alt={name || "image"}
          className="max-w-full rounded-xl object-cover"
          style={{
            maxHeight: 220,
            cursor: "pointer",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
          onClick={() => window.open(url, "_blank")}
        />
        {size && (
          <p
            className="text-[10px] mt-1"
            style={{
              color: "var(--rm-text-muted)",
              fontFamily: "var(--rm-font-mono)",
            }}
          >
            {fmtSize(size)}
          </p>
        )}
      </div>
    );
  }

  if (type?.startsWith("audio/")) {
    return (
      <div className="mt-1 mb-1 min-w-[200px]">
        <AudioAttachment url={url} name={name} isMe={isMe} />
      </div>
    );
  }

  // PDF / generic file → download card
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 mt-1 mb-1 px-3 py-2.5 rounded-xl no-underline transition-all"
      style={{
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.1)",
        color: "var(--rm-text-primary)",
        textDecoration: "none",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.background = "rgba(255,255,255,0.1)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.background = "rgba(255,255,255,0.06)")
      }
    >
      <File size={18} color="#9CA3AF" className="flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium truncate">{name || "File"}</p>
        {size && (
          <p
            className="text-[10px]"
            style={{
              color: "var(--rm-text-muted)",
              fontFamily: "var(--rm-font-mono)",
            }}
          >
            {fmtSize(size)}
          </p>
        )}
      </div>
      <Download size={13} color="#9CA3AF" className="flex-shrink-0" />
    </a>
  );
};

// ── Main bubble ───────────────────────────────────────────────────────────────
const MessageBubble = ({ message, isMe }) => {
  const hasAttachment = !!message.attachment?.url;
  const hasText = !!message.text;

  return (
    <div
      className={`flex ${isMe ? "justify-end" : "justify-start"} mb-3 rm-slide-in`}
    >
      <div style={{ maxWidth: "min(320px, 75vw)" }}>
        <div
          className="px-4 py-2.5 rounded-2xl text-sm"
          style={
            isMe
              ? {
                  background: "var(--rm-purple-dim)",
                  border: "1px solid var(--rm-purple-border)",
                  color: "var(--rm-text-primary)",
                }
              : {
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "#D1D5DB",
                }
          }
        >
          {/* Attachment renders above text */}
          {hasAttachment && (
            <Attachment attachment={message.attachment} isMe={isMe} />
          )}

          {hasText && <p style={{ wordBreak: "break-word" }}>{message.text}</p>}
        </div>

        {/* Time + read receipt */}
        <div
          className="flex items-center gap-1 mt-1 px-1"
          style={{ justifyContent: isMe ? "flex-end" : "flex-start" }}
        >
          <span
            className="text-[10px]"
            style={{
              color: "var(--rm-text-muted)",
              fontFamily: "var(--rm-font-mono)",
            }}
          >
            {new Date(message.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
          {isMe &&
            (message.isRead ? (
              <CheckCheck size={12} color="#C084FC" />
            ) : (
              <Check size={12} color="var(--rm-text-muted)" />
            ))}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
