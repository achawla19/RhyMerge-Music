import { useEffect, useState, useRef } from "react";
import { Music2, Upload, Trash2, Download, Loader2, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import {
  getProjectFiles,
  uploadProjectFile,
  deleteProjectFile,
} from "../../api/projectFiles";

const API_ORIGIN = import.meta.env.VITE_API_URL;
const ALLOWED_TYPES = [
  "audio/mpeg",
  "audio/wav",
  "audio/x-wav",
  "audio/ogg",
  "audio/mp4",
  "audio/x-m4a",
  "audio/flac",
  "audio/webm",
];
const MAX_FILE_SIZE = 25 * 1024 * 1024;

const formatFileSize = (bytes) => {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const ProjectFiles = ({ project, canUpload }) => {
  const { user } = useAuth();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [notes, setNotes] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const fileInputRef = useRef(null);

  const loadFiles = async () => {
    try {
      const data = await getProjectFiles(project._id);
      setFiles(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project._id]);

  const handleFilePick = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setError("");
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Only audio files are supported (mp3, wav, ogg, m4a, flac)");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError("File is too large — max 25MB");
      return;
    }
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    setProgress(0);
    setError("");
    try {
      const newFile = await uploadProjectFile(
        project._id,
        selectedFile,
        notes,
        setProgress,
      );
      setFiles((prev) => [...prev, newFile]);
      setSelectedFile(null);
      setNotes("");
    } catch (err) {
      setError(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (fileId) => {
    setDeletingId(fileId);
    try {
      await deleteProjectFile(fileId);
      setFiles((prev) => prev.filter((f) => f._id !== fileId));
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to delete file");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div
      className="rounded-2xl p-6"
      style={{
        background: "var(--rm-bg-card)",
        border: "1px solid var(--rm-border)",
      }}
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-white font-semibold text-lg">Stems</h3>
          <p
            className="text-xs mt-1"
            style={{
              color: "var(--rm-text-muted)",
              fontFamily: "var(--rm-font-mono)",
            }}
          >
            {files.length} track{files.length === 1 ? "" : "s"} shared in this
            mix
          </p>
        </div>
      </div>

      {/* Upload control — only project members see this */}
      {canUpload && (
        <div className="mb-5">
          {!selectedFile ? (
            <>
              <input
                ref={fileInputRef}
                type="file"
                accept={ALLOWED_TYPES.join(",")}
                onChange={handleFilePick}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-medium transition-all"
                style={{
                  background: "var(--rm-purple-dim)",
                  border: "1px dashed var(--rm-purple-border)",
                  color: "var(--rm-purple-light)",
                }}
              >
                <Upload size={15} />
                Upload a stem
              </button>
            </>
          ) : (
            <div
              className="rounded-xl p-4"
              style={{
                background: "var(--rm-bg)",
                border: "1px solid var(--rm-purple-border)",
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: "var(--rm-purple-dim)" }}
                >
                  <Music2 size={14} color="#C084FC" />
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm truncate"
                    style={{ color: "var(--rm-text-primary)" }}
                  >
                    {selectedFile.name}
                  </p>
                  <p
                    className="text-[11px]"
                    style={{
                      color: "var(--rm-text-muted)",
                      fontFamily: "var(--rm-font-mono)",
                    }}
                  >
                    {uploading
                      ? `uploading... ${progress}%`
                      : formatFileSize(selectedFile.size)}
                  </p>
                </div>
                {!uploading && (
                  <button
                    onClick={() => setSelectedFile(null)}
                    className="flex-shrink-0"
                  >
                    <X size={15} color="var(--rm-text-muted)" />
                  </button>
                )}
              </div>

              <input
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="add a note about this version (optional)"
                maxLength={300}
                disabled={uploading}
                className="w-full px-3 py-2 rounded-lg text-sm outline-none mb-3"
                style={{
                  background: "var(--rm-bg-card)",
                  border: "1px solid rgba(124,58,237,0.2)",
                  color: "var(--rm-text-primary)",
                }}
              />

              <button
                onClick={handleUpload}
                disabled={uploading}
                className="w-full py-2.5 rounded-lg text-sm font-medium text-white transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                style={{ background: "var(--rm-purple)" }}
              >
                {uploading && <Loader2 size={14} className="animate-spin" />}
                {uploading ? "Uploading..." : "Share with the team"}
              </button>
            </div>
          )}
          {error && (
            <p className="text-xs mt-2" style={{ color: "#F87171" }}>
              {error}
            </p>
          )}
        </div>
      )}

      {/* File list */}
      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="h-16 rounded-xl animate-pulse"
              style={{ background: "rgba(255,255,255,0.03)" }}
            />
          ))}
        </div>
      ) : files.length === 0 ? (
        <div className="text-center py-10">
          <Music2 size={24} color="#6B7280" className="mx-auto mb-2" />
          <p className="text-sm" style={{ color: "var(--rm-text-muted)" }}>
            no stems shared yet
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {files.map((file, i) => {
            const canDelete =
              file.uploader._id === user._id || project.owner?._id === user._id;
            return (
              <div
                key={file._id}
                className="rounded-xl p-3"
                style={{
                  background: "var(--rm-bg)",
                  border: "1px solid rgba(124,58,237,0.15)",
                }}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className="text-[10px] px-2 py-0.5 rounded-full flex-shrink-0"
                      style={{
                        background: "var(--rm-purple-dim)",
                        color: "var(--rm-purple-light)",
                        fontFamily: "var(--rm-font-mono)",
                      }}
                    >
                      v{i + 1}
                    </span>
                    <div className="min-w-0">
                      <p
                        className="text-sm truncate"
                        style={{ color: "var(--rm-text-primary)" }}
                      >
                        {file.filename}
                      </p>
                      <p
                        className="text-[11px]"
                        style={{
                          color: "var(--rm-text-muted)",
                          fontFamily: "var(--rm-font-mono)",
                        }}
                      >
                        {file.uploader.username} ·{" "}
                        {formatFileSize(file.fileSize)} ·{" "}
                        {new Date(file.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 flex-shrink-0">
                    <a
                      href={`${API_ORIGIN}${file.url}`}
                      download={file.filename}
                      className="p-1.5 rounded-lg transition-all"
                      style={{ background: "rgba(255,255,255,0.04)" }}
                      title="Download"
                    >
                      <Download size={13} color="var(--rm-text-muted)" />
                    </a>
                    {canDelete && (
                      <button
                        onClick={() => handleDelete(file._id)}
                        disabled={deletingId === file._id}
                        className="p-1.5 rounded-lg transition-all disabled:opacity-50"
                        style={{ background: "rgba(248,113,113,0.08)" }}
                        title="Delete"
                      >
                        {deletingId === file._id ? (
                          <Loader2
                            size={13}
                            className="animate-spin"
                            color="#F87171"
                          />
                        ) : (
                          <Trash2 size={13} color="#F87171" />
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {file.notes && (
                  <p
                    className="text-xs mb-2 italic"
                    style={{ color: "var(--rm-text-secondary)" }}
                  >
                    "{file.notes}"
                  </p>
                )}

                <audio
                  controls
                  src={`${API_ORIGIN}${file.url}`}
                  style={{ width: "100%", height: 32 }}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProjectFiles;
