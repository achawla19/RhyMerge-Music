import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Music2,
  Calendar,
  Clock,
  Plus,
  CheckCircle2,
  Bookmark,
  Layers,
  Pencil,
  Trash2,
  Loader2,
  Hash,
  Gauge,
  Users,
  X,
} from "lucide-react";

import AIInsightsPanel from "../components/ui/AIInsightsPanel";

import { getProjectById, updateProject, deleteProject } from "../api/projects";
import { toggleSavedProject, getSavedProjects } from "../api/savedProjects";
import {
  createProjectRequest,
  getProjectRequests,
  getMyProjectRequest,
} from "../api/projectRequests";

import JoinProjectModal from "../components/projects/JoinProjectModal";
import ProjectRequests from "../components/projects/ProjectRequests";
import ProjectFiles from "../components/projects/ProjectFiles";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/ui/Toast";
import { useConfirm } from "../components/ui/ConfirmDialog";
import Select from "../components/ui/Select";

const STATUS_OPTS = [
  "Planning",
  "Recording",
  "Production",
  "Mixing",
  "Completed",
];

const statusStyle = {
  Planning: {
    bg: "rgba(245,158,11,0.1)",
    border: "rgba(245,158,11,0.3)",
    color: "#FBBF24",
  },
  Recording: {
    bg: "rgba(249,87,111,0.12)",
    border: "var(--rm-purple-border)",
    color: "var(--rm-purple-light)",
  },
  Production: {
    bg: "rgba(249,87,111,0.12)",
    border: "var(--rm-purple-border)",
    color: "var(--rm-purple-light)",
  },
  Mixing: {
    bg: "rgba(96,165,250,0.1)",
    border: "rgba(96,165,250,0.3)",
    color: "#60A5FA",
  },
  Completed: {
    bg: "rgba(16,185,129,0.1)",
    border: "rgba(16,185,129,0.3)",
    color: "#34D399",
  },
};

const TABS = ["Overview", "Stems", "Team"];

