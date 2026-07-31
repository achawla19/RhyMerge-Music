import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Camera,
  MapPin,
  Share2,
  Check,
  ArrowUpDown,
  FolderOpen,
  Lock,
} from "lucide-react";

import AvailabilityBadge from "../components/profile/AvailabilityBadge";
import SocialLinks from "../components/profile/SocialLinks";
import ConnectButton from "../components/profile/ConnectButton";
import AboutTab from "../components/profile/AboutTab";
import AudioReelTab from "../components/profile/AudioReelTab";
import ProjectCard from "../components/projects/ProjectCard";
import EditProfileModal from "../components/profile/EditProfileModal";

import { useAuth } from "../context/AuthContext";
import { getUserByUsername } from "../api/profile";
import { getProjectsByUsername } from "../api/projects";
import { uploadAvatar } from "../api/user";

const TABS = ["About", "Projects", "Audio Reel"];

export default function Profile() {
  const { username } = useParams();
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();

  const [profileData, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("About");
  const [copied, setCopied] = useState(false);
  const [sortOrder, setSortOrder] = useState("newest");
  const [avatarUploading, setAvatarUploading] = useState(false);

  useEffect(() => {
    // Guards against the literal string "undefined"/"null" too — that
    // happens if a caller ever builds this route from `user?.username`
    // before `user` has loaded, which used to fire two doomed requests
    // (GET /api/users/undefined, GET /api/projects/user/undefined)
    // instead of failing loudly.
    if (!username || username === "undefined" || username === "null") {
      setError("No profile specified.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    Promise.all([getUserByUsername(username), getProjectsByUsername(username)])
      .then(([profileRes, projectsRes]) => {
        setProfile(profileRes.user);
        setProjects(
          Array.isArray(projectsRes) ? projectsRes : projectsRes.projects || [],
        );
      })
      .catch((err) => setError(err.message || "Failed to load profile"))
      .finally(() => setLoading(false));
  }, [username]);

  if (loading)
    return (
      <div className="flex items-center justify-center py-32">
        <span
          style={{
            fontFamily: "var(--rm-font-mono)",
            fontSize: 13,
            color: "var(--rm-purple-light)",
          }}
        >
          loading profile...
        </span>
      </div>
    );

  if (error || !profileData) {
    const isPrivate = error?.toLowerCase().includes("private");
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-3">
        {isPrivate && <Lock size={22} color="var(--rm-text-muted)" />}
        <span
          style={{
            fontFamily: "var(--rm-font-mono)",
            fontSize: 13,
            color: isPrivate ? "var(--rm-text-muted)" : "#F87171",
          }}
        >
          {error || "Profile not found"}
        </span>
      </div>
    );
  }

  const isOwnProfile = user?.username === profileData.username;
  const sortedProjects = [...projects].sort((a, b) => {
    const dA = new Date(a.createdAt).getTime();
    const dB = new Date(b.createdAt).getTime();
    return sortOrder === "newest" ? dB - dA : dA - dB;
  });

  const handleCopy = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Optimistic preview immediately
    const preview = URL.createObjectURL(file);
    setProfile((prev) => ({ ...prev, avatar: preview }));
    setAvatarUploading(true);
    try {
      const { avatar } = await uploadAvatar(file);
      setProfile((prev) => ({ ...prev, avatar }));
      updateUser({ avatar });
      URL.revokeObjectURL(preview);
    } catch (err) {
      console.error("Avatar upload failed:", err);
      // Revert on failure
      setProfile((prev) => ({ ...prev, avatar: profileData.avatar }));
    } finally {
      setAvatarUploading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* ── HEADER CARD ── */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: "var(--rm-bg-card)",
          border: "1px solid var(--rm-border)",
        }}
      >
        {/* Banner */}
        <div
          className="h-36 relative overflow-hidden"
          style={{
            background:
              "linear-gradient(90deg, rgba(249,87,111,0.25), rgba(192,132,252,0.1), rgba(249,87,111,0.25))",
          }}
        >
          <div
            className="rm-waveform absolute bottom-3 left-1/2 -translate-x-1/2"
            style={{ opacity: 0.4 }}
          >
            {Array.from({ length: 40 }).map((_, i) => (
              <div
                key={i}
                className="rm-waveform-bar"
                style={{ height: `${4 + (i % 9) * 2.5}px` }}
              />
            ))}
          </div>
        </div>

        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-14">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div
                className="w-28 h-28 rounded-2xl overflow-hidden"
                style={{
                  border: "3px solid var(--rm-bg-card)",
                  background: "var(--rm-bg)",
                }}
              >
                <img
                  src={
                    profileData.avatar ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(profileData.name || profileData.username)}&background=F9576F&color=fff`
                  }
                  alt={profileData.name}
                  className="w-full h-full object-cover"
                />
                {avatarUploading && (
                  <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ background: "rgba(0,0,0,0.5)", borderRadius: 12 }}
                  >
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>
              {/* Online dot */}
              <span
                className="absolute top-1 right-1 w-3 h-3 rounded-full border-2"
                style={{
                  background: "#34D399",
                  borderColor: "var(--rm-bg-card)",
                }}
              />
              {/* Camera button — own profile only */}
              {isOwnProfile && (
                <>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="avatar-upload"
                    onChange={handleAvatarChange}
                  />
                  <label
                    htmlFor="avatar-upload"
                    className="absolute bottom-1 right-1 w-7 h-7 rounded-full flex items-center justify-center cursor-pointer transition-all"
                    style={{
                      background: "var(--rm-purple)",
                      border: "2px solid var(--rm-bg-card)",
                    }}
                    title="Change avatar"
                  >
                    <Camera size={13} color="#fff" />
                  </label>
                </>
              )}
            </div>

            {/* Name + meta */}
            <div className="flex-1 min-w-0 pb-1">
              <div className="flex flex-wrap items-center gap-3 mb-1">
                <h1 className="text-2xl font-bold text-white">
                  {profileData.name || profileData.username}
                </h1>
                <AvailabilityBadge availability={profileData.availability} />
              </div>
              <p
                style={{
                  color: "var(--rm-purple-light)",
                  fontFamily: "var(--rm-font-mono)",
                  fontSize: 13,
                }}
              >
                {profileData.role || "Music Creator"}
              </p>
              {profileData.location && (
                <p
                  className="flex items-center gap-1 text-sm mt-1"
                  style={{ color: "var(--rm-text-muted)" }}
                >
                  <MapPin size={12} /> {profileData.location}
                </p>
              )}
              <SocialLinks socials={profileData.socials} />
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2 pb-1 flex-shrink-0">
              {isOwnProfile ? (
                <button
                  onClick={() => setEditOpen(true)}
                  className="px-5 py-2.5 rounded-xl text-sm font-medium text-white transition-all"
                  style={{ background: "var(--rm-purple)" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#D63850")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "var(--rm-purple)")
                  }
                >
                  Edit Profile
                </button>
              ) : (
                <>
                  <ConnectButton profileData={profileData} currentUser={user} />
                  <button
                    onClick={() =>
                      navigate("/messages", {
                        state: {
                          startChatWithUser: {
                            _id: profileData._id,
                            username: profileData.username,
                            name: profileData.name,
                            avatar: profileData.avatar,
                            role: profileData.role,
                          },
                        },
                      })
                    }
                    className="px-4 py-2.5 rounded-xl text-sm transition-all"
                    style={{
                      border: "1px solid var(--rm-purple-border)",
                      color: "var(--rm-purple-light)",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background =
                        "var(--rm-purple-dim)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    Message
                  </button>
                </>
              )}
              <button
                onClick={handleCopy}
                className="px-4 py-2.5 rounded-xl text-sm flex items-center gap-1.5 transition-all"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: copied ? "#34D399" : "var(--rm-text-muted)",
                }}
              >
                {copied ? <Check size={14} /> : <Share2 size={14} />}
                {copied ? "Copied!" : "Share"}
              </button>
            </div>
          </div>

          {/* Stats */}
          <div
            className="flex gap-8 mt-5 pt-5"
            style={{ borderTop: "1px solid var(--rm-border)" }}
          >
            {[
              { label: "syncs", val: profileData.connectionsCount || 0 },
              { label: "projects", val: projects.length },
              { label: "experience", val: profileData.experienceLevel || "—" },
            ].map(({ label, val }) => (
              <div key={label}>
                <p
                  className="text-lg font-bold text-white"
                  style={{ fontFamily: "var(--rm-font-mono)" }}
                >
                  {val}
                </p>
                <p
                  className="text-xs"
                  style={{ color: "var(--rm-text-muted)" }}
                >
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── TABS ── */}
      <div
        className="flex gap-1 p-1 rounded-2xl w-fit"
        style={{
          background: "var(--rm-bg-card)",
          border: "1px solid var(--rm-border)",
        }}
      >
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="px-5 py-2 rounded-xl text-sm font-medium transition-all"
            style={
              activeTab === tab
                ? {
                    background: "var(--rm-purple-dim)",
                    color: "var(--rm-text-primary)",
                    border: "1px solid var(--rm-purple-border)",
                  }
                : {
                    color: "var(--rm-text-muted)",
                    border: "1px solid transparent",
                  }
            }
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ── TAB CONTENT ── */}
      {activeTab === "About" && <AboutTab profileData={profileData} />}

      {activeTab === "Projects" && (
        <div
          className="rounded-2xl p-6"
          style={{
            background: "var(--rm-bg-card)",
            border: "1px solid var(--rm-border)",
          }}
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-white font-semibold">Projects</h2>
            <button
              onClick={() =>
                setSortOrder((s) => (s === "newest" ? "oldest" : "newest"))
              }
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-all"
              style={{
                border: "1px solid var(--rm-purple-border)",
                color: "var(--rm-text-secondary)",
              }}
            >
              <ArrowUpDown size={13} />
              {sortOrder === "newest" ? "Newest first" : "Oldest first"}
            </button>
          </div>
          {sortedProjects.length === 0 ? (
            <div className="py-16 text-center">
              <FolderOpen size={32} color="#6B7280" className="mx-auto mb-3" />
              <p className="text-sm text-white">No projects yet</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {sortedProjects.map((p) => (
                <ProjectCard key={p._id} project={p} />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "Audio Reel" && (
        <AudioReelTab username={username} isOwnProfile={isOwnProfile} />
      )}

      {isOwnProfile && (
        <EditProfileModal
          isOpen={editOpen}
          onClose={() => setEditOpen(false)}
          onSaved={(updatedUser) =>
            setProfile((prev) => ({ ...prev, ...updatedUser }))
          }
        />
      )}
    </motion.div>
  );
}
