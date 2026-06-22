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
} from "lucide-react";

import { getProjectById } from "../api/projects";
import { toggleSavedProject, getSavedProjects } from "../api/savedProjects";

import JoinProjectModal from "../components/projects/JoinProjectModal";
import {
  createProjectRequest,
  getProjectRequests,
  getMyProjectRequest,
} from "../api/projectRequests";
import ProjectRequests from "../components/projects/ProjectRequests";
import ProjectFiles from "../components/projects/ProjectFiles";

import { useAuth } from "../context/AuthContext";

const statusStyle = {
  Planning: {
    bg: "rgba(245,158,11,0.1)",
    border: "rgba(245,158,11,0.3)",
    color: "#FBBF24",
  },
  Recording: {
    bg: "rgba(124,58,237,0.12)",
    border: "var(--rm-purple-border)",
    color: "var(--rm-purple-light)",
  },
  Production: {
    bg: "rgba(124,58,237,0.12)",
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

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [savingToggle, setSavingToggle] = useState(false);
  const [activeTab, setActiveTab] = useState("Overview");
  const [joinOpen, setJoinOpen] = useState(false);
  const [requests, setRequests] = useState([]);
  const [hasPendingRequest, setHasPendingRequest] = useState(false);
  const [bannerVisible, setBannerVisible] = useState(
    location.state?.showJoinedBanner || false,
  );
  const [joinError, setJoinError] = useState("");

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    (async () => {
      try {
        const savedList = await getSavedProjects();
        setSaved(savedList.some((p) => p._id === id));
      } catch (err) {
        console.error(err);
      }
    })();
  }, [id]);

  useEffect(() => {
    if (!bannerVisible) return;
    const timer = setTimeout(() => setBannerVisible(false), 5000);
    return () => clearTimeout(timer);
  }, [bannerVisible]);

  const isOwner = project?.owner?._id?.toString() === user?._id?.toString();
  const alreadyCollaborator = project?.collaborators?.some(
    (c) => c._id?.toString() === user?._id?.toString(),
  );
  const isMember = isOwner || alreadyCollaborator;

  const refreshRequests = async () => {
    if (!project) return;
    const data = await getProjectRequests(project._id);
    setRequests(data);
    await loadProject();
  };

  useEffect(() => {
    const loadRequests = async () => {
      if (!project || !isOwner) return;
      try {
        const data = await getProjectRequests(project._id);
        setRequests(data);
      } catch (err) {
        console.error(err);
      }
    };
    loadRequests();
  }, [project?._id, isOwner]);

  useEffect(() => {
    const checkPendingRequest = async () => {
      if (!project || !user) return;
      try {
        const requestData = await getMyProjectRequest(project._id);
        setHasPendingRequest(requestData.exists);
      } catch (err) {
        console.error(err);
      }
    };
    checkPendingRequest();
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
    setJoinError("");
    try {
      await createProjectRequest({ projectId: project._id, role, message });
      setHasPendingRequest(true);
      setBannerVisible(true);
    } catch (err) {
      setJoinError(err.message || "Failed to send request");
      throw err;
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
            {hasPendingRequest && !alreadyCollaborator
              ? "Your request was sent — the project owner will review it."
              : "Your request was accepted. You are now a collaborator on this project."}
          </p>
        </div>
      )}

      <div className="max-w-6xl mx-auto space-y-6">
        {/* HERO */}
        <div
          className="relative overflow-hidden rounded-3xl p-8 lg:p-10"
          style={{
            background:
              "linear-gradient(135deg, rgba(124,58,237,0.12), var(--rm-bg-card))",
            border: "1px solid var(--rm-border)",
          }}
        >
          <div className="flex flex-wrap gap-3 mb-5">
            <span
              className="px-3 py-1 rounded-full text-sm"
              style={{
                background: "var(--rm-purple-dim)",
                border: "1px solid var(--rm-purple-border)",
                color: "var(--rm-purple-light)",
              }}
            >
              {project.genre || "Music Project"}
            </span>
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
            {project.lookingForCollaborators && (
              <span
                className="px-3 py-1 rounded-full text-sm"
                style={{
                  background: "var(--rm-purple-dim)",
                  border: "1px solid var(--rm-purple-border)",
                  color: "var(--rm-purple-light)",
                }}
              >
                Looking For Collaborators
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

          <div className="flex flex-wrap gap-3 mt-8">
            {isOwner ? (
              <span
                className="px-4 py-3 rounded-2xl text-sm font-medium"
                style={{ background: "rgba(16,185,129,0.1)", color: "#34D399" }}
              >
                Project Owner
              </span>
            ) : alreadyCollaborator ? (
              <span
                className="px-4 py-3 rounded-2xl text-sm font-medium"
                style={{ background: "rgba(96,165,250,0.1)", color: "#60A5FA" }}
              >
                Team Member
              </span>
            ) : hasPendingRequest ? (
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
                  (e.currentTarget.style.background = "#6D28D9")
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
              className="px-5 py-3 rounded-2xl text-sm font-medium transition-all disabled:opacity-50 flex items-center gap-2"
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

        {/* TAB CONTENT */}
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
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Music2 size={16} color="#C084FC" />
                    <span style={{ color: "#9CA3AF" }}>
                      {project.genre || "—"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock size={16} color="#60A5FA" />
                    <span style={{ color: "#9CA3AF" }}>{project.status}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar size={16} color="#F472B6" />
                    <span style={{ color: "#9CA3AF" }}>
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
                        <Plus size={14} color="#C084FC" />
                        {role}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p
                    className="text-sm"
                    style={{ color: "var(--rm-text-muted)" }}
                  >
                    No roles requested.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "Stems" && (
          <ProjectFiles project={project} canUpload={isMember} />
        )}

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
                    `https://ui-avatars.com/api/?name=${project.owner?.username}&background=7c3aed&color=fff`
                  }
                  alt=""
                  onClick={() =>
                    navigate(`/profile/${project.owner?.username}`)
                  }
                  className="w-11 h-11 rounded-full cursor-pointer transition-transform hover:scale-105"
                  style={{ border: "1.5px solid var(--rm-purple-border)" }}
                />
                <div>
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
                      `https://ui-avatars.com/api/?name=${member.username}&background=7c3aed&color=fff`
                    }
                    alt=""
                    onClick={() => navigate(`/profile/${member.username}`)}
                    className="w-11 h-11 rounded-full cursor-pointer transition-transform hover:scale-105"
                    style={{ border: "1.5px solid var(--rm-purple-border)" }}
                  />
                  <div>
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
    </>
  );
};

export default ProjectDetails;
