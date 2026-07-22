import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  X,
  Bookmark,
  Music2,
  Users,
  Gauge,
  Hash,
  Pencil,
  Trash2,
  Loader2,
  Plus,
  Layers,
  CheckCircle2,
  Calendar,
  Clock,
  UserPlus,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { usePlayer } from "../../layouts/PlayerContext";
import {
  getProjectById,
  updateProject,
  deleteProject,
} from "../../api/projects";
import { toggleSavedProject, getSavedProjects } from "../../api/savedProjects";
import {
  createProjectRequest,
  getProjectRequests,
  getMyProjectRequest,
} from "../../api/projectRequests";
import { getProjectFiles } from "../../api/projectFiles";
import ProjectFiles from "./ProjectFiles";
import ProjectRequests from "./ProjectRequests";
import Select from "../ui/Select";
import { useToast } from "../ui/Toast";
import { useConfirm } from "../ui/ConfirmDialog";

const STATUS_OPTS = [
  "Planning",
  "Recording",
  "Production",
  "Mixing",
  "Completed",
];
const statusStyle = {
  Planning: {
    color: "#FBBF24",
    bg: "rgba(245,158,11,0.1)",
    border: "rgba(245,158,11,0.3)",
  },
  Recording: {
    color: "#C084FC",
    bg: "rgba(124,58,237,0.12)",
    border: "rgba(124,58,237,0.3)",
  },
  Production: {
    color: "#C084FC",
    bg: "rgba(124,58,237,0.12)",
    border: "rgba(124,58,237,0.3)",
  },
  Mixing: {
    color: "#60A5FA",
    bg: "rgba(96,165,250,0.1)",
    border: "rgba(96,165,250,0.3)",
  },
  Completed: {
    color: "#34D399",
    bg: "rgba(16,185,129,0.1)",
    border: "rgba(16,185,129,0.3)",
  },
};

const TABS = ["Overview", "Files", "Team"];

