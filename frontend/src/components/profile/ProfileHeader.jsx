import { MessageCircle, Music, UserMinus } from "lucide-react";

const ProfileHeader = ({
  name,
  role,
  location,
  avatar,
  connections,
  projects,
}) => {
  return (
    <div className="bg-gradient-to-b from-purple-950/20 via-slate-900/10 to-transparent p-6 border-b border-slate-800">
      {/* Top Section */}
      <div className="flex gap-6 mb-6">
        {/* Avatar */}
        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-purple-500/30 shadow-lg shadow-purple-500/10 flex-shrink-0">
          <img src={avatar} alt={name} className="w-full h-full object-cover" />
        </div>

        {/* Info */}
        <div className="flex-1 pt-2">
          <h1 className="text-3xl font-bold text-white mb-1 tracking-tight">
            {name}
          </h1>

          <p className="text-lg text-purple-300 font-medium mb-1">{role}</p>

          <p className="text-sm text-slate-400 flex items-center gap-1">
            📍 {location}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="flex gap-6 mb-6">
        <div>
          <p className="text-2xl font-bold text-white">{connections}</p>
          <p className="text-sm text-slate-400">Connections</p>
        </div>

        <div>
          <p className="text-2xl font-bold text-white">{projects}</p>
          <p className="text-sm text-slate-400">Projects Completed</p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 flex-wrap">
        <button className="px-6 py-2 rounded-lg border border-purple-500 text-purple-300 hover:bg-purple-500/10 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-200 font-medium flex items-center gap-2 text-sm">
          <MessageCircle size={16} />
          Message
        </button>

        <button className="px-6 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:from-purple-500 hover:to-pink-400 hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-200 font-medium flex items-center gap-2 text-sm">
          <Music size={16} />
          Start Project
        </button>

        <button className="px-6 py-2 rounded-lg border border-red-500/50 text-red-400 hover:bg-red-500/10 transition-all duration-200 font-medium text-sm flex items-center gap-2">
          <UserMinus size={16} />
          Disconnect
        </button>
      </div>
    </div>
  );
};

export default ProfileHeader;
