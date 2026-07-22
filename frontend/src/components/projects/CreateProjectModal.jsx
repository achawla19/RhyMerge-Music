import { useState } from "react";
import { X, Music2, Loader2, Hash, Gauge } from "lucide-react";
import { uploadProjectCover } from "../../api/projects";
import { createPost } from "../../api/post";
import Select from "../ui/Select";

const GENRES = [
  "Hip-Hop",
  "R&B",
  "Pop",
  "Electronic",
  "Rock",
  "Jazz",
  "Classical",
  "Afrobeats",
  "Lo-Fi",
  "Trap",
  "Soul",
  "Other",
];
const STATUS_OPTS = [
  "Planning",
  "Recording",
  "Production",
  "Mixing",
  "Completed",
];
const COMMON_ROLES = [
  "Vocalist",
  "Producer",
  "Mix Engineer",
  "Lyricist",
  "Guitarist",
  "Drummer",
  "Keyboardist",
  "Sound Designer",
  "Mastering Engineer",
];
const KEYS = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const MODES = ["major", "minor", "dorian", "mixolydian"];

const EMPTY = {
  title: "",
  description: "",
  genre: "",
  bpm: "",
  musicalKey: "",
  status: "Planning",
  neededRoles: [],
  tags: [],
  lookingForCollaborators: true,
  isPublic: true,
};

const inputStyle = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  color: "var(--rm-text-primary)",
  borderRadius: 12,
  padding: "10px 16px",
  width: "100%",
  outline: "none",
  fontSize: 14,
};

const labelStyle = {
  fontFamily: "var(--rm-font-mono)",
  color: "var(--rm-text-muted)",
  fontSize: 11,
  marginBottom: 6,
  display: "block",
};

