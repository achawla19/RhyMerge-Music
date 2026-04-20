import { useEffect, useState } from "react";
import { Camera } from "lucide-react";
import RoleDropdown from "../ui/RoleDropdown";
import { useAuth } from "../../context/AuthContext";

const GENRES = [
  "Hip-Hop",
  "LoFi",
  "EDM",
  "Indie",
  "R&B",
  "Pop",
  "Rock",
  "Jazz",
  "Soul",
  "Trap",
  "Folk",
  "Ambient",
];

const ProfileSection = () => {
  const [role, setRole] = useState("");
  const [bio, setBio] = useState(
    "Producer and beat maker. Always looking for talented vocalists to collaborate with.",
  );
  const [selectedGenres, setSelectedGenres] = useState(["Hip-Hop", "LoFi"]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.role) {
      setRole(user.role);
    }
  }, []);

  const toggleGenre = (genre) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre],
    );
  };

  const handleSaveProfile = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/user/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ role }),
      });

      const data = await res.json();

      if (res.ok) {
        const { updateUser } = useAuth();

        updateUser(data.user);

        alert("Profile updated");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2 className="text-white font-semibold text-lg mb-1">Profile</h2>
      <p className="text-gray-500 text-sm mb-5">
        Customize your public profile
      </p>

      {/* Avatar */}
      <div className="flex items-center gap-4 mb-5">
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl font-bold text-white">
            AK
          </div>
          <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-purple-500 rounded-full flex items-center justify-center ring-2 ring-[#0B2540] hover:bg-purple-600 transition">
            <Camera className="w-3.5 h-3.5 text-white" />
          </button>
        </div>
        <div>
          <p className="text-white font-medium text-sm">Profile Picture</p>
          <p className="text-gray-500 text-xs">JPG or PNG. Max 5MB.</p>
        </div>
      </div>

      {/* Bio */}
      <div className="mb-4">
        <label className="text-gray-400 text-sm mb-1 block">Bio</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          maxLength={500}
          rows={3}
          className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 outline-none focus:border-purple-500 transition resize-none placeholder-gray-600"
          placeholder="Tell others about yourself..."
        />
        <p className="text-gray-600 text-xs mt-1">{bio.length}/500</p>
      </div>

      {/* Roles */}
      <div className="mt-6">
        <div className="mt-6">
          <label className="text-sm text-gray-400 mb-2 block">Role</label>

          <RoleDropdown value={role} onChange={setRole} />
        </div>
      </div>

      {/* Genres */}
      <div>
        <label className="text-gray-400 text-sm mb-2 block">
          Genres & Skills
        </label>
        <div className="flex flex-wrap gap-2">
          {GENRES.map((genre) => (
            <button
              key={genre}
              onClick={() => toggleGenre(genre)}
              className={`rounded-full border px-3 py-1.5 text-sm transition-all ${
                selectedGenres.includes(genre)
                  ? "border-purple-500 bg-purple-500/20 text-purple-400"
                  : "border-white/10 bg-white/5 text-gray-400 hover:border-purple-500/30"
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      {/* Save Profile Button */}
      <button
        onClick={handleSaveProfile}
        className="mt-4 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 transition"
      >
        Save Profile
      </button>
    </div>
  );
};
export default ProfileSection;
