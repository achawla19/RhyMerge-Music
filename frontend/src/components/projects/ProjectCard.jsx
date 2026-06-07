import { Music } from "lucide-react";

export default function ProjectCard({ project, onClick }) {
  return (
    <div
      onClick={onClick}
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
          Active
        </span>

        <span className="text-xs text-slate-500">
          {new Date(project.createdAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}
