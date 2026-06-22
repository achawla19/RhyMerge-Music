import { MessageCircle, Music, MapPin, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProfileHeader = ({
  userId,
  username,
  name,
  role,
  location,
  avatar,
  connections = 0,
  projects = 0,
  isOwnProfile = false,
  onEditClick,
}) => {
  const navigate = useNavigate();

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: "var(--rm-bg-card)",
        border: "1px solid var(--rm-border)",
      }}
    >
      {/* Banner */}
      <div
        className="h-32 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(90deg, rgba(124,58,237,0.2), rgba(192,132,252,0.08), rgba(124,58,237,0.2))",
        }}
      >
        <div
          className="rm-waveform absolute bottom-3 left-1/2 -translate-x-1/2"
          style={{ opacity: 0.5 }}
        >
          {Array.from({ length: 32 }).map((_, i) => (
            <div
              key={i}
              className="rm-waveform-bar"
              style={{ height: `${4 + (i % 7) * 3}px` }}
            />
          ))}
        </div>
      </div>

      <div className="px-6 pb-6">
        <div className="flex flex-col md:flex-row md:items-end gap-5 -mt-12">
          <div
            className="w-24 h-24 rounded-full overflow-hidden flex-shrink-0"
            style={{
              border: "3px solid var(--rm-bg-card)",
              background: "var(--rm-bg)",
            }}
          >
            <img
              src={
                avatar ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(name || "User")}&background=7c3aed&color=fff`
              }
              alt={name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-white">
              {name || "Unknown User"}
            </h1>
            <p
              className="mt-0.5"
              style={{
                color: "var(--rm-purple-light)",
                fontFamily: "var(--rm-font-mono)",
                fontSize: 13,
              }}
            >
              {role || "Music Creator"}
            </p>
            {location && (
              <p
                className="flex items-center gap-1 text-sm mt-2"
                style={{ color: "var(--rm-text-muted)" }}
              >
                <MapPin size={13} />
                {location}
              </p>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-8 mt-6">
          <div>
            <p
              className="text-xl font-bold text-white"
              style={{ fontFamily: "var(--rm-font-mono)" }}
            >
              {connections}
            </p>
            <p className="text-xs" style={{ color: "var(--rm-text-muted)" }}>
              syncs
            </p>
          </div>
          <div>
            <p
              className="text-xl font-bold text-white"
              style={{ fontFamily: "var(--rm-font-mono)" }}
            >
              {projects}
            </p>
            <p className="text-xs" style={{ color: "var(--rm-text-muted)" }}>
              mixes
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 flex-wrap mt-6">
          {isOwnProfile ? (
            <button
              onClick={onEditClick}
              className="px-5 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2"
              style={{ background: "var(--rm-purple)", color: "#fff" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#6D28D9")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "var(--rm-purple)")
              }
            >
              <Pencil size={15} />
              Edit Profile
            </button>
          ) : (
            <>
              <button
                onClick={() =>
                  navigate("/messages", {
                    state: {
                      startChatWithUser: {
                        _id: userId,
                        username,
                        name,
                        avatar,
                        role,
                      },
                    },
                  })
                }
                className="px-5 py-2.5 rounded-xl text-sm transition-all flex items-center gap-2"
                style={{
                  border: "1px solid var(--rm-purple-border)",
                  color: "var(--rm-purple-light)",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "var(--rm-purple-dim)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                <MessageCircle size={15} />
                Message
              </button>

              <button
                onClick={() => navigate("/projects")}
                className="px-5 py-2.5 rounded-xl text-sm font-medium text-white transition-all flex items-center gap-2"
                style={{ background: "var(--rm-purple)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#6D28D9")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "var(--rm-purple)")
                }
              >
                <Music size={15} />
                Start a Mix
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
