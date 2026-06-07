import { Music, Mic, Sparkles } from "lucide-react";

const BioSection = ({ bio, genre, instruments = [], pastProjects = [] }) => {
  return (
    <div className="bg-[#111118] rounded-2xl p-6 border border-gray-800">
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <Sparkles className="w-5 h-5 text-purple-400" />
        <h2 className="text-xl font-semibold text-white">About</h2>
      </div>

      {/* Bio */}
      <p className="text-gray-300 text-sm leading-relaxed mb-6">
        {bio || "No bio available yet."}
      </p>

      {/* Genre */}
      <div className="mb-5">
        <div className="flex items-center gap-2 text-gray-400 mb-2">
          <Music size={16} />
          <span className="text-sm">Genres</span>
        </div>

        <p className="text-white">{genre || "Not specified"}</p>
      </div>

      {/* Instruments */}
      <div className="mb-5">
        <div className="flex items-center gap-2 text-gray-400 mb-3">
          <Mic size={16} />
          <span className="text-sm">Skills & Instruments</span>
        </div>

        {instruments.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {instruments.map((inst, index) => (
              <span
                key={index}
                className="px-3 py-1 rounded-full bg-purple-600/10 border border-purple-500/30 text-purple-300 text-xs"
              >
                {inst}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No instruments listed</p>
        )}
      </div>

      {/* Collaborations */}
      <div>
        <div className="flex items-center gap-2 text-gray-400 mb-3">
          <Sparkles size={16} />
          <span className="text-sm">Past Collaborations</span>
        </div>

        {pastProjects.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {pastProjects.map((project, index) => (
              <span
                key={index}
                className="px-3 py-1 rounded-full bg-slate-800 text-gray-300 text-xs"
              >
                {project}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No collaborations yet</p>
        )}
      </div>
    </div>
  );
};

export default BioSection;
