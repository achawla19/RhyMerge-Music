import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

import { Music2, Users, Calendar, Clock, Plus } from "lucide-react";

import { getProjectById } from "../api/projects";
import { toggleSavedProject } from "../api/savedProjects";

import JoinProjectModal from "../components/projects/JoinProjectModal";

import { createProjectRequest } from "../api/projectRequests";

import ProjectRequests from "../components/projects/ProjectRequests";

import {
  getProjectRequests,
  getMyProjectRequest,
} from "../api/projectRequests";

import { useAuth } from "../context/AuthContext";
import RequestCard from "../components/projects/RequestCard";

const statusStyles = {
  Planning: "bg-slate-500/15 text-slate-300 border-slate-500/20",

  Recording: "bg-blue-500/15 text-blue-300 border-blue-500/20",

  Production: "bg-purple-500/15 text-purple-300 border-purple-500/20",

  Mixing: "bg-orange-500/15 text-orange-300 border-orange-500/20",

  Completed: "bg-green-500/15 text-green-300 border-green-500/20",
};

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);

  const [loading, setLoading] = useState(true);

  const [saved, setSaved] = useState(false);

  const [joinOpen, setJoinOpen] = useState(false);

  const [requests, setRequests] = useState([]);

  const [hasPendingRequest, setHasPendingRequest] = useState(false);

  const location = useLocation();

  const [bannerVisible, setBannerVisible] = useState(
    location.state?.showJoinedBanner || false,
  );

  const { user } = useAuth();

  useEffect(() => {
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

    loadProject();
  }, [id]);

  useEffect(() => {
    if (!bannerVisible) return;

    const timer = setTimeout(() => {
      setBannerVisible(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, [bannerVisible]);

  const isOwner = project?.owner?._id?.toString() === user?._id?.toString();

  const alreadyCollaborator = project?.collaborators?.some(
    (c) => c._id?.toString() === user?._id?.toString(),
  );

  const refreshRequests = async () => {
    const data = await getProjectRequests(project._id);

    setRequests(data);
  };

  useEffect(() => {
    const loadRequests = async () => {
      if (!project) return;

      if (!isOwner) return;

      try {
        const data = await getProjectRequests(project._id);

        setRequests(data);
      } catch (err) {
        console.error(err);
      }
    };

    loadRequests();
  }, [project, isOwner]);

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
  }, [project, user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-40">
        <p className="text-slate-400">Loading project...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center py-40">
        <p className="text-slate-400">Project not found</p>
      </div>
    );
  }

  return (
    <>
      {bannerVisible && (
        <div
          className="
      rounded-3xl

      bg-green-500/10

      border border-green-500/20

      p-4

      text-green-400
      font-medium
    "
        >
          Your request was accepted. You are now a collaborator on this project.
        </div>
      )}
      <div className="max-w-6xl mx-auto space-y-6">
        {/* HERO */}
        <div
          className="
          relative
          overflow-hidden

          rounded-3xl

          border border-white/[0.08]

          bg-gradient-to-br
          from-purple-500/10
          via-[#12131D]
          to-[#12131D]

          p-8 lg:p-10
        "
        >
          <div className="relative z-10">
            <div className="flex flex-wrap gap-3 mb-5">
              <span
                className="
                px-3 py-1

                rounded-full

                bg-purple-500/15

                border border-purple-500/20

                text-purple-300
                text-sm
              "
              >
                {project.genre || "Music Project"}
              </span>

              <span
                className={`
                px-3 py-1

                rounded-full

                border

                text-sm

                ${statusStyles[project.status] || statusStyles.Planning}
              `}
              >
                {project.status}
              </span>
              {project.lookingForCollaborators && (
                <span
                  className="
      px-3 py-1

      rounded-full

      bg-purple-500/15

      border border-purple-500/20

      text-purple-300

      text-sm
    "
                >
                  Looking For Collaborators
                </span>
              )}
            </div>

            <h1 className="text-4xl font-bold text-white">{project.title}</h1>

            <p className="text-slate-400 mt-4 max-w-3xl leading-relaxed">
              {project.description || "No project description provided yet."}
            </p>

            <div className="flex flex-wrap gap-3 mt-8">
              {isOwner ? (
                <span
                  className="
      px-4 py-3
      rounded-2xl
      bg-green-500/10
      text-green-400
    "
                >
                  Project Owner
                </span>
              ) : alreadyCollaborator ? (
                <span
                  className="
      px-4 py-3
      rounded-2xl
      bg-blue-500/10
      text-blue-400
    "
                >
                  Team Member
                </span>
              ) : hasPendingRequest ? (
                <span
                  className="
      px-4 py-3
      rounded-2xl
      bg-yellow-500/10
      text-yellow-400
    "
                >
                  Request Sent
                </span>
              ) : (
                <button
                  onClick={() => setJoinOpen(true)}
                  className="
      px-5 py-3
      rounded-2xl
      bg-gradient-to-r
      from-purple-600
      to-pink-500
      text-white
    "
                >
                  Join Project
                </button>
              )}

              <button
                onClick={async () => {
                  const result = await toggleSavedProject(project._id);

                  setSaved(result.saved);
                }}
                className="
    px-5 py-3

    rounded-2xl

    border border-white/[0.08]

    bg-white/[0.04]

    text-slate-300
  "
              >
                {saved ? "Saved" : "Save"}
              </button>
            </div>
          </div>
        </div>
        {isOwner && requests.length > 0 && (
          <ProjectRequests requests={requests} refresh={refreshRequests} />
        )}

        {/* GRID */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">
            {/* ABOUT */}
            <div
              className="
              rounded-3xl

              bg-white/[0.04]

              border border-white/[0.08]

              p-6
            "
            >
              <h2 className="text-white font-semibold text-lg mb-4">
                About Project
              </h2>

              <p className="text-slate-400 leading-relaxed">
                {project.description || "No project description yet."}
              </p>
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="space-y-6">
            {/* PROJECT INFO */}
            <div
              className="
              rounded-3xl

              bg-white/[0.04]

              border border-white/[0.08]

              p-6
            "
            >
              <h3 className="text-white font-semibold mb-4">Project Info</h3>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Music2 size={16} className="text-purple-400" />

                  <span className="text-slate-400">{project.genre}</span>
                </div>

                <div className="flex items-center gap-3">
                  <Clock size={16} className="text-blue-400" />

                  <span className="text-slate-400">{project.status}</span>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar size={16} className="text-pink-400" />

                  <span className="text-slate-400">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* OPEN ROLES */}
            <div
              className="
    rounded-3xl

    bg-white/[0.04]

    border border-white/[0.08]

    p-6
  "
            >
              <h3 className="text-white font-semibold mb-4">Open Roles</h3>

              {project.neededRoles?.length > 0 ? (
                <div className="space-y-2">
                  {project.neededRoles.map((role) => (
                    <div
                      key={role}
                      className="
            flex
            items-center
            gap-2

            text-slate-300
          "
                    >
                      <Plus size={14} />
                      {role}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 text-sm">No roles requested.</p>
              )}
            </div>
          </div>
        </div>

        <div
          className="
    rounded-3xl

    bg-white/[0.04]

    border border-white/[0.08]

    p-6
  "
        >
          <h3 className="text-white font-semibold mb-4">Team</h3>

          <div className="space-y-3">
            {/* OWNER */}

            <div
              className="
        flex
        items-center
        gap-3
      "
            >
              <img
                src={
                  project.owner?.avatar ||
                  `https://ui-avatars.com/api/?name=${project.owner?.username}`
                }
                alt=""
                onClick={() => navigate(`/profile/${project.owner?.username}`)}
                className="
    w-10 h-10
    rounded-full

    cursor-pointer

    hover:scale-105

    transition-all
  "
              />

              <div>
                <p className="text-white">{project.owner?.username}</p>

                <p className="text-xs text-purple-400">Owner</p>
              </div>
            </div>

            {/* COLLABORATORS */}

            {project.collaborators?.map((member) => (
              <div
                key={member._id}
                className="
            flex
            items-center
            gap-3
          "
              >
                <img
                  src={
                    member.avatar ||
                    `https://ui-avatars.com/api/?name=${member.username}`
                  }
                  alt=""
                  onClick={() => navigate(`/profile/${member.username}`)}
                  className="
    w-10 h-10
    rounded-full

    cursor-pointer

    hover:scale-105

    transition-all
  "
                />

                <div>
                  <p className="text-white">{member.username}</p>

                  <p className="text-xs text-slate-400">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <JoinProjectModal
        isOpen={joinOpen}
        onClose={() => setJoinOpen(false)}
        project={project}
        onSubmit={async ({ role, message }) => {
          await createProjectRequest({
            projectId: project._id,
            role,
            message,
          });

          setHasPendingRequest(true);

          alert("Request sent!");
        }}
      />
    </>
  );
};

export default ProjectDetails;
