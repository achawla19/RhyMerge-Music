import { useEffect, useRef, useState } from "react";
import {
  Loader2,
  Upload,
  Play,
  Pause,
  Download,
  Trash2,
  Music2,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { usePlayer } from "../../layouts/PlayerContext";
import {
  getProjectFiles,
  uploadProjectFile,
  deleteProjectFile,
} from "../../api/projectFiles";
import { useToast } from "../ui/Toast";
import { useConfirm } from "../ui/ConfirmDialog";

const STEM_TYPES = [
  "vocals",
  "drums",
  "bass",
  "melody",
  "guitar",
  "keys",
  "fx",
  "full",
  "other",
];

const STEM_COLOR = {
  vocals: "var(--rm-coral)",
  full: "var(--rm-coral)",
  drums: "var(--rm-accent-gold)",
  keys: "var(--rm-accent-gold)",
  bass: "var(--rm-accent-teal)",
  melody: "var(--rm-accent-teal)",
  guitar: "var(--rm-accent-violet)",
  fx: "var(--rm-accent-violet)",
  other: "var(--rm-text-muted)",
};

const formatBytes = (n) => {
  if (!n) return "0 KB";
  const units = ["B", "KB", "MB", "GB"];
  let i = 0;
  let size = n;
  while (size >= 1024 && i < units.length - 1) {
    size /= 1024;
    i++;
  }
  return `${size.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
};

const formatDuration = (secs) => {
  if (!secs && secs !== 0) return null;
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
};

const ProjectFiles = ({ project, canUpload, compact = false }) => {
  const { user } = useAuth();
  const toast = useToast();
  const confirm = useConfirm();
  const { track, isPlaying, playTrack } = usePlayer();
  const fileInputRef = useRef(null);

  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [pendingFile, setPendingFile] = useState(null);
  const [stemType, setStemType] = useState("other");
  const [notes, setNotes] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const projectId = project?._id;

  useEffect(() => {
    if (!projectId) return;
    setLoading(true);
    setError("");
    getProjectFiles(projectId)
      .then(setFiles)
      .catch((err) => setError(err.message || "Failed to load files"))
      .finally(() => setLoading(false));
  }, [projectId]);

  const handlePick = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPendingFile(file);
    setStemType("other");
    setNotes("");
  };

  const handleUpload = async () => {
    if (!pendingFile) return;
    setUploading(true);
    try {
      const nextVersion =
        files.filter((f) => f.filename === pendingFile.name).length + 1;
      const saved = await uploadProjectFile(projectId, pendingFile, {
        stemType,
        notes,
        version: nextVersion,
      });
      setFiles((prev) => [saved, ...prev]);
      toast.success("File uploaded");
      setPendingFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (file) => {
    const ok = await confirm({
      title: `Delete "${file.filename}"?`,
      message:
        "This removes the file for everyone on the project. This can't be undone.",
      confirmText: "Delete",
      tone: "danger",
    });
    if (!ok) return;
    setDeletingId(file._id);
    try {
      await deleteProjectFile(file._id);
      setFiles((prev) => prev.filter((f) => f._id !== file._id));
      toast.success("File deleted");
    } catch (err) {
      toast.error(err.message || "Failed to delete file");
    } finally {
      setDeletingId(null);
    }
  };

  const handlePlay = (file) => {
    playTrack({
      url: file.url,
      title: file.filename,
      subtitle: project?.title,
      artwork: project?.coverImage,
      stemType: file.stemType,
    });
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center py-16">
        <Loader2
          size={20}
          color="var(--rm-coral-light)"
          className="animate-spin"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-10 text-center">
        <p className="text-sm" style={{ color: "var(--rm-error)" }}>
          {error}
        </p>
      </div>
    );
  }

  return (
    <div className={compact ? "px-1" : ""}>
      {canUpload && (
        <div className="rm-card p-4 mb-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            onChange={handlePick}
            className="hidden"
            id="project-file-input"
          />

          {!pendingFile ? (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium transition-colors"
              style={{
                border: "1px dashed var(--rm-coral-border)",
                color: "var(--rm-coral-light)",
              }}
            >
              <Upload size={15} />
              Upload a stem or mix
            </button>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-white truncate">{pendingFile.name}</p>
              <div className="flex gap-2">
                <select
                  value={stemType}
                  onChange={(e) => setStemType(e.target.value)}
                  className="flex-1 text-xs rounded-lg px-3 py-2 capitalize"
                  style={{
                    background: "var(--rm-bg-raised)",
                    border: "1px solid var(--rm-border)",
                    color: "var(--rm-text-primary)",
                  }}
                >
                  {STEM_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <input
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Notes (optional)"
                maxLength={300}
                className="w-full text-xs rounded-lg px-3 py-2"
                style={{
                  background: "var(--rm-bg-raised)",
                  border: "1px solid var(--rm-border)",
                  color: "var(--rm-text-primary)",
                }}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="rm-btn rm-btn-primary text-xs flex-1 justify-center disabled:opacity-50"
                >
                  {uploading && <Loader2 size={12} className="animate-spin" />}
                  {uploading ? "Uploading..." : "Upload"}
                </button>
                <button
                  onClick={() => {
                    setPendingFile(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  disabled={uploading}
                  className="rm-btn rm-btn-ghost text-xs"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {files.length === 0 ? (
        <div className="py-14 text-center">
          <Music2
            size={22}
            color="var(--rm-text-muted)"
            className="mx-auto mb-3"
          />
          <p
            style={{
              color: "var(--rm-text-muted)",
              fontFamily: "var(--rm-font-mono)",
              fontSize: 13,
            }}
          >
            {canUpload
              ? "No files yet — upload the first one."
              : "No files yet"}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {files.map((file) => {
            const isCurrent = track?.url === file.url;
            const canDelete =
              canUpload &&
              (file.uploader?._id?.toString() === user?._id?.toString() ||
                project?.owner?._id?.toString() === user?._id?.toString());
            const dur = formatDuration(file.duration);

            return (
              <div
                key={file._id}
                className="rm-card p-3 flex items-center gap-3"
              >
                <button
                  onClick={() => handlePlay(file)}
                  className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    background: "var(--rm-coral-dim)",
                    border: "1px solid var(--rm-coral-border)",
                  }}
                >
                  {isCurrent && isPlaying ? (
                    <Pause size={14} color="var(--rm-coral-light)" />
                  ) : (
                    <Play
                      size={14}
                      color="var(--rm-coral-light)"
                      className="ml-0.5"
                    />
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{file.filename}</p>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    <span
                      className="rm-badge capitalize"
                      style={{
                        background: `${STEM_COLOR[file.stemType]}1f`,
                        color: STEM_COLOR[file.stemType],
                        border: `1px solid ${STEM_COLOR[file.stemType]}44`,
                      }}
                    >
                      {file.stemType}
                    </span>
                    <span
                      className="text-[11px]"
                      style={{
                        color: "var(--rm-text-muted)",
                        fontFamily: "var(--rm-font-mono)",
                      }}
                    >
                      v{file.version} · {formatBytes(file.fileSize)}
                      {dur ? ` · ${dur}` : ""}
                    </span>
                  </div>
                  {file.notes && (
                    <p
                      className="text-xs mt-1 truncate"
                      style={{ color: "var(--rm-text-secondary)" }}
                    >
                      {file.notes}
                    </p>
                  )}
                </div>

                <a
                  href={file.url}
                  download={file.filename}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ color: "var(--rm-text-muted)" }}
                >
                  <Download size={15} />
                </a>

                {canDelete && (
                  <button
                    onClick={() => handleDelete(file)}
                    disabled={deletingId === file._id}
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 disabled:opacity-50"
                    style={{ color: "var(--rm-error)" }}
                  >
                    {deletingId === file._id ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Trash2 size={14} />
                    )}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProjectFiles;
