import { Music } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ProjectCard({ project }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/projects/${project._id}`)}
      className="
        cursor-pointer

        rounded-3xl

        bg-white/[0.04]
        border border-white/[0.08]

        p-5

        hover:border-purple-500/30
        hover:bg-white/[0.06]

        transition-all
      "
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex gap-3">
          <div
            className="
              w-11 h-11

              rounded-2xl

              bg-purple-500/15

              flex items-center justify-center
            "
          >
            <Music size={18} className="text-purple-400" />
          </div>

          <div>
            <h3 className="text-white font-semibold text-lg">
              {project.title}
            </h3>

            <p className="text-slate-500 text-sm">{project.genre || "Music"}</p>
          </div>
        </div>
      </div>

      <p
        className="
          text-slate-400
          text-sm

          line-clamp-3
          mb-5
        "
      >
        {project.description}
      </p>

      <div
        className="
          flex
          items-center
          justify-between
        "
      >
        <div className="flex gap-2 flex-wrap">
          <span
            className="
      px-3
      py-1

      rounded-full

      text-xs

      bg-green-500/10
      text-green-400
    "
          >
            {project.status}
          </span>

          {project.lookingForCollaborators ? (
            <span
              className="
        px-3
        py-1

        rounded-full

        text-xs

        bg-purple-500/10
        text-purple-300
      "
            >
              Looking For Members
            </span>
          ) : (
            <span
              className="
        px-3
        py-1

        rounded-full

        text-xs

        bg-slate-500/10
        text-slate-400
      "
            >
              Team Complete
            </span>
          )}
        </div>

        <span className="text-xs text-slate-500">
          {new Date(project.createdAt).toLocaleDateString()}
        </span>
        <div className="flex items-center gap-2 text-slate-500 text-xs">
          <span>{(project.collaborators?.length || 0) + 1} Members</span>
        </div>
      </div>
    </div>
  );
}
