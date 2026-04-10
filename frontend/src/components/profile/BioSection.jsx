import React from "react";
import { Music, Mic, Clock, Sparkles } from "lucide-react";

const BioSection = ({
  bio,
  genre,
  instruments = [],
  age,
  pastProjects = [],
}) => {
  return (
    <div className="relative bg-[#111118] rounded-2xl p-6 border border-gray-800 mb-6 transition-all duration-300 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10">
      {/* Glow Accent */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-600/5 via-transparent to-pink-500/5 pointer-events-none" />

      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-purple-400" />
        <h2 className="text-xl font-semibold text-white">About</h2>
      </div>

      {/* Bio */}
      <p className="text-gray-300 text-sm leading-relaxed mb-6">{bio}</p>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        {/* Genre */}
        <div className="group bg-[#1a1a24] rounded-xl p-4 border border-gray-700 transition-all duration-300 hover:border-purple-500/40 hover:bg-[#1f1f2e]">
          <div className="flex items-center gap-2 mb-2 text-gray-400">
            <Music size={16} />
            <span>Genre</span>
          </div>
          <p className="text-white font-medium">{genre}</p>
        </div>

        {/* Age */}
        <div className="group bg-[#1a1a24] rounded-xl p-4 border border-gray-700 transition-all duration-300 hover:border-purple-500/40 hover:bg-[#1f1f2e]">
          <div className="flex items-center gap-2 mb-2 text-gray-400">
            <Clock size={16} />
            <span>Age</span>
          </div>
          <p className="text-white font-medium">{age} yrs</p>
        </div>

        {/* Instruments */}
        <div className="col-span-2 bg-[#1a1a24] rounded-xl p-4 border border-gray-700 transition-all duration-300 hover:border-purple-500/40 hover:bg-[#1f1f2e]">
          <div className="flex items-center gap-2 mb-3 text-gray-400">
            <Mic size={16} />
            <span>Instruments</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {instruments.map((inst, index) => (
              <span
                key={index}
                className="px-3 py-1 rounded-full bg-gradient-to-r from-purple-600/20 to-pink-500/20 text-purple-300 text-xs font-medium border border-purple-500/30 transition-all duration-300 hover:scale-105 hover:border-purple-400 hover:shadow-md hover:shadow-purple-500/20"
              >
                {inst}
              </span>
            ))}
          </div>
        </div>

        {/* Projects */}
        <div className="col-span-2 bg-[#1a1a24] rounded-xl p-4 border border-gray-700 transition-all duration-300 hover:border-purple-500/40 hover:bg-[#1f1f2e]">
          <div className="flex items-center gap-2 mb-2 text-gray-400">
            <Sparkles size={16} />
            <span>Collaborations</span>
          </div>

          <p className="text-white text-sm">
            {pastProjects.length > 0
              ? pastProjects.join(" • ")
              : "No collaborations yet"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BioSection;
