import {
  Send,
  Paperclip,
  X,
  FileAudio,
  FileImage,
  File,
  Loader2,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";

const API = import.meta.env.VITE_API_URL;
const TYPING_TIMEOUT_MS = 2000;
const MAX_FILE_MB = 20;
const ALLOWED_TYPES = new Set([
  "audio/mpeg",
  "audio/wav",
  "audio/x-wav",
  "audio/ogg",
  "audio/mp4",
  "audio/x-m4a",
  "audio/flac",
  "audio/webm",
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
]);

const fileIcon = (type) => {
  if (type?.startsWith("audio/")) return <FileAudio size={14} />;
  if (type?.startsWith("image/")) return <FileImage size={14} />;
  return <File size={14} />;
};

const fmtSize = (bytes) => {
  if (!bytes) return "";
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const MessageInput = ({ onSend, onTypingChange, activeChat }) => {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const typingTimeoutRef = useRef(null);
  const isTypingRef = useRef(false);
  const fileInputRef = useRef(null);

  // Reset on chat switch
  useEffect(() => {
    setText("");
    setFile(null);
    if (isTypingRef.current) {
      onTypingChange?.(false);
      isTypingRef.current = false;
    }
    clearTimeout(typingTimeoutRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeChat]);

  useEffect(() => () => clearTimeout(typingTimeoutRef.current), []);

  const handleChange = (e) => {
    setText(e.target.value);
    if (!isTypingRef.current) {
      isTypingRef.current = true;
      onTypingChange?.(true);
    }
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      isTypingRef.current = false;
      onTypingChange?.(false);
    }, TYPING_TIMEOUT_MS);
  };

  const handleFileChange = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    e.target.value = "";

    if (!ALLOWED_TYPES.has(f.type)) {
      setFile({ error: "File type not supported — audio, image, or PDF only" });
      return;
    }
    if (f.size > MAX_FILE_MB * 1024 * 1024) {
      setFile({ error: `File too large — max ${MAX_FILE_MB}MB` });
      return;
    }

    const preview = f.type.startsWith("image/") ? URL.createObjectURL(f) : null;
    setFile({ raw: f, preview, uploading: true, url: null, error: null });
    setUploading(true);

    try {
      const fd = new FormData();
      fd.append("file", f);
      const res = await fetch(`${API}/api/message-attachments`, {
        method: "POST",
        credentials: "include",
        headers: {
          "x-file-type": f.type,
        },
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Upload failed");
      setFile((prev) => ({ ...prev, uploading: false, url: data.url }));
    } catch (err) {
      setFile({ error: err.message || "Upload failed" });
    } finally {
      setUploading(false);
    }
  };

  const removeFile = () => {
    if (file?.preview) URL.revokeObjectURL(file.preview);
    setFile(null);
  };

  const send = () => {
    const hasText = text.trim();
    const hasFile = file?.url;
    if (!hasText && !hasFile) return;

    const attachment = hasFile
      ? {
          url: file.url,
          name: file.raw.name,
          type: file.raw.type,
          size: file.raw.size,
        }
      : null;

    onSend(text.trim(), attachment);
    setText("");
    removeFile();
    clearTimeout(typingTimeoutRef.current);
    isTypingRef.current = false;
    onTypingChange?.(false);
  };

  const canSend = (text.trim() || file?.url) && !uploading;

  return (
    <div
      style={{
        borderTop: "1px solid rgba(249,87,111,0.15)",
        background: "rgba(249,87,111,0.04)",
      }}
    >
      {/* File preview */}
      {file && !file.error && (
        <div className="px-4 pt-3">
          <div
            className="flex items-center gap-3 px-3 py-2 rounded-xl"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            {file.preview ? (
              <img
                src={file.preview}
                alt=""
                className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
              />
            ) : (
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{
                  background: "var(--rm-purple-dim)",
                  color: "var(--rm-purple-light)",
                }}
              >
                {file.uploading ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  fileIcon(file.raw?.type)
                )}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white truncate">
                {file.raw?.name}
              </p>
              <p
                className="text-[11px]"
                style={{
                  color: "var(--rm-text-muted)",
                  fontFamily: "var(--rm-font-mono)",
                }}
              >
                {file.uploading
                  ? "uploading to cloud..."
                  : fmtSize(file.raw?.size)}
              </p>
            </div>
            {!file.uploading && (
              <button
                onClick={removeFile}
                style={{ color: "#6B7280" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#F87171")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#6B7280")}
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Error */}
      {file?.error && (
        <div className="px-4 pt-3">
          <div
            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs"
            style={{
              background: "rgba(248,113,113,0.08)",
              border: "1px solid rgba(248,113,113,0.2)",
              color: "#F87171",
            }}
          >
            <span>{file.error}</span>
            <button onClick={() => setFile(null)}>
              <X size={13} />
            </button>
          </div>
        </div>
      )}

      {/* Input row */}
      <div className="p-4 flex gap-3 items-center">
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="audio/*,image/*,application/pdf"
          onChange={handleFileChange}
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          title="Attach audio, image or PDF — max 20MB"
          className="p-2.5 rounded-xl flex-shrink-0 transition-all disabled:opacity-40"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "var(--rm-text-muted)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "rgba(249,87,111,0.4)";
            e.currentTarget.style.color = "var(--rm-purple-light)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
            e.currentTarget.style.color = "var(--rm-text-muted)";
          }}
        >
          <Paperclip size={16} />
        </button>

        <input
          value={text}
          onChange={handleChange}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
          placeholder={
            file?.url ? "add a caption... (optional)" : "type a message..."
          }
          className="flex-1 px-4 py-2.5 rounded-full outline-none transition-all"
          style={{
            background: "var(--rm-bg)",
            border: "1px solid var(--rm-purple-border)",
            color: "var(--rm-text-primary)",
          }}
          onFocus={(e) =>
            (e.currentTarget.style.borderColor = "var(--rm-purple)")
          }
          onBlur={(e) =>
            (e.currentTarget.style.borderColor = "var(--rm-purple-border)")
          }
        />

        <button
          onClick={send}
          disabled={!canSend}
          className="p-3 rounded-full transition-all flex-shrink-0 disabled:opacity-40"
          style={{ background: "var(--rm-purple)" }}
          onMouseEnter={(e) =>
            canSend && (e.currentTarget.style.background = "#D63850")
          }
          onMouseLeave={(e) =>
            canSend && (e.currentTarget.style.background = "var(--rm-purple)")
          }
        >
          <Send size={16} color="#fff" />
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
