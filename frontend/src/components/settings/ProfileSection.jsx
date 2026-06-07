import { useEffect, useState } from "react";
import { Camera } from "lucide-react";

import RoleDropdown from "../ui/RoleDropdown";
import { useAuth } from "../../context/AuthContext";
import { updateMyProfile } from "../../api/profile";

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
  const { user, updateUser } = useAuth();

  const [role, setRole] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [selectedGenres, setSelectedGenres] = useState([]);

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;

    setRole(user.role || "");
    setBio(user.bio || "");
    setLocation(user.location || "");
    setSelectedGenres(user.genres || []);
  }, [user]);

  const toggleGenre = (genre) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre],
    );
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);

      const data = await updateMyProfile({
        role,
        bio,
        location,
        genres: selectedGenres,
      });

      updateUser(data.user);

      alert("Profile updated successfully");
    } catch (err) {
      alert(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h2 className="text-white font-semibold text-lg mb-1">Profile</h2>

      <p className="text-gray-500 text-sm mb-5">
        Customize your public profile
      </p>

      {/* Avatar */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl font-bold text-white">
            {(user?.name || "U")
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)}
          </div>

          <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-purple-500 rounded-full flex items-center justify-center ring-2 ring-[#0B2540] hover:bg-purple-600 transition">
            <Camera className="w-3.5 h-3.5 text-white" />
          </button>
        </div>

        <div>
          <p className="text-white font-medium text-sm">Profile Picture</p>

          <p className="text-gray-500 text-xs">Avatar uploads coming soon</p>
        </div>
      </div>

      {/* Bio */}
      <div className="mb-5">
        <label className="text-gray-400 text-sm mb-2 block">Bio</label>

        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={4}
          maxLength={500}
          placeholder="Tell other musicians about yourself..."
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500 resize-none"
        />

        <p className="text-gray-600 text-xs mt-1">{bio.length}/500</p>
      </div>

      {/* Location */}
      <div className="mb-5">
        <label className="text-gray-400 text-sm mb-2 block">Location</label>

        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Mumbai, India"
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500"
        />
      </div>

      {/* Role */}
      <div className="mb-5">
        <label className="text-gray-400 text-sm mb-2 block">Role</label>

        <RoleDropdown value={role} onChange={setRole} />
      </div>

      {/* Genres */}
      <div className="mb-6">
        <label className="text-gray-400 text-sm mb-2 block">Genres</label>

        <div className="flex flex-wrap gap-2">
          {GENRES.map((genre) => (
            <button
              type="button"
              key={genre}
              onClick={() => toggleGenre(genre)}
              className={`px-3 py-1.5 rounded-full border text-sm transition-all ${
                selectedGenres.includes(genre)
                  ? "border-purple-500 bg-purple-500/20 text-purple-300"
                  : "border-white/10 bg-white/5 text-gray-400"
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      {/* Save */}
      <button
        onClick={handleSaveProfile}
        disabled={saving}
        className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 transition text-white"
      >
        {saving ? "Saving..." : "Save Profile"}
      </button>
    </div>
  );
};

export default ProfileSection;
