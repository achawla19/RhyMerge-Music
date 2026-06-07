import { Calendar, Users, ArrowRight } from "lucide-react";

const ProjectCard = ({
  title,
  description,
  collaborators = [],
  date,
  genre,
}) => {
  return (
    <div className="bg-[#111118] rounded-xl p-5 border border-gray-800 hover:border-purple-500/40 transition-all duration-300 group">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white group-hover:text-purple-300 transition-colors">
            {title}
          </h3>

          {genre && <p className="text-xs text-purple-400 mt-1">{genre}</p>}
        </div>

        {date && (
          <span className="text-xs text-gray-500 flex items-center gap-1">
            <Calendar size={12} />
            {date}
          </span>
        )}
      </div>

      <p className="text-sm text-gray-300 leading-relaxed mb-4">
        {description}
      </p>

      <div className="flex items-start gap-2 mb-4">
        <Users size={14} className="text-purple-400 mt-0.5" />

        <div className="flex flex-wrap gap-2">
          {collaborators.map((collab, index) => (
            <span
              key={index}
              className="px-2 py-1 rounded-full bg-slate-800 text-xs text-gray-300"
            >
              {collab}
            </span>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t border-gray-800">
        <button className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors">
          View Details
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default ProjectCard;