// ── Edit Modal ────────────────────────────────────────────────────────────────
const EditModal = ({ project, onClose, onSaved }) => {
  const [form, setForm] = useState({
    title: project.title || "",
    description: project.description || "",
    genre: project.genre || "",
    bpm: project.bpm || "",
    musicalKey: project.musicalKey || "",
    status: project.status || "Planning",
    lookingForCollaborators: project.lookingForCollaborators ?? true,
    isPublic: project.isPublic ?? true,
    neededRoles: project.neededRoles || [],
    tags: project.tags || [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [roleInput, setRoleInput] = useState("");

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("Title is required");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const updated = await updateProject(project._id, {
        ...form,
        bpm: form.bpm ? Number(form.bpm) : null,
      });
      onSaved(updated);
      onClose();
    } catch (err) {
      setError(err.message || "Failed to save");
    } finally {
      setLoading(false);
    }
  };

  const inp = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    color: "var(--rm-text-primary)",
    borderRadius: 12,
    padding: "10px 16px",
    width: "100%",
    outline: "none",
    fontSize: 13,
  };
  const lbl = {
    fontFamily: "var(--rm-font-mono)",
    color: "var(--rm-text-muted)",
    fontSize: 11,
    marginBottom: 4,
    display: "block",
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 overflow-y-auto"
      style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-xl rounded-2xl p-6 my-4"
        style={{
          background: "#110820",
          border: "1px solid rgba(124,58,237,0.3)",
          boxShadow: "0 24px 60px rgba(0,0,0,0.7)",
        }}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white font-bold text-lg">Edit Project</h2>
          <button onClick={onClose} style={{ color: "var(--rm-text-muted)" }}>
            <X size={16} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label style={lbl}>title *</label>
            <input
              value={form.title}
              onChange={set("title")}
              style={inp}
              maxLength={100}
            />
          </div>
          <div>
            <label style={lbl}>description</label>
            <textarea
              value={form.description}
              onChange={set("description")}
              rows={3}
              maxLength={1000}
              style={{ ...inp, resize: "none" }}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label style={lbl}>genre</label>
              <input value={form.genre} onChange={set("genre")} style={inp} />
            </div>
            <div>
              <label style={lbl}>status</label>
              <Select
                value={form.status}
                onChange={(v) => setForm((f) => ({ ...f, status: v }))}
                options={STATUS_OPTS}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label style={lbl}>bpm</label>
              <input
                value={form.bpm}
                onChange={set("bpm")}
                type="number"
                min={40}
                max={300}
                placeholder="128"
                style={inp}
              />
            </div>
            <div>
              <label style={lbl}>key</label>
              <input
                value={form.musicalKey}
                onChange={set("musicalKey")}
                placeholder="A minor"
                style={inp}
              />
            </div>
          </div>
          <div>
            <label style={lbl}>open roles</label>
            <div className="flex gap-2 mb-2">
              <input
                value={roleInput}
                onChange={(e) => setRoleInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addRole())
                }
                placeholder="Add role..."
                style={{ ...inp, flex: 1 }}
              />
              <button
                type="button"
                onClick={addRole}
                className="px-3 rounded-xl text-sm"
                style={{
                  background: "var(--rm-purple-dim)",
                  border: "1px solid var(--rm-purple-border)",
                  color: "var(--rm-purple-light)",
                }}
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {form.neededRoles.map((r) => (
                <span
                  key={r}
                  className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs"
                  style={{
                    background: "var(--rm-purple-dim)",
                    border: "1px solid var(--rm-purple-border)",
                    color: "var(--rm-purple-light)",
                  }}
                >
                  {r}{" "}
                  <button type="button" onClick={() => removeRole(r)}>
                    <X size={10} />
                  </button>
                </span>
              ))}
            </div>
          </div>
          <div className="flex gap-4">
            {[
              { key: "lookingForCollaborators", label: "Open collab" },
              { key: "isPublic", label: "Public" },
            ].map(({ key, label }) => (
              <label
                key={key}
                className="flex items-center gap-2 cursor-pointer"
              >
                <div
                  className="w-9 h-5 rounded-full relative transition-colors"
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
                      transform: form[key] ? "translateX(16px)" : "none",
                    }}
                  />
                </div>
                <span
                  className="text-xs"
                  style={{ color: "var(--rm-text-secondary)" }}
                >
                  {label}
                </span>
              </label>
            ))}
          </div>
          {error && (
            <p className="text-xs" style={{ color: "#F87171" }}>
              {error}
            </p>
          )}
          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white disabled:opacity-50"
              style={{ background: "var(--rm-purple)" }}
            >
              {loading && <Loader2 size={13} className="animate-spin" />}
              {loading ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm"
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
};

