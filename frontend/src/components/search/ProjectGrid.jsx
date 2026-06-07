const ProjectGrid = ({ projects }) => {
  if (!projects.length) {
    return (
      <div
        className="
          rounded-3xl
          border border-white/[0.06]
          bg-white/[0.03]
          p-16
          text-center
        "
      >
        <h3 className="text-xl font-semibold text-white">
          No projects found
        </h3>

        <p className="mt-2 text-slate-400">
          Try another search or filter.
        </p>
      </div>
    );
  }

  return (
    <div
      className="
        grid
        grid-cols-1
        md:grid-cols-2
        xl:grid-cols-3
        gap-4
      "
    >
      {projects.map((project) => (
        <div
          key={project._id}
          className="
            rounded-3xl
            border border-white/[0.06]
            bg-white/[0.03]
            backdrop-blur-xl

            p-5

            hover:border-purple-500/20
            hover:bg-white/[0.04]

            transition-all
          "
        >
          <div className="flex items-center justify-between">
            <span
              className="
                px-3 py-1
                rounded-full

                text-xs

                bg-purple-500/10
                text-purple-300
              "
            >
              {project.genre || "Music"}
            </span>

            <span className="text-xs text-slate-500">
              {project.status}
            </span>
          </div>

          <h3 className="mt-4 text-lg font-semibold text-white">
            {project.title}
          </h3>

          <p
            className="
              mt-2

              text-sm
              text-slate-400

              line-clamp-3
            "
          >
            {project.description ||
              "No description available."}
          </p>

          <div
            className="
              mt-5
              pt-4

              border-t
              border-white/[0.06]

              flex
              items-center
              gap-3
            "
          >
            <img
              src={
                project.owner?.avatar ||
                `https://ui-avatars.com/api/?name=${
                  project.owner?.username || "User"
                }`
              }
              alt=""
              className="
                w-9 h-9
                rounded-full
              "
            />

            <div>
              <p className="text-sm text-white">
                {project.owner?.username}
              </p>

              <p className="text-xs text-slate-500">
                Project Owner
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProjectGrid;