import { Calendar, Users } from "lucide-react";

const ProjectCard = ({ title, description, collaborators, date, genre }) => {
  return (
    <div className="bg-slate-900/30 rounded-xl p-5 border border-slate-800 hover:border-purple-500/40 hover:bg-slate-900/50 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300 group">
      {/* Top Section */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
            {title}
          </h3>

          {genre && (
            <p className="text-xs text-purple-400 mt-1 font-medium">{genre}</p>
          )}
        </div>

        <span className="text-xs text-slate-500 flex items-center gap-1 whitespace-nowrap ml-2 flex-shrink-0">
          <Calendar size={12} />
          {date}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-slate-300 mb-4 leading-relaxed">
        {description}
      </p>

      {/* Collaborators */}
      <div className="flex items-center gap-2 text-sm">
        <Users size={14} className="text-purple-400" />

        <div className="flex flex-wrap gap-1">
          {collaborators.map((collab, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 bg-slate-800 rounded-full text-xs text-slate-300"
            >
              {collab}
              {idx < collaborators.length - 1 && ","}
            </span>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-slate-800/50 text-xs text-slate-400 group-hover:text-purple-400 transition-colors cursor-pointer">
        View Details →
      </div>
    </div>
  );
};

export default ProjectCard;