// ── Edit Modal ─────────────────────────────────────────────────────────────────
const EditProjectModal = ({ project, onClose, onSaved }) => {
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
    if (r && !form.neededRoles.includes(r)) {
      setForm((f) => ({ ...f, neededRoles: [...f.neededRoles, r] }));
    }
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
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
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white font-bold text-xl">Edit Project</h2>
          <button onClick={onClose} style={{ color: "var(--rm-text-muted)" }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label style={labelStyle}>title *</label>
            <input
              value={form.title}
              onChange={set("title")}
              style={inputStyle}
              maxLength={100}
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
              style={{ ...inputStyle, resize: "none" }}
            />
          </div>

          {/* Genre + Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label style={labelStyle}>genre</label>
              <input
                value={form.genre}
                onChange={set("genre")}
                style={inputStyle}
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
              <label style={labelStyle}>bpm</label>
              <input
                value={form.bpm}
                onChange={set("bpm")}
                type="number"
                min={40}
                max={300}
                placeholder="e.g. 128"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>key</label>
              <input
                value={form.musicalKey}
                onChange={set("musicalKey")}
                placeholder="e.g. A minor"
                style={inputStyle}
              />
            </div>
          </div>

          {/* Open Roles */}
          <div>
            <label style={labelStyle}>open roles</label>
            <div className="flex gap-2 mb-2">
              <input
                value={roleInput}
                onChange={(e) => setRoleInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addRole())
                }
                placeholder="e.g. Vocalist, Mix Engineer"
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
                }}
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.neededRoles.map((r) => (
                <span
                  key={r}
                  className="flex items-center gap-1 px-3 py-1 rounded-full text-xs"
                  style={{
                    background: "var(--rm-purple-dim)",
                    border: "1px solid var(--rm-purple-border)",
                    color: "var(--rm-purple-light)",
                  }}
                >
                  {r}
                  <button type="button" onClick={() => removeRole(r)}>
                    <X size={11} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Toggles */}
          <div className="flex gap-6">
            {[
              { key: "lookingForCollaborators", label: "Looking for collabs" },
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

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl font-medium text-white disabled:opacity-50 flex items-center gap-2"
              style={{ background: "var(--rm-purple)" }}
            >
              {loading && <Loader2 size={14} className="animate-spin" />}
              {loading ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl font-medium"
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

// ── Main Page ──────────────────────────────────────────────────────────────────
const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const toast = useToast();
  const confirm = useConfirm();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [savingToggle, setSavingToggle] = useState(false);
  const [activeTab, setActiveTab] = useState("Overview");
  const [joinOpen, setJoinOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [requests, setRequests] = useState([]);
  const [hasPending, setHasPending] = useState(false);
  const [bannerVisible, setBannerVisible] = useState(
    location.state?.showJoinedBanner || false,
  );

  const loadProject = async () => {
    try {
      const data = await getProjectById(id);
      setProject(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProject();
  }, [id]);

  useEffect(() => {
    (async () => {
      try {
        const savedList = await getSavedProjects();
        setSaved(savedList.some((p) => p._id === id));
      } catch {}
    })();
  }, [id]);

  useEffect(() => {
    if (!bannerVisible) return;
    const t = setTimeout(() => setBannerVisible(false), 5000);
    return () => clearTimeout(t);
  }, [bannerVisible]);

  const isOwner = project?.owner?._id?.toString() === user?._id?.toString();
  const alreadyCollab = project?.collaborators?.some(
    (c) => c._id?.toString() === user?._id?.toString(),
  );
  const isMember = isOwner || alreadyCollab;

  const refreshRequests = async () => {
    if (!project) return;
    const data = await getProjectRequests(project._id);
    setRequests(data);
    await loadProject();
  };

  useEffect(() => {
    if (!project || !isOwner) return;
    getProjectRequests(project._id).then(setRequests).catch(console.error);
  }, [project?._id, isOwner]);

  useEffect(() => {
    if (!project || !user) return;
    getMyProjectRequest(project._id)
      .then((d) => setHasPending(d.exists))
      .catch(console.error);
  }, [project?._id, user]);

  const handleToggleSave = async () => {
    setSavingToggle(true);
    try {
      const result = await toggleSavedProject(project._id);
      setSaved(result.saved);
    } catch (err) {
      console.error(err);
    } finally {
      setSavingToggle(false);
    }
  };

  const handleJoinSubmit = async ({ role, message }) => {
    await createProjectRequest({ projectId: project._id, role, message });
    setHasPending(true);
    setBannerVisible(true);
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
      await deleteProject(project._id);
      toast.success("Project deleted");
      navigate("/projects", { replace: true });
    } catch (err) {
      toast.error(err.message || "Failed to delete project");
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-40">
        <span
          style={{
            fontFamily: "var(--rm-font-mono)",
            color: "var(--rm-purple-light)",
          }}
        >
          loading project...
        </span>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center py-40">
        <span style={{ fontFamily: "var(--rm-font-mono)", color: "#F87171" }}>
          project not found
        </span>
      </div>
    );
  }

  const s = statusStyle[project.status] || statusStyle.Planning;

  return (
    <>
      {bannerVisible && (
        <div
          className="rounded-2xl p-4 mb-6 flex items-center gap-3"
          style={{
            background: "rgba(16,185,129,0.1)",
            border: "1px solid rgba(16,185,129,0.3)",
          }}
        >
          <CheckCircle2 size={18} color="#34D399" className="flex-shrink-0" />
          <p className="text-sm font-medium" style={{ color: "#34D399" }}>
            {hasPending && !alreadyCollab
              ? "Request sent — the owner will review it."
              : "You're now a collaborator on this project."}
          </p>
        </div>
      )}

      <div className="max-w-6xl mx-auto space-y-6">
        {/* HERO */}
        <div
          className="relative overflow-hidden rounded-3xl p-8 lg:p-10"
          style={{
            background: project.coverImage
              ? `linear-gradient(to bottom, rgba(0,0,0,0.55), rgba(11,8,20,0.97)), url(${project.coverImage}) center/cover`
              : "linear-gradient(135deg, rgba(249,87,111,0.12), var(--rm-bg-card))",
            border: "1px solid var(--rm-border)",
          }}
        >
          {/* Tags row */}
          <div className="flex flex-wrap gap-3 mb-5">
            {project.genre && (
              <span
                className="px-3 py-1 rounded-full text-sm"
                style={{
                  background: "var(--rm-purple-dim)",
                  border: "1px solid var(--rm-purple-border)",
                  color: "var(--rm-purple-light)",
                }}
              >
                {project.genre}
              </span>
            )}
            <span
              className="px-3 py-1 rounded-full text-sm"
              style={{
                background: s.bg,
                border: `1px solid ${s.border}`,
                color: s.color,
              }}
            >
              {project.status}
            </span>
            {project.bpm && (
              <span
                className="px-3 py-1 rounded-full text-sm flex items-center gap-1"
                style={{
                  background: "rgba(96,165,250,0.1)",
                  border: "1px solid rgba(96,165,250,0.3)",
                  color: "#60A5FA",
                }}
              >
                <Gauge size={12} />
                {project.bpm} BPM
              </span>
            )}
            {project.musicalKey && (
              <span
                className="px-3 py-1 rounded-full text-sm flex items-center gap-1"
                style={{
                  background: "rgba(251,191,36,0.1)",
                  border: "1px solid rgba(251,191,36,0.3)",
                  color: "#FBBF24",
                }}
              >
                <Hash size={12} />
                {project.musicalKey}
              </span>
            )}
            {project.lookingForCollaborators && (
              <span
                className="px-3 py-1 rounded-full text-sm"
                style={{
                  background: "rgba(16,185,129,0.1)",
                  border: "1px solid rgba(16,185,129,0.3)",
                  color: "#34D399",
                }}
              >
                Open Collab
              </span>
            )}
          </div>

          <h1 className="text-4xl font-bold text-white">{project.title}</h1>
          <p
            className="mt-4 max-w-3xl leading-relaxed"
            style={{ color: "#9CA3AF" }}
          >
            {project.description || "No project description provided yet."}
          </p>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 mt-8">
            {isOwner ? (
              <>
                <button
                  onClick={() => setEditOpen(true)}
                  className="px-5 py-3 rounded-2xl text-sm font-medium flex items-center gap-2 transition-all"
                  style={{
                    background: "var(--rm-purple-dim)",
                    border: "1px solid var(--rm-purple-border)",
                    color: "var(--rm-purple-light)",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "rgba(249,87,111,0.2)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "var(--rm-purple-dim)")
                  }
                >
                  <Pencil size={14} /> Edit Project
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="px-5 py-3 rounded-2xl text-sm font-medium flex items-center gap-2 transition-all disabled:opacity-50"
                  style={{
                    background: "rgba(248,113,113,0.08)",
                    border: "1px solid rgba(248,113,113,0.25)",
                    color: "#F87171",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background =
                      "rgba(248,113,113,0.16)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background =
                      "rgba(248,113,113,0.08)")
                  }
                >
                  {deleting ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Trash2 size={14} />
                  )}
                  {deleting ? "Deleting..." : "Delete"}
                </button>
              </>
            ) : alreadyCollab ? (
              <span
                className="px-4 py-3 rounded-2xl text-sm font-medium"
                style={{ background: "rgba(96,165,250,0.1)", color: "#60A5FA" }}
              >
                Team Member
              </span>
            ) : hasPending ? (
              <span
                className="px-4 py-3 rounded-2xl text-sm font-medium"
                style={{ background: "rgba(245,158,11,0.1)", color: "#FBBF24" }}
              >
                Request Sent
              </span>
            ) : (
              <button
                onClick={() => setJoinOpen(true)}
                className="px-5 py-3 rounded-2xl text-white font-medium transition-all"
                style={{ background: "var(--rm-purple)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#D63850")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "var(--rm-purple)")
                }
              >
                Join Project
              </button>
            )}

            <button
              onClick={handleToggleSave}
              disabled={savingToggle}
              className="px-5 py-3 rounded-2xl text-sm font-medium flex items-center gap-2 transition-all disabled:opacity-50"
              style={
                saved
                  ? {
                      background: "var(--rm-purple-dim)",
                      border: "1px solid var(--rm-purple-border)",
                      color: "var(--rm-purple-light)",
                    }
                  : {
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      color: "var(--rm-text-secondary)",
                    }
              }
            >
              <Bookmark size={15} fill={saved ? "currentColor" : "none"} />
              {savingToggle ? "..." : saved ? "Saved" : "Save"}
            </button>
          </div>
        </div>

        {isOwner && requests.length > 0 && (
          <ProjectRequests requests={requests} refresh={refreshRequests} />
        )}

        {/* TABS */}
        <div
          className="flex gap-1 p-1 rounded-2xl"
          style={{
            background: "var(--rm-bg-card)",
            border: "1px solid var(--rm-border)",
            width: "fit-content",
          }}
        >
          {TABS.map((tab) => {
            const active = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-sm font-medium transition-all"
                style={
                  active
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
                {tab === "Stems" && <Layers size={13} />}
                {tab === "Team" && <Users size={13} />}
                {tab}
                {tab === "Stems" && isMember && (
                  <span
                    className="text-[9px] px-1.5 py-0.5 rounded-full ml-0.5"
                    style={{
                      background: "var(--rm-purple)",
                      color: "#fff",
                      fontFamily: "var(--rm-font-mono)",
                    }}
                  >
                    upload
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* OVERVIEW */}
        {activeTab === "Overview" && (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div
                className="rounded-2xl p-6"
                style={{
                  background: "var(--rm-bg-card)",
                  border: "1px solid var(--rm-border)",
                }}
              >
                <h2 className="text-white font-semibold text-lg mb-4">
                  About Project
                </h2>
                <p className="leading-relaxed" style={{ color: "#9CA3AF" }}>
                  {project.description || "No project description yet."}
                </p>
                {project.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {project.tags.map((t) => (
                      <span
                        key={t}
                        className="px-2.5 py-1 rounded-lg text-xs"
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
            </div>

            <div className="space-y-6">
              <div
                className="rounded-2xl p-6"
                style={{
                  background: "var(--rm-bg-card)",
                  border: "1px solid var(--rm-border)",
                }}
              >
                <h3 className="text-white font-semibold mb-4">Project Info</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Music2 size={15} color="#FF8B93" />
                    <span className="text-sm" style={{ color: "#9CA3AF" }}>
                      {project.genre || "—"}
                    </span>
                  </div>
                  {project.bpm && (
                    <div className="flex items-center gap-3">
                      <Gauge size={15} color="#60A5FA" />
                      <span className="text-sm" style={{ color: "#9CA3AF" }}>
                        {project.bpm} BPM
                      </span>
                    </div>
                  )}
                  {project.musicalKey && (
                    <div className="flex items-center gap-3">
                      <Hash size={15} color="#FBBF24" />
                      <span className="text-sm" style={{ color: "#9CA3AF" }}>
                        {project.musicalKey}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <Clock size={15} color="#60A5FA" />
                    <span className="text-sm" style={{ color: "#9CA3AF" }}>
                      {project.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar size={15} color="#F472B6" />
                    <span className="text-sm" style={{ color: "#9CA3AF" }}>
                      {new Date(project.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div
                className="rounded-2xl p-6"
                style={{
                  background: "var(--rm-bg-card)",
                  border: "1px solid var(--rm-border)",
                }}
              >
                <h3 className="text-white font-semibold mb-4">Open Roles</h3>
                {project.neededRoles?.length > 0 ? (
                  <div className="space-y-2">
                    {project.neededRoles.map((role) => (
                      <div
                        key={role}
                        className="flex items-center gap-2"
                        style={{ color: "#D1D5DB" }}
                      >
                        <Plus size={13} color="#FF8B93" />
                        <span className="text-sm">{role}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p
                    className="text-sm"
                    style={{ color: "var(--rm-text-muted)" }}
                  >
                    No open roles.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
        {isMember && <AIInsightsPanel projectId={project._id} />}

        {/* STEMS */}
        {activeTab === "Stems" && (
          <ProjectFiles project={project} canUpload={isMember} />
        )}

        {/* TEAM */}
        {activeTab === "Team" && (
          <div
            className="rounded-2xl p-6"
            style={{
              background: "var(--rm-bg-card)",
              border: "1px solid var(--rm-border)",
            }}
          >
            <h3 className="text-white font-semibold mb-5">Team</h3>
            <div className="space-y-3">
              {/* Owner */}
              <div
                className="flex items-center gap-3 p-3 rounded-xl"
                style={{
                  background: "rgba(16,185,129,0.05)",
                  border: "1px solid rgba(16,185,129,0.15)",
                }}
              >
                <img
                  src={
                    project.owner?.avatar ||
                    `https://ui-avatars.com/api/?name=${project.owner?.username}&background=F9576F&color=fff`
                  }
                  alt=""
                  onClick={() =>
                    navigate(`/profile/${project.owner?.username}`)
                  }
                  className="w-11 h-11 rounded-full cursor-pointer transition-transform hover:scale-105"
                  style={{ border: "1.5px solid var(--rm-purple-border)" }}
                />
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">
                    {project.owner?.username}
                  </p>
                  <p className="text-xs" style={{ color: "#34D399" }}>
                    Owner
                  </p>
                </div>
              </div>

              {project.collaborators?.length === 0 && (
                <p
                  className="text-sm py-4 text-center"
                  style={{ color: "var(--rm-text-muted)" }}
                >
                  No collaborators yet.
                </p>
              )}

              {project.collaborators?.map((member) => (
                <div
                  key={member._id}
                  className="flex items-center gap-3 p-3 rounded-xl"
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid var(--rm-border)",
                  }}
                >
                  <img
                    src={
                      member.avatar ||
                      `https://ui-avatars.com/api/?name=${member.username}&background=F9576F&color=fff`
                    }
                    alt=""
                    onClick={() => navigate(`/profile/${member.username}`)}
                    className="w-11 h-11 rounded-full cursor-pointer transition-transform hover:scale-105"
                    style={{ border: "1.5px solid var(--rm-purple-border)" }}
                  />
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium">
                      {member.username}
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: "var(--rm-text-muted)" }}
                    >
                      {member.role || "Collaborator"}
                    </p>
                  </div>
                  {isOwner && (
                    <button
                      onClick={async () => {
                        const ok = await confirm({
                          title: `Remove ${member.username} from this project?`,
                          message:
                            "They'll lose access to this project's files and chat.",
                          confirmText: "Remove",
                          tone: "danger",
                        });
                        if (!ok) return;
                        try {
                          const { removeCollaborator } =
                            await import("../api/projects");
                          await removeCollaborator(project._id, member._id);
                          toast.success(
                            `${member.username} removed from project`,
                          );
                          loadProject();
                        } catch (err) {
                          toast.error(err.message || "Failed to remove member");
                        }
                      }}
                      className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
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
                      <X size={13} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <JoinProjectModal
        isOpen={joinOpen}
        onClose={() => setJoinOpen(false)}
        project={project}
        onSubmit={handleJoinSubmit}
      />

      {editOpen && (
        <EditProjectModal
          project={project}
          onClose={() => setEditOpen(false)}
          onSaved={(updated) => setProject(updated)}
        />
      )}
    </>
  );
};

export default ProjectDetails;
