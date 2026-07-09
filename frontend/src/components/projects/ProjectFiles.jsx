import { useEffect, useState, useRef } from "react";
import { Upload, Trash2, Play, Pause, Music2, Layers, X } from "lucide-react";
import {
  getProjectFiles,
  uploadProjectFile,
  deleteProjectFile,
} from "../../api/projectFiles";
import { useAuth } from "../../context/AuthContext";
import { usePlayer } from "../../layouts/PlayerContext";

const STEM_TYPES = [
  { value: "vocals", label: "Vocals", color: "#C084FC" },
  { value: "drums", label: "Drums", color: "#F472B6" },
  { value: "bass", label: "Bass", color: "#34D399" },
  { value: "melody", label: "Melody", color: "#60A5FA" },
  { value: "guitar", label: "Guitar", color: "#FBBF24" },
  { value: "keys", label: "Keys", color: "#A78BFA" },
  { value: "fx", label: "FX", color: "#FB923C" },
  { value: "full", label: "Full Mix", color: "#22D3EE" },
  { value: "other", label: "Other", color: "#9CA3AF" },
];

const stemColor = (type) =>
  STEM_TYPES.find((s) => s.value === type)?.color || "#9CA3AF";

const fmt = (bytes) => {
  if (!bytes) return "";
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const fmtDuration = (secs) => {
  if (!secs) return "";
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
};

// ── Upload Modal ───────────────────────────────────────────────────────────────
const UploadModal = ({ projectId, onClose, onUploaded }) => {
  const [file, setFile] = useState(null);
  const [stemType, setStemType] = useState("other");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [drag, setDrag] = useState(false);

  const handleFile = (f) => {
    if (!f) return;
    if (!f.type.startsWith("audio/")) {
      setError("Only audio files are allowed");
      return;
    }
    setFile(f);
    setError("");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDrag(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = async () => {
    if (!file) return;
    setLoading(true);
    setError("");
    try {
      const uploaded = await uploadProjectFile(projectId, file, {
        stemType,
        notes,
      });
      onUploaded(uploaded);
      onClose();
    } catch (err) {
      setError(err.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-md rounded-2xl p-6"
        style={{
          background: "var(--rm-bg-card)",
          border: "1px solid var(--rm-border)",
          boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
        }}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-white font-semibold text-lg">Upload Stem</h3>
          <button onClick={onClose} style={{ color: "var(--rm-text-muted)" }}>
            <X size={18} />
          </button>
        </div>

        {/* Dropzone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDrag(true);
          }}
          onDragLeave={() => setDrag(false)}
          onDrop={handleDrop}
          onClick={() => document.getElementById("stem-file-input").click()}
          className="rounded-xl p-8 text-center cursor-pointer transition-all mb-4"
          style={{
            border: `2px dashed ${drag || file ? "var(--rm-purple)" : "rgba(255,255,255,0.1)"}`,
            background: drag
              ? "rgba(124,58,237,0.08)"
              : "rgba(255,255,255,0.02)",
          }}
        >
          <input
            id="stem-file-input"
            type="file"
            accept="audio/*"
            className="hidden"
            onChange={(e) => handleFile(e.target.files[0])}
          />
          <Music2
            size={28}
            color={file ? "var(--rm-purple-light)" : "var(--rm-text-muted)"}
            className="mx-auto mb-2"
          />
          {file ? (
            <p className="text-sm text-white font-medium">{file.name}</p>
          ) : (
            <>
              <p
                className="text-sm"
                style={{ color: "var(--rm-text-primary)" }}
              >
                Drop your stem here or click to browse
              </p>
              <p
                className="text-xs mt-1"
                style={{
                  color: "var(--rm-text-muted)",
                  fontFamily: "var(--rm-font-mono)",
                }}
              >
                mp3, wav, ogg, m4a, flac — max 50MB
              </p>
            </>
          )}
        </div>

        {/* Stem type */}
        <div className="mb-4">
          <label
            className="text-xs mb-2 block"
            style={{
              color: "var(--rm-text-muted)",
              fontFamily: "var(--rm-font-mono)",
            }}
          >
            stem type
          </label>
          <div className="flex flex-wrap gap-2">
            {STEM_TYPES.map((s) => (
              <button
                key={s.value}
                onClick={() => setStemType(s.value)}
                className="px-3 py-1 rounded-lg text-xs font-medium transition-all"
                style={{
                  background:
                    stemType === s.value
                      ? s.color + "22"
                      : "rgba(255,255,255,0.04)",
                  border: `1px solid ${stemType === s.value ? s.color : "rgba(255,255,255,0.1)"}`,
                  color:
                    stemType === s.value ? s.color : "var(--rm-text-muted)",
                }}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notes — e.g. 'Verse melody, D minor, 128 BPM' (optional)"
          maxLength={300}
          rows={2}
          className="w-full rounded-xl px-4 py-3 text-sm outline-none resize-none mb-4"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "var(--rm-text-primary)",
          }}
        />

        {error && (
          <p className="text-sm mb-3" style={{ color: "#F87171" }}>
            {error}
          </p>
        )}

        <button
          onClick={handleSubmit}
          disabled={!file || loading}
          className="w-full py-3 rounded-xl font-medium text-white transition-all disabled:opacity-40"
          style={{ background: "var(--rm-purple)" }}
          onMouseEnter={(e) =>
            !e.currentTarget.disabled &&
            (e.currentTarget.style.background = "#6D28D9")
          }
          onMouseLeave={(e) =>
            !e.currentTarget.disabled &&
            (e.currentTarget.style.background = "var(--rm-purple)")
          }
        >
          {loading ? "Uploading..." : "Upload Stem"}
        </button>
      </div>
    </div>
  );
};

// ── Main Component ─────────────────────────────────────────────────────────────
const ProjectFiles = ({ project, canUpload }) => {
  const { user } = useAuth();
  const { playTrack, track, isPlaying } = usePlayer();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const isOwner = project?.owner?._id?.toString() === user?._id?.toString();

  const handlePlay = (file) => {
    playTrack({
      url: file.url,
      title: file.filename,
      subtitle: project?.title,
      artwork: project?.coverImage || "",
      stemType: file.stemType,
    });
  };

  const isFilePlaying = (file) => track?.url === file.url && isPlaying;

  useEffect(() => {
    if (!project?._id) return;
    (async () => {
      try {
        const data = await getProjectFiles(project._id);
        setFiles(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [project?._id]);

  const handleDelete = async (fileId) => {
    if (!window.confirm("Delete this stem? This cannot be undone.")) return;
    setDeletingId(fileId);
    try {
      await deleteProjectFile(fileId);
      setFiles((prev) => prev.filter((f) => f._id !== fileId));
    } catch (err) {
      alert(err.message || "Failed to delete");
    } finally {
      setDeletingId(null);
    }
  };

  const handleUploaded = (file) => {
    setFiles((prev) => [file, ...prev]);
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-24 rounded-xl animate-pulse"
            style={{
              background: "var(--rm-bg-card)",
              border: "1px solid var(--rm-border)",
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white font-semibold">Stems &amp; Tracks</h3>
            <p
              className="text-xs mt-0.5"
              style={{
                color: "var(--rm-text-muted)",
                fontFamily: "var(--rm-font-mono)",
              }}
            >
              {files.length} file{files.length !== 1 ? "s" : ""}
            </p>
          </div>
          {canUpload && (
            <button
              onClick={() => setShowUpload(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all"
              style={{
                background: "var(--rm-purple-dim)",
                border: "1px solid var(--rm-purple-border)",
                color: "var(--rm-purple-light)",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(124,58,237,0.2)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "var(--rm-purple-dim)")
              }
            >
              <Upload size={14} />
              Upload Stem
            </button>
          )}
        </div>

        {/* File list */}
        {files.length === 0 ? (
          <div
            className="text-center py-16 rounded-2xl"
            style={{
              background: "var(--rm-bg-card)",
              border: "1px dashed var(--rm-purple-border)",
            }}
          >
            <Layers size={24} color="#C084FC" className="mx-auto mb-3" />
            <p className="text-sm" style={{ color: "var(--rm-text-primary)" }}>
              No stems yet
            </p>
            <p
              className="text-xs mt-1"
              style={{
                color: "var(--rm-text-muted)",
                fontFamily: "var(--rm-font-mono)",
              }}
            >
              {canUpload
                ? "upload your first stem to get started"
                : "the team hasn't uploaded any stems yet"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {files.map((file) => {
              const color = stemColor(file.stemType);
              const canDelete =
                file.uploader?._id?.toString() === user?._id?.toString() ||
                isOwner;

              return (
                <div
                  key={file._id}
                  className="rounded-xl p-4 transition-all"
                  style={{
                    background: "var(--rm-bg-card)",
                    border: `1px solid ${isFilePlaying(file) ? color + "44" : "var(--rm-border)"}`,
                    boxShadow: isFilePlaying(file)
                      ? `0 0 20px ${color}18`
                      : "none",
                  }}
                >
                  <div className="flex items-start gap-3">
                    {/* Stem type badge */}
                    <div
                      className="px-2 py-1 rounded-lg text-xs font-medium flex-shrink-0 mt-0.5"
                      style={{
                        background: color + "18",
                        border: `1px solid ${color}44`,
                        color,
                        fontFamily: "var(--rm-font-mono)",
                      }}
                    >
                      {STEM_TYPES.find((s) => s.value === file.stemType)
                        ?.label || "Other"}
                    </div>

                    {/* File info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {file.filename}
                      </p>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span
                          style={{
                            fontSize: 11,
                            color: "var(--rm-text-muted)",
                            fontFamily: "var(--rm-font-mono)",
                          }}
                        >
                          {file.uploader?.username}
                        </span>
                        {file.fileSize && (
                          <span
                            style={{
                              fontSize: 11,
                              color: "var(--rm-text-muted)",
                              fontFamily: "var(--rm-font-mono)",
                            }}
                          >
                            {fmt(file.fileSize)}
                          </span>
                        )}
                        {file.notes && (
                          <span
                            className="text-xs truncate"
                            style={{ color: "var(--rm-text-muted)" }}
                          >
                            {file.notes}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Delete */}
                    {canDelete && (
                      <button
                        onClick={() => handleDelete(file._id)}
                        disabled={deletingId === file._id}
                        className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all disabled:opacity-40"
                        style={{
                          color: "#6B7280",
                          background: "rgba(255,255,255,0.04)",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background =
                            "rgba(239,68,68,0.12)";
                          e.currentTarget.style.color = "#F87171";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background =
                            "rgba(255,255,255,0.04)";
                          e.currentTarget.style.color = "#6B7280";
                        }}
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>

                  {/* Global player button — sends to bottom bar */}
                  <button
                    onClick={() => handlePlay(file)}
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
                    style={{
                      background: isFilePlaying(file)
                        ? color
                        : "rgba(255,255,255,0.08)",
                      border: `1px solid ${isFilePlaying(file) ? color : "rgba(255,255,255,0.12)"}`,
                      color: isFilePlaying(file) ? "#000" : "#fff",
                    }}
                  >
                    {isFilePlaying(file) ? (
                      <Pause size={12} />
                    ) : (
                      <Play size={12} />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showUpload && (
        <UploadModal
          projectId={project._id}
          onClose={() => setShowUpload(false)}
          onUploaded={handleUploaded}
        />
      )}
    </>
  );
};

export default ProjectFiles;
