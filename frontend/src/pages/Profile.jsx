import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";

import ProfileHeader from "../components/profile/ProfileHeader";
import BioSection from "../components/profile/BioSection";
import ProjectHistory from "../components/profile/ProjectHistory";
import RightPanel from "../components/profile/RightPanel";
import EditProfileModal from "../components/profile/EditProfileModal";

import { useAuth } from "../context/AuthContext";
import { getUserByUsername } from "../api/profile";
import { getProjectsByUsername } from "../api/projects";

export default function Profile() {
  const { username } = useParams();
  const { user } = useAuth();

  const [profileData, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      setError("");

      try {
        const [profileRes, projectsRes] = await Promise.all([
          getUserByUsername(username),
          getProjectsByUsername(username),
        ]);

        setProfile(profileRes.user);
        setProjects(projectsRes || []);
      } catch (err) {
        setError(err.message || "Failed to load profile or projects");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [username]);

  if (loading) {
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
  }

  if (error || !profileData) {
    return (
      <div className="flex items-center justify-center py-32">
        <span
          style={{
            fontFamily: "var(--rm-font-mono)",
            fontSize: 13,
            color: "#F87171",
          }}
        >
          {error || "Profile not found"}
        </span>
      </div>
    );
  }

  const isOwnProfile = user?.username === profileData.username;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <ProfileHeader
        userId={profileData._id}
        username={profileData.username}
        name={profileData.name || "Unknown User"}
        role={profileData.role || "Music Creator"}
        location={profileData.location || ""}
        avatar={
          profileData.avatar ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            profileData.name || profileData.username,
          )}&background=7c3aed&color=fff`
        }
        connections={profileData.connectionsCount || 0}
        projects={projects.length}
        isOwnProfile={isOwnProfile}
        onEditClick={() => setEditOpen(true)}
      />

      <div className="grid lg:grid-cols-[320px_1fr_300px] gap-6 mt-6">
        <div>
          <BioSection
            bio={profileData.bio || "No bio available yet."}
            genre={
              profileData.genres?.length
                ? profileData.genres.join(", ")
                : "Not specified"
            }
            instruments={profileData.instruments || []}
          />
        </div>

        <div>
          <ProjectHistory projects={projects} />
        </div>

        <div>
          <RightPanel
            responseTime={
              profileData.availability === "Available"
                ? "Usually Active"
                : "Limited Availability"
            }
            certificates={profileData.certificates || []}
            profileUrl={window.location.href}
          />
        </div>
      </div>

      {/* Editing opens right here — no navigating away to Settings anymore */}
      {isOwnProfile && (
        <EditProfileModal
          isOpen={editOpen}
          onClose={() => setEditOpen(false)}
          onSaved={(updatedUser) => {
            // Reflect the save instantly without a refetch/reload
            setProfile((prev) => ({ ...prev, ...updatedUser }));
          }}
        />
      )}
    </motion.div>
  );
}