export default function CreateProjectModal({ isOpen, onClose, onCreate }) {
  const [form, setForm] = useState(EMPTY);
  const [roleInput, setRoleInput] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState("");
  const [shareToFeed, setShareToFeed] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const addRole = () => {
    const r = roleInput.trim();
    if (r && !form.neededRoles.includes(r))
      setForm((f) => ({ ...f, neededRoles: [...f.neededRoles, r] }));
    setRoleInput("");
  };
  const removeRole = (r) =>
    setForm((f) => ({
      ...f,
      neededRoles: f.neededRoles.filter((x) => x !== r),
    }));

  const addTag = () => {
    const t = tagInput.trim().toLowerCase().replace(/\s+/g, "-");
    if (t && !form.tags.includes(t))
      setForm((f) => ({ ...f, tags: [...f.tags, t] }));
    setTagInput("");
  };
  const removeTag = (t) =>
    setForm((f) => ({ ...f, tags: f.tags.filter((x) => x !== t) }));

  const handleCoverChange = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("Project title is required");
      return;
    }
    setLoading(true);
    setError("");

    try {
      // Create project first, then upload cover (requires project ID)
      const project = await onCreate({
        ...form,
        bpm: form.bpm ? Number(form.bpm) : null,
      });

      // Upload cover separately if one was chosen
      if (coverFile && project?._id) {
        try {
          await uploadProjectCover(project._id, coverFile);
        } catch {}
      }

      // Optionally announce it on the feed — best effort, never blocks
      // the project itself from being created successfully.
      if (shareToFeed && project?._id) {
        try {
          await createPost({
            content: `Just started working on "${project.title}" 🎵${
              form.lookingForCollaborators ? " — open to collaborators!" : ""
            }`,
            linkedProject: project._id,
          });
        } catch {}
      }

      setForm(EMPTY);
      setCoverFile(null);
      setCoverPreview("");
      onClose();
    } catch (err) {
      setError(err.message || "Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(10px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-2xl rounded-2xl p-7 my-4"
        style={{
          background: "var(--rm-bg-card)",
          border: "1px solid var(--rm-border)",
          boxShadow: "0 24px 60px rgba(0,0,0,0.55)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{
                background: "var(--rm-purple-dim)",
                border: "1px solid var(--rm-purple-border)",
              }}
            >
              <Music2 size={16} color="#C084FC" />
            </div>
            <div>
              <h2 className="text-white font-bold text-xl">Post a Project</h2>
              <p
                className="text-xs"
                style={{
                  fontFamily: "var(--rm-font-mono)",
                  color: "var(--rm-text-muted)",
                }}
              >
                set the vibe, find your crew
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ color: "var(--rm-text-muted)" }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Cover image */}
          <div
            className="relative h-28 rounded-xl overflow-hidden cursor-pointer flex items-center justify-center group"
            style={{
              background: coverPreview
                ? `url(${coverPreview}) center/cover`
                : "rgba(124,58,237,0.06)",
              border: "1px dashed rgba(124,58,237,0.25)",
            }}
            onClick={() => document.getElementById("cover-input").click()}
          >
            <input
              id="cover-input"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleCoverChange(e.target.files[0])}
            />
            <div
              className="flex flex-col items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity"
              style={{
                color: "var(--rm-purple-light)",
                background: coverPreview ? "rgba(0,0,0,0.4)" : "transparent",
                padding: "8px 16px",
                borderRadius: 8,
              }}
            >
              <Music2 size={18} />
              <span
                className="text-xs"
                style={{ fontFamily: "var(--rm-font-mono)" }}
              >
                {coverPreview ? "change cover" : "add project cover"}
              </span>
            </div>
          </div>

          {/* Title */}
          <div>
            <label style={labelStyle}>title *</label>
            <input
              value={form.title}
              onChange={set("title")}
              placeholder="My EP, Collab Session #3..."
              style={inputStyle}
              maxLength={100}
              onFocus={(e) =>
                (e.currentTarget.style.borderColor = "var(--rm-purple)")
              }
              onBlur={(e) =>
                (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")
              }
            />
          </div>

          {/* Description */}
          <div>
            <label style={labelStyle}>description</label>
            <textarea
              value={form.description}
              onChange={set("description")}
              rows={3}
              maxLength={1000}
              placeholder="What's the vibe? What are you building?"
              style={{ ...inputStyle, resize: "none" }}
              onFocus={(e) =>
                (e.currentTarget.style.borderColor = "var(--rm-purple)")
              }
              onBlur={(e) =>
                (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")
              }
            />
          </div>

          {/* Genre + Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label style={labelStyle}>genre</label>
              <Select
                value={form.genre}
                onChange={(v) => setForm((f) => ({ ...f, genre: v }))}
                options={GENRES}
                placeholder="Select genre"
              />
            </div>
            <div>
              <label style={labelStyle}>status</label>
              <Select
                value={form.status}
                onChange={(v) => setForm((f) => ({ ...f, status: v }))}
                options={STATUS_OPTS}
              />
            </div>
          </div>

          {/* BPM + Key */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                style={{
                  ...labelStyle,
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <Gauge size={11} /> bpm
              </label>
              <input
                value={form.bpm}
                onChange={set("bpm")}
                type="number"
                min={40}
                max={300}
                placeholder="e.g. 128"
                style={inputStyle}
                onFocus={(e) =>
                  (e.currentTarget.style.borderColor = "var(--rm-purple)")
                }
                onBlur={(e) =>
                  (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")
                }
              />
            </div>
            <div>
              <label
                style={{
                  ...labelStyle,
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <Hash size={11} /> key
              </label>
              <div className="flex gap-2">
                <div style={{ flex: 1 }}>
                  <Select
                    value={form.musicalKey.split(" ")[0] || ""}
                    onChange={(v) => {
                      const mode = form.musicalKey.split(" ")[1] || "major";
                      setForm((f) => ({
                        ...f,
                        musicalKey: v ? `${v} ${mode}` : "",
                      }));
                    }}
                    options={[
                      { value: "", label: "—" },
                      ...KEYS.map((k) => ({ value: k, label: k })),
                    ]}
                    placeholder="—"
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <Select
                    value={form.musicalKey.split(" ")[1] || "major"}
                    onChange={(v) => {
                      const root = form.musicalKey.split(" ")[0] || "";
                      if (root)
                        setForm((f) => ({ ...f, musicalKey: `${root} ${v}` }));
                    }}
                    options={MODES.map((m) => ({ value: m, label: m }))}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Open Roles */}
          <div>
            <label style={labelStyle}>open roles</label>
            {/* Quick picks */}
            <div className="flex flex-wrap gap-1.5 mb-2">
              {COMMON_ROLES.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() =>
                    !form.neededRoles.includes(r) &&
                    setForm((f) => ({
                      ...f,
                      neededRoles: [...f.neededRoles, r],
                    }))
                  }
                  className="px-2.5 py-1 rounded-lg text-xs transition-all"
                  style={
                    form.neededRoles.includes(r)
                      ? {
                          background: "var(--rm-purple-dim)",
                          border: "1px solid var(--rm-purple-border)",
                          color: "var(--rm-purple-light)",
                        }
                      : {
                          background: "rgba(255,255,255,0.03)",
                          border: "1px solid rgba(255,255,255,0.08)",
                          color: "var(--rm-text-muted)",
                        }
                  }
                >
                  {r}
                </button>
              ))}
            </div>
            {/* Custom role input */}
            <div className="flex gap-2">
              <input
                value={roleInput}
                onChange={(e) => setRoleInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addRole())
                }
                placeholder="or type a custom role..."
                style={{ ...inputStyle, flex: 1 }}
              />
              <button
                type="button"
                onClick={addRole}
                className="px-4 rounded-xl text-sm font-medium"
                style={{
                  background: "var(--rm-purple-dim)",
                  border: "1px solid var(--rm-purple-border)",
                  color: "var(--rm-purple-light)",
                  whiteSpace: "nowrap",
                }}
              >
                Add
              </button>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label style={labelStyle}>tags</label>
            <div className="flex gap-2 mb-2">
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addTag())
                }
                placeholder="e.g. dark, bouncy, introspective"
                style={{ ...inputStyle, flex: 1 }}
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 rounded-xl text-sm font-medium"
                style={{
                  background: "var(--rm-purple-dim)",
                  border: "1px solid var(--rm-purple-border)",
                  color: "var(--rm-purple-light)",
                }}
              >
                Add
              </button>
            </div>
            {form.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {form.tags.map((t) => (
                  <span
                    key={t}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      color: "var(--rm-text-muted)",
                      fontFamily: "var(--rm-font-mono)",
                    }}
                  >
                    #{t}
                    <button type="button" onClick={() => removeTag(t)}>
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Toggles */}
          <div className="flex gap-6">
            {[
              {
                key: "lookingForCollaborators",
                label: "Open to collaborators",
              },
              { key: "isPublic", label: "Public project" },
            ].map(({ key, label }) => (
              <label
                key={key}
                className="flex items-center gap-2 cursor-pointer"
              >
                <div
                  className="w-10 h-5 rounded-full relative transition-colors"
                  style={{
                    background: form[key]
                      ? "var(--rm-purple)"
                      : "rgba(255,255,255,0.1)",
                  }}
                  onClick={() => setForm((f) => ({ ...f, [key]: !f[key] }))}
                >
                  <span
                    className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform"
                    style={{
                      transform: form[key] ? "translateX(20px)" : "none",
                    }}
                  />
                </div>
                <span
                  className="text-sm"
                  style={{ color: "var(--rm-text-secondary)" }}
                >
                  {label}
                </span>
              </label>
            ))}
          </div>

          {error && (
            <p className="text-sm" style={{ color: "#F87171" }}>
              {error}
            </p>
          )}

          <label className="flex items-center gap-2 cursor-pointer w-fit">
            <div
              className="w-10 h-5 rounded-full relative transition-colors"
              style={{
                background: shareToFeed
                  ? "var(--rm-purple)"
                  : "rgba(255,255,255,0.1)",
              }}
              onClick={() => setShareToFeed((v) => !v)}
            >
              <span
                className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform"
                style={{
                  transform: shareToFeed ? "translateX(20px)" : "none",
                }}
              />
            </div>
            <span
              className="text-sm"
              style={{ color: "var(--rm-text-secondary)" }}
            >
              Share to your feed
            </span>
          </label>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 rounded-xl font-medium text-white disabled:opacity-50 flex items-center justify-center gap-2"
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
              {loading && <Loader2 size={15} className="animate-spin" />}
              {loading ? "Creating..." : "Create Mix"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-xl font-medium"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "var(--rm-text-secondary)",
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
