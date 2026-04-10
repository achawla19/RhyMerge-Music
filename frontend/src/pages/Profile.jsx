import React from "react";
import ProfileHeader from "../components/profile/ProfileHeader";
import BioSection from "../components/profile/BioSection";
import ProjectHistory from "../components/profile/ProjectHistory";
import RightPanel from "../components/profile/RightPanel";
import { useParams } from "react-router-dom";

const Profile = () => {
  const { username } = useParams();
  // 🔥 Dummy data (replace later with backend)
  const users = {
    chhavi: {
      name: "Chhavi",
      role: "Singer • Songwriter",
      location: "Mumbai, India",
      avatar: "/assets/who1.jpg",
      connections: 128,
      projects: 24,

      bio: "Passionate about blending soulful vocals with modern beats. Always looking for creative collaborations.",

      genre: "Pop / Indie",
      age: 21,
      instruments: ["Vocals", "Guitar"],
      pastProjects: ["Midnight Echo", "Lost Frequencies Collab"],
    },

    arjun: {
      name: "Arjun",
      role: "Music Producer",
      location: "Delhi",
      avatar: "/assets/who1.jpg",
      connections: 90,
      projects: 15,
      bio: "EDM & trap producer",
      genre: "EDM",
      age: 24,
      instruments: ["FL Studio", "Ableton"],
      pastProjects: ["Drop Zone"],
    },
  };

  const user = users[username];

  const projects = [
    {
      id: "1",
      title: "Midnight Echo",
      description: "A chill indie track with atmospheric synths.",
      collaborators: ["Arjun", "Riya"],
      date: "2024-02-10",
      genre: "Indie",
    },
    {
      id: "2",
      title: "City Lights",
      description: "Upbeat pop song with electronic vibes.",
      collaborators: ["Kabir"],
      date: "2024-01-05",
      genre: "Pop",
    },
    {
      id: "3",
      title: "Soul Strings",
      description: "Acoustic collaboration with emotional depth.",
      collaborators: ["Ananya", "Dev"],
      date: "2023-12-15",
      genre: "Acoustic",
    },
  ];

  if (!user) {
    return <div className="text-white p-10">User not found</div>;
  }

  return (
    <div className="min-h-screen bg-[#0a0a12] text-white">
      {/* HEADER */}
      <ProfileHeader {...user} />

      {/* MAIN GRID */}
      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[320px_1fr_300px] gap-6">
        {/* LEFT */}
        <div>
          <BioSection
            bio={user.bio}
            genre={user.genre}
            instruments={user.instruments}
            age={user.age}
            pastProjects={user.pastProjects}
          />
        </div>

        {/* CENTER */}
        <div>
          <ProjectHistory projects={projects} />
        </div>

        {/* RIGHT */}
        <div className="lg:block mt-6">
          <RightPanel
            responseTime="2 hrs"
            certificates={[
              "Berklee Music Certified",
              "Ableton Pro",
              "Vocal Training - Trinity",
            ]}
            profileUrl={`https://rhymerge.app/${username}`}
          />
        </div>
      </div>
    </div>
  );
};
export default Profile;