// ── Main Panel ────────────────────────────────────────────────────────────────
export default function ProjectRightPanel({ projectId, onClose }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();
  const confirm = useConfirm();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [savingToggle, setSavingToggle] = useState(false);
  const [activeTab, setActiveTab] = useState("Overview");
  const [editOpen, setEditOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [hasPending, setHasPending] = useState(false);
  const [requests, setRequests] = useState([]);
  const [banner, setBanner] = useState(false);

  const loadProject = async () => {
    try {
      const data = await getProjectById(projectId);
      setProject(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!projectId) return;
    setLoading(true);
    setProject(null);
    setActiveTab("Overview");
    loadProject();
    getSavedProjects()
      .then((list) => setSaved(list.some((p) => p._id === projectId)))
      .catch(() => {});
  }, [projectId]);

  useEffect(() => {
    if (!project || !user) return;
    const isOwner = project.owner?._id?.toString() === user._id?.toString();
    if (isOwner)
      getProjectRequests(project._id)
        .then(setRequests)
        .catch(() => {});
    getMyProjectRequest(project._id)
      .then((d) => setHasPending(d?.exists || false))
      .catch(() => {});
  }, [project?._id, user]);

  if (loading)
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 size={22} color="#C084FC" className="animate-spin" />
      </div>
    );

  if (!project)
    return (
      <div className="h-full flex items-center justify-center p-6 text-center">
        <p
          style={{
            color: "var(--rm-text-muted)",
            fontFamily: "var(--rm-font-mono)",
            fontSize: 13,
          }}
        >
          project not found
        </p>
      </div>
    );

  const isOwner = project.owner?._id?.toString() === user?._id?.toString();
  const alreadyCollab = project.collaborators?.some(
    (c) => c._id?.toString() === user?._id?.toString(),
  );
  const isMember = isOwner || alreadyCollab;
  const s = statusStyle[project.status] || statusStyle.Planning;

  const handleSave = async () => {
    setSavingToggle(true);
    try {
      const r = await toggleSavedProject(projectId);
      setSaved(r.saved);
    } catch {
    } finally {
      setSavingToggle(false);
    }
  };

  const handleJoin = async () => {
    try {
      await createProjectRequest({
        projectId,
        role: "Collaborator",
        message: "I'd love to join this project!",
      });
      setHasPending(true);
      setBanner(true);
      setTimeout(() => setBanner(false), 4000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    const ok = await confirm({
      title: `Delete "${project.title}"?`,
      message:
        "This will remove the project for all collaborators. This cannot be undone.",
      confirmText: "Delete",
      tone: "danger",
    });
    if (!ok) return;
    setDeleting(true);
    try {
      await deleteProject(projectId);
      toast.success("Project deleted");
      onClose();
    } catch (err) {
      toast.error(err.message || "Failed to delete project");
      setDeleting(false);
    }
  };

  return (
    <div
      className="h-full flex flex-col overflow-hidden"
      style={{ fontSize: 13 }}
    >
      {/* BANNER */}
      <div
        className="relative flex-shrink-0"
        style={{
          height: 160,
          background: project.coverImage
            ? `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(11,8,20,0.98)), url(${project.coverImage}) center/cover`
            : "linear-gradient(135deg, rgba(124,58,237,0.4), rgba(192,132,252,0.1), rgba(11,8,20,0.98))",
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.5)", color: "#fff" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "rgba(0,0,0,0.8)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "rgba(0,0,0,0.5)")
          }
        >
          <X size={14} />
        </button>

        {/* Status badge */}
        <span
          className="absolute top-3 left-3 px-2 py-0.5 rounded-full text-[10px] font-medium"
          style={{
            background: s.bg,
            border: `1px solid ${s.border}`,
            color: s.color,
            fontFamily: "var(--rm-font-mono)",
          }}
        >
          {project.status}
        </span>

        {/* Title + meta at bottom */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-3">
          <h2 className="text-lg font-bold text-white leading-tight truncate">
            {project.title}
          </h2>
          <div className="flex items-center gap-3 mt-0.5 flex-wrap">
            {project.genre && (
              <span
                style={{
                  color: "var(--rm-purple-light)",
                  fontFamily: "var(--rm-font-mono)",
                  fontSize: 11,
                }}
              >
                {project.genre}
              </span>
            )}
            {project.bpm && (
              <span
                className="flex items-center gap-0.5"
                style={{
                  color: "#60A5FA",
                  fontFamily: "var(--rm-font-mono)",
                  fontSize: 11,
                }}
              >
                <Gauge size={9} />
                {project.bpm} BPM
              </span>
            )}
            {project.musicalKey && (
              <span
                className="flex items-center gap-0.5"
                style={{
                  color: "#FBBF24",
                  fontFamily: "var(--rm-font-mono)",
                  fontSize: 11,
                }}
              >
                <Hash size={9} />
                {project.musicalKey}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* SUCCESS BANNER */}
      {banner && (
        <div
          className="flex items-center gap-2 px-4 py-2 flex-shrink-0"
          style={{
            background: "rgba(16,185,129,0.1)",
            borderBottom: "1px solid rgba(16,185,129,0.2)",
          }}
        >
          <CheckCircle2 size={13} color="#34D399" />
          <span className="text-xs" style={{ color: "#34D399" }}>
            Request sent!
          </span>
        </div>
      )}

      {/* ACTION ROW */}
      <div
        className="flex items-center gap-2 px-4 py-2.5 flex-shrink-0 flex-wrap"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        {isOwner ? (
          <>
            <button
              onClick={() => setEditOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
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
              <Pencil size={11} /> Edit
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all disabled:opacity-50"
              style={{
                background: "rgba(248,113,113,0.08)",
                border: "1px solid rgba(248,113,113,0.25)",
                color: "#F87171",
              }}
            >
              {deleting ? (
                <Loader2 size={11} className="animate-spin" />
              ) : (
                <Trash2 size={11} />
              )}
              {deleting ? "Deleting..." : "Delete"}
            </button>
          </>
        ) : alreadyCollab ? (
          <span
            className="px-3 py-1.5 rounded-lg text-xs"
            style={{ background: "rgba(96,165,250,0.1)", color: "#60A5FA" }}
          >
            Member
          </span>
        ) : hasPending ? (
          <span
            className="px-3 py-1.5 rounded-lg text-xs"
            style={{ background: "rgba(245,158,11,0.1)", color: "#FBBF24" }}
          >
            Sent
          </span>
        ) : (
          <button
            onClick={handleJoin}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white transition-all"
            style={{ background: "var(--rm-purple)" }}
          >
            <UserPlus size={11} /> Join
          </button>
        )}

        <button
          onClick={handleSave}
          disabled={savingToggle}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all disabled:opacity-50"
          style={
            saved
              ? {
                  background: "var(--rm-purple-dim)",
                  border: "1px solid var(--rm-purple-border)",
                  color: "var(--rm-purple-light)",
                }
              : {
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "var(--rm-text-muted)",
                }
          }
        >
          <Bookmark size={11} fill={saved ? "currentColor" : "none"} />
          {saved ? "Saved" : "Save"}
        </button>

        <div className="flex-1" />
        <span
          style={{
            fontSize: 10,
            color: "var(--rm-text-muted)",
            fontFamily: "var(--rm-font-mono)",
          }}
        >
          {new Date(project.createdAt).toLocaleDateString()}
        </span>
      </div>

      {/* COLLAB REQUESTS — owner only */}
      {isOwner && requests.length > 0 && (
        <div
          className="flex-shrink-0 px-4 py-2"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <ProjectRequests
            requests={requests}
            refresh={async () => {
              await loadProject();
              const d = await getProjectRequests(projectId);
              setRequests(d);
            }}
          />
        </div>
      )}

      {/* TABS */}
      <div
        className="flex gap-1 p-1 mx-4 my-2 rounded-xl flex-shrink-0"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-medium transition-all"
            style={
              activeTab === tab
                ? {
                    background: "var(--rm-purple-dim)",
                    color: "var(--rm-text-primary)",
                    border: "1px solid var(--rm-purple-border)",
                  }
                : {
                    color: "var(--rm-text-muted)",
                    border: "1px solid transparent",
                  }
            }
          >
            {tab === "Files" && <Layers size={11} />}
            {tab === "Team" && <Users size={11} />}
            {tab}
            {tab === "Files" && isMember && (
              <span
                className="text-[8px] px-1 py-0.5 rounded"
                style={{
                  background: "var(--rm-purple)",
                  color: "#fff",
                  fontFamily: "var(--rm-font-mono)",
                }}
              >
                up
              </span>
            )}
          </button>
        ))}
      </div>

      {/* SCROLLABLE BODY */}
      <div className="flex-1 overflow-y-auto">
        {/* ── OVERVIEW ── */}
        {activeTab === "Overview" && (
          <div className="px-4 pb-4 space-y-4">
            {/* Description */}
            <div
              className="rounded-xl p-4"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <p className="text-xs font-medium text-white mb-2">About</p>
              <p
                className="text-xs leading-relaxed"
                style={{ color: "#9CA3AF" }}
              >
                {project.description || "No description yet."}
              </p>
              {project.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {project.tags.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded-full text-[10px]"
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        color: "var(--rm-text-muted)",
                        fontFamily: "var(--rm-font-mono)",
                      }}
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Info grid */}
            <div
              className="rounded-xl p-4 space-y-2.5"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <p className="text-xs font-medium text-white mb-2">
                Project Info
              </p>
              {[
                {
                  icon: <Music2 size={12} color="#C084FC" />,
                  label: project.genre || "—",
                },
                ...(project.bpm
                  ? [
                      {
                        icon: <Gauge size={12} color="#60A5FA" />,
                        label: `${project.bpm} BPM`,
                      },
                    ]
                  : []),
                ...(project.musicalKey
                  ? [
                      {
                        icon: <Hash size={12} color="#FBBF24" />,
                        label: project.musicalKey,
                      },
                    ]
                  : []),
                {
                  icon: <Clock size={12} color="#60A5FA" />,
                  label: project.status,
                },
                {
                  icon: <Calendar size={12} color="#F472B6" />,
                  label: new Date(project.createdAt).toLocaleDateString(),
                },
              ].map((row, i) => (
                <div key={i} className="flex items-center gap-2">
                  {row.icon}
                  <span className="text-xs" style={{ color: "#9CA3AF" }}>
                    {row.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Open Roles */}
            {project.neededRoles?.length > 0 && (
              <div
                className="rounded-xl p-4"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <p className="text-xs font-medium text-white mb-2">
                  Open Roles
                </p>
                <div className="space-y-1.5">
                  {project.neededRoles.map((role) => (
                    <div key={role} className="flex items-center gap-2">
                      <Plus size={11} color="#C084FC" />
                      <span className="text-xs" style={{ color: "#D1D5DB" }}>
                        {role}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── STEMS ── */}
        {activeTab === "Files" && (
          <div className="px-4 pb-4">
            <ProjectFiles project={project} canUpload={isMember} compact />
          </div>
        )}

        {/* ── TEAM ── */}
        {activeTab === "Team" && (
          <div className="px-4 pb-4 space-y-2">
            {/* Owner */}
            <div
              className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all"
              style={{
                background: "rgba(16,185,129,0.05)",
                border: "1px solid rgba(16,185,129,0.15)",
              }}
              onClick={() => navigate(`/profile/${project.owner?.username}`)}
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor = "rgba(16,185,129,0.4)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor = "rgba(16,185,129,0.15)")
              }
            >
              <img
                src={
                  project.owner?.avatar ||
                  `https://ui-avatars.com/api/?name=${project.owner?.username}&background=7c3aed&color=fff`
                }
                alt=""
                className="w-9 h-9 rounded-xl object-cover flex-shrink-0"
                style={{ border: "1.5px solid rgba(16,185,129,0.4)" }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-white truncate">
                  {project.owner?.username}
                </p>
                <p
                  className="text-[10px]"
                  style={{
                    color: "#34D399",
                    fontFamily: "var(--rm-font-mono)",
                  }}
                >
                  owner
                </p>
              </div>
            </div>

            {project.collaborators?.length === 0 && (
              <p
                className="text-xs py-4 text-center"
                style={{ color: "var(--rm-text-muted)" }}
              >
                No collaborators yet.
              </p>
            )}

            {project.collaborators?.map((member) => (
              <div
                key={member._id}
                className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
                onClick={() => navigate(`/profile/${member.username}`)}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderColor = "rgba(124,58,237,0.35)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)")
                }
              >
                <img
                  src={
                    member.avatar ||
                    `https://ui-avatars.com/api/?name=${member.username}&background=7c3aed&color=fff`
                  }
                  alt=""
                  className="w-9 h-9 rounded-xl object-cover flex-shrink-0"
                  style={{ border: "1.5px solid var(--rm-purple-border)" }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-white truncate">
                    {member.username}
                  </p>
                  <p
                    className="text-[10px] truncate"
                    style={{
                      color: "var(--rm-text-muted)",
                      fontFamily: "var(--rm-font-mono)",
                    }}
                  >
                    {member.role || "collaborator"}
                  </p>
                </div>
                {isOwner && (
                  <button
                    onClick={async (e) => {
                      e.stopPropagation();
                      const ok = await confirm({
                        title: `Remove ${member.username}?`,
                        message:
                          "They'll lose access to this project's files and chat.",
                        confirmText: "Remove",
                        tone: "danger",
                      });
                      if (!ok) return;
                      try {
                        const { removeCollaborator } =
                          await import("../../api/projects");
                        await removeCollaborator(project._id, member._id);
                        toast.success(
                          `${member.username} removed from project`,
                        );
                        loadProject();
                      } catch (err) {
                        toast.error(err.message || "Failed to remove member");
                      }
                    }}
                    className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 transition-all"
                    style={{
                      color: "#6B7280",
                      background: "rgba(255,255,255,0.04)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(239,68,68,0.12)";
                      e.currentTarget.style.color = "#F87171";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background =
                        "rgba(255,255,255,0.04)";
                      e.currentTarget.style.color = "#6B7280";
                    }}
                  >
                    <X size={11} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {editOpen && (
        <EditModal
          project={project}
          onClose={() => setEditOpen(false)}
          onSaved={(updated) => setProject(updated)}
        />
      )}
    </div>
  );
}
