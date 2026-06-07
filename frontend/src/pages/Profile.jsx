import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";

import ProfileHeader from "../components/profile/ProfileHeader";
import BioSection from "../components/profile/BioSection";
import ProjectHistory from "../components/profile/ProjectHistory";
import RightPanel from "../components/profile/RightPanel";

import { getUserByUsername } from "../api/profile";
import { getProjectsByUsername } from "../api/projects";

export default function Profile() {
  const { username } = useParams();

  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      setError("");

      try {
        const [profileData, projectsData] = await Promise.all([
          getUserByUsername(username),
          getProjectsByUsername(username),
        ]);

        setProfile(profileData.user);
        setProjects(projectsData || []);
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
      <div className="min-h-screen bg-[#0b0b12] flex items-center justify-center">
        <div className="text-purple-400 text-lg font-medium">
          Loading profile...
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-[#0b0b12] flex items-center justify-center">
        <div className="text-red-400 text-lg">
          {error || "Profile not found"}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#0b0b12] text-white"
    >
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-600/10 blur-[150px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-pink-600/10 blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <ProfileHeader
          name={profile.name || "Unknown User"}
          role={profile.role || "Music Creator"}
          location={profile.location || "Location not specified"}
          avatar={
            profile.avatar ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              profile.name || profile.username,
            )}&background=7c3aed&color=fff`
          }
          connections={profile.connectionsCount || 0}
          projects={profile.projectsCount || 0}
        />

        {/* Main Grid */}
        <div className="grid lg:grid-cols-[320px_1fr_300px] gap-6 mt-6">
          {/* Left Column */}
          <div>
            <BioSection
              bio={profile.bio || "No bio available yet."}
              genre={
                profile.genres?.length
                  ? profile.genres.join(", ")
                  : "Not specified"
              }
              instruments={profile.instruments || []}
              pastProjects={[]}
            />
          </div>

          {/* Center Column */}
          <div>
            <ProjectHistory projects={projects} />
          </div>

          {/* Right Column */}
          <div>
            <RightPanel
              responseTime={
                profile.availability === "Available"
                  ? "Usually Active"
                  : "Limited Availability"
              }
              certificates={profile.certificates || []}
              profileUrl={window.location.href}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
