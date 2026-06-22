import { useState } from "react";
import { ArrowUpDown, FolderOpen } from "lucide-react";
import ProjectCard from "./ProjectCard";

const ProjectHistory = ({ projects = [] }) => {
  const [sortOrder, setSortOrder] = useState("newest");

  // FIX: was sorting by `project.date`, a field that doesn't exist on your
  // Project model — every comparison was NaN and the sort silently did
  // nothing. The real timestamp field is `createdAt`.
  const sortedProjects = [...projects].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
  });

  return (
    <div
      className="rounded-2xl p-6"
      style={{
        background: "var(--rm-bg-card)",
        border: "1px solid var(--rm-border)",
      }}
    >
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-semibold text-white">Project History</h2>
          <p className="text-sm mt-1" style={{ color: "var(--rm-text-muted)" }}>
            mixes this creator has worked on
          </p>
        </div>

        <button
          onClick={() =>
            setSortOrder(sortOrder === "newest" ? "oldest" : "newest")
          }
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all"
          style={{
            border: "1px solid var(--rm-purple-border)",
            color: "var(--rm-text-secondary)",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.borderColor = "var(--rm-purple)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.borderColor = "var(--rm-purple-border)")
          }
        >
          <ArrowUpDown size={14} />
          {sortOrder === "newest" ? "Newest" : "Oldest"}
        </button>
      </div>

      {sortedProjects.length === 0 ? (
        <div className="py-16 text-center">
          <FolderOpen size={36} color="#6B7280" className="mx-auto mb-3" />
          <h3 className="text-white font-medium mb-1">No mixes yet</h3>
          <p className="text-sm" style={{ color: "var(--rm-text-muted)" }}>
            this creator hasn't started any mixes
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {sortedProjects.map((project) => (
            <ProjectCard key={project._id} {...project} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectHistory;
