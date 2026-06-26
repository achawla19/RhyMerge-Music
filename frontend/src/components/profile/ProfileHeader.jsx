import { useState, useRef } from "react";
import {
  MessageCircle,
  Music,
  MapPin,
  Pencil,
  Camera,
  UserMinus,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { uploadAvatar, unsyncConnection } from "../../api/user";
import { useAuth } from "../../context/AuthContext";

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
  isConnected = false,
  onEditClick,
  onAvatarUpdated,
  onUnsynced,
}) => {
  const navigate = useNavigate();
  const { updateUser } = useAuth();
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [unsyncing, setUnsyncing] = useState(false);
  const [localAvatar, setLocalAvatar] = useState(avatar);

  const handleAvatarClick = () => {
    if (!isOwnProfile) return;
    fileRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;

    // Optimistic preview
    const preview = URL.createObjectURL(file);
    setLocalAvatar(preview);
    setUploading(true);

    try {
      const { avatar: newUrl } = await uploadAvatar(file);
      setLocalAvatar(newUrl);
      updateUser({ avatar: newUrl });
      onAvatarUpdated?.(newUrl);
    } catch (err) {
      setLocalAvatar(avatar); // revert on failure
      console.error("Avatar upload failed:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleUnsync = async () => {
    if (!window.confirm(`Unsync with ${username}?`)) return;
    setUnsyncing(true);
    try {
      await unsyncConnection(userId);
      onUnsynced?.();
    } catch (err) {
      console.error(err);
    } finally {
      setUnsyncing(false);
    }
  };

  const displayAvatar =
    localAvatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name || username)}&background=7c3aed&color=fff`;

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
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div
              className="w-24 h-24 rounded-full overflow-hidden"
              style={{
                border: "3px solid var(--rm-bg-card)",
                background: "var(--rm-bg)",
              }}
            >
              <img
                src={displayAvatar}
                alt={name}
                className="w-full h-full object-cover"
              />
              {uploading && (
                <div
                  className="absolute inset-0 rounded-full flex items-center justify-center"
                  style={{ background: "rgba(0,0,0,0.55)" }}
                >
                  <Loader2 size={18} className="animate-spin text-white" />
                </div>
              )}
            </div>
            {isOwnProfile && (
              <>
                <button
                  onClick={handleAvatarClick}
                  disabled={uploading}
                  className="absolute bottom-0 right-0 w-7 h-7 rounded-full flex items-center justify-center transition-all disabled:opacity-50"
                  style={{
                    background: "var(--rm-purple)",
                    border: "2px solid var(--rm-bg-card)",
                  }}
                  title="Change avatar"
                >
                  <Camera size={12} color="#fff" />
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-white">
              {name || "Unknown User"}
            </h1>
            <p
              style={{
                color: "var(--rm-purple-light)",
                fontFamily: "var(--rm-font-mono)",
                fontSize: 13,
              }}
              className="mt-0.5"
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
              className="px-5 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition-all"
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
                        avatar: displayAvatar,
                        role,
                      },
                    },
                  })
                }
                className="px-5 py-2.5 rounded-xl text-sm flex items-center gap-2 transition-all"
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
                className="px-5 py-2.5 rounded-xl text-sm font-medium text-white flex items-center gap-2 transition-all"
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

              {isConnected && (
                <button
                  onClick={handleUnsync}
                  disabled={unsyncing}
                  className="px-5 py-2.5 rounded-xl text-sm flex items-center gap-2 transition-all disabled:opacity-50"
                  style={{
                    background: "rgba(248,113,113,0.08)",
                    border: "1px solid rgba(248,113,113,0.2)",
                    color: "#F87171",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background =
                      "rgba(248,113,113,0.16)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background =
                      "rgba(248,113,113,0.08)")
                  }
                >
                  {unsyncing ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <UserMinus size={14} />
                  )}
                  {unsyncing ? "Unsyncing..." : "Unsync"}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
