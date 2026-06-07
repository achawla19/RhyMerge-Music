import { MessageCircle, Music, UserMinus, MapPin } from "lucide-react";

const ProfileHeader = ({
  name,
  role,
  location,
  avatar,
  connections = 0,
  projects = 0,
  isOwnProfile = false,
}) => {
  return (
    <div className="bg-[#111118] rounded-2xl border border-gray-800 overflow-hidden">
      {/* Banner */}
      <div className="h-36 bg-gradient-to-r from-purple-600/20 via-pink-500/10 to-purple-600/20" />

      <div className="px-6 pb-6">
        {/* Avatar + Info */}
        <div className="flex flex-col md:flex-row md:items-end gap-5 -mt-14">
          <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-[#111118] bg-slate-800">
            <img
              src={
                avatar ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  name || "User",
                )}&background=7c3aed&color=fff`
              }
              alt={name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white">
              {name || "Unknown User"}
            </h1>

            <p className="text-purple-300 font-medium mt-1">
              {role || "Music Creator"}
            </p>

            {location && (
              <p className="flex items-center gap-1 text-sm text-gray-400 mt-2">
                <MapPin size={14} />
                {location}
              </p>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-10 mt-6">
          <div>
            <p className="text-2xl font-bold text-white">{connections}</p>
            <p className="text-sm text-gray-400">Connections</p>
          </div>

          <div>
            <p className="text-2xl font-bold text-white">{projects}</p>
            <p className="text-sm text-gray-400">Projects</p>
          </div>
        </div>

        {/* Actions */}
        {!isOwnProfile && (
          <div className="flex gap-3 flex-wrap mt-6">
            <button className="px-5 py-2 rounded-lg border border-purple-500 text-purple-300 hover:bg-purple-500/10 transition-all flex items-center gap-2">
              <MessageCircle size={16} />
              Message
            </button>

            <button className="px-5 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:opacity-90 transition-all flex items-center gap-2">
              <Music size={16} />
              Start Project
            </button>

            <button className="px-5 py-2 rounded-lg border border-red-500/50 text-red-400 hover:bg-red-500/10 transition-all flex items-center gap-2">
              <UserMinus size={16} />
              Disconnect
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileHeader;
