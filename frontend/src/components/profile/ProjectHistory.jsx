import { useState } from "react";
import { ArrowUpDown, FolderOpen } from "lucide-react";
import ProjectCard from "./ProjectCard";

const ProjectHistory = ({ projects = [] }) => {
  const [sortOrder, setSortOrder] = useState("newest");

  const sortedProjects = [...projects].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();

    return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
  });

  return (
    <div className="bg-[#111118] rounded-2xl p-6 border border-gray-800">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-white">Project History</h2>

          <p className="text-sm text-gray-500 mt-1">
            Previous collaborations and music projects
          </p>
        </div>

        <button
          onClick={() =>
            setSortOrder(sortOrder === "newest" ? "oldest" : "newest")
          }
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-700 text-gray-300 hover:border-purple-500 hover:text-white transition-all text-sm"
        >
          <ArrowUpDown size={14} />
          {sortOrder === "newest" ? "Newest" : "Oldest"}
        </button>
      </div>

      {sortedProjects.length === 0 ? (
        <div className="py-16 text-center">
          <FolderOpen size={40} className="mx-auto text-gray-600 mb-3" />

          <h3 className="text-white font-medium mb-1">No Projects Yet</h3>

          <p className="text-gray-500 text-sm">
            This creator hasn't published any collaborations.
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
