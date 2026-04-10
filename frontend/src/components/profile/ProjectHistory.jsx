import { useState } from "react";
import { ArrowUpDown } from "lucide-react";
import ProjectCard from "./ProjectCard";

const ProjectHistory = ({ projects }) => {
  const [sortOrder, setSortOrder] = useState("newest");

  const sortedProjects = [...projects].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();

    return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
  });

  return (
    <div className="bg-slate-900/20 rounded-xl p-6 border border-slate-800/50 hover:border-slate-700/50 transition-all duration-200">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">Project History</h2>

        <button
          onClick={() =>
            setSortOrder(sortOrder === "newest" ? "oldest" : "newest")
          }
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 hover:border-purple-500/50 transition-all duration-200 text-xs font-medium"
        >
          <ArrowUpDown size={14} />
          {sortOrder === "newest" ? "Newest" : "Oldest"}
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid gap-4 transition-all duration-300">
        {sortedProjects.map((project) => (
          <ProjectCard key={project.id} {...project} />
        ))}
      </div>

      {/* Empty State */}
      {sortedProjects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-400 text-sm">No projects yet</p>
        </div>
      )}
    </div>
  );
};

export default ProjectHistory;
