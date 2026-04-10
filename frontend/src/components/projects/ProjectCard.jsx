import Avatar from "../Avatar";
import { Music } from "lucide-react";

const ProjectCard = ({ project, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-[#111118] border border-gray-800 rounded-xl p-5 hover:border-purple-500 hover:shadow-lg hover:shadow-purple-500/10 transition cursor-pointer"
    >
      {/* TITLE */}
      <div className="flex items-center gap-2 mb-2">
        <Music size={18} className="text-purple-400" />
        <h3 className="font-semibold text-white">{project.title}</h3>
      </div>

      {/* DESC */}
      <p className="text-sm text-gray-400 mb-3 line-clamp-2">
        {project.description}
      </p>

      {/* META */}
      <div className="flex justify-between text-xs text-gray-400 mb-3">
        <span>{project.genre}</span>
        <span>{project.date}</span>
      </div>

      {/* COLLABS */}
      <div className="flex gap-2">
        {project.collaborators.slice(0, 3).map((c, i) => (
          <Avatar key={i} src={c.avatar} alt={c.name} size="sm" />
        ))}
      </div>
    </div>
  );
};

export default ProjectCard;
