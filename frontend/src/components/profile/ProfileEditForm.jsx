import { useEffect, useState } from "react";
import { Camera, Check } from "lucide-react";
import TagInput from "./TagInput";
import Select from "../ui/Select";
import { useAuth } from "../../context/AuthContext";
import { updateMyProfile } from "../../api/profile";
import {
  ROLES,
  GENRES,
  EXPERIENCE_LEVELS,
  AVAILABILITY_OPTIONS,
} from "../../constants/profileOptions";

const ProfileEditForm = ({ onSaved, onCancel, compact = false }) => {
  const { user, updateUser } = useAuth();

  const [form, setForm] = useState({
    avatar: "",
    name: "",
    username: "",
    role: "",
    bio: "",
    location: "",
    genres: [],
    instruments: [],
    certificates: [],
    experienceLevel: "Beginner",
    availability: "Available",
    socials: {
      instagram: "",
      soundcloud: "",
      spotify: "",
      youtube: "",
      website: "",
    },
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    setForm({
      avatar: user.avatar || "",
      name: user.name || "",
      username: user.username || "",
      role: (user.role || "").toLowerCase(),
      bio: user.bio || "",
      location: user.location || "",
      genres: user.genres || [],
      instruments: user.instruments || [],
      certificates: user.certificates || [],
      experienceLevel: user.experienceLevel || "Beginner",
      availability: user.availability || "Available",
      socials: {
        instagram: user.socials?.instagram || "",
        soundcloud: user.socials?.soundcloud || "",
        spotify: user.socials?.spotify || "",
        youtube: user.socials?.youtube || "",
        website: user.socials?.website || "",
      },
    });
  }, [user]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const setVal = (key) => (val) => setForm((f) => ({ ...f, [key]: val }));
  const setSocial = (key) => (e) =>
    setForm((f) => ({
      ...f,
      socials: { ...f.socials, [key]: e.target.value },
    }));

  const toggleGenre = (genre) =>
    setForm((f) => ({
      ...f,
      genres: f.genres.includes(genre)
        ? f.genres.filter((g) => g !== genre)
        : [...f.genres, genre],
    }));

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim() || !form.username.trim()) {
      setError("Name and username can't be empty");
      return;
    }
    setSaving(true);
    try {
      const data = await updateMyProfile(form);
      updateUser(data.user);
      setSaved(true);
      onSaved?.(data.user);
      setTimeout(() => setSaved(false), 1800);
    } catch (err) {
      setError(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = {
    background: "var(--rm-bg)",
    border: "1px solid var(--rm-purple-border)",
    color: "var(--rm-text-primary)",
  };

  const focus = (e) => (e.currentTarget.style.borderColor = "var(--rm-purple)");
  const blur = (e) =>
    (e.currentTarget.style.borderColor = "var(--rm-purple-border)");

  return (
    <form onSubmit={handleSave} className="space-y-5">
      {/* Name + Username */}
      <div className={compact ? "grid sm:grid-cols-2 gap-4" : "space-y-4"}>
        <div>
          <label
            className="text-xs mb-1.5 block"
            style={{
              fontFamily: "var(--rm-font-mono)",
              color: "var(--rm-text-muted)",
            }}
          >
            Display Name
          </label>
          <input
            value={form.name}
            onChange={set("name")}
            className="w-full rounded-xl px-4 py-2.5 outline-none text-sm"
            style={inputStyle}
            onFocus={focus}
            onBlur={blur}
          />
        </div>
        <div>
          <label
            className="text-xs mb-1.5 block"
            style={{
              fontFamily: "var(--rm-font-mono)",
              color: "var(--rm-text-muted)",
            }}
          >
            Username
          </label>
          <div className="flex items-center">
            <span
              className="rounded-l-xl px-3 py-2.5 text-sm"
              style={{
                background: "var(--rm-bg)",
                border: "1px solid var(--rm-purple-border)",
                borderRight: "none",
                color: "var(--rm-text-muted)",
              }}
            >
              @
            </span>
            <input
              value={form.username}
              onChange={set("username")}
              className="flex-1 rounded-r-xl px-4 py-2.5 outline-none text-sm"
              style={inputStyle}
              onFocus={focus}
              onBlur={blur}
            />
          </div>
        </div>
      </div>

      {/* Role + Experience + Availability */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <label
            className="text-xs mb-1.5 block"
            style={{
              fontFamily: "var(--rm-font-mono)",
              color: "var(--rm-text-muted)",
            }}
          >
            Role
          </label>
          <Select
            value={form.role}
            onChange={setVal("role")}
            options={ROLES.map((r) => ({ value: r.toLowerCase(), label: r }))}
            placeholder="Select role"
          />
        </div>
        <div>
          <label
            className="text-xs mb-1.5 block"
            style={{
              fontFamily: "var(--rm-font-mono)",
              color: "var(--rm-text-muted)",
            }}
          >
            Experience
          </label>
          <Select
            value={form.experienceLevel}
            onChange={setVal("experienceLevel")}
            options={EXPERIENCE_LEVELS}
          />
        </div>
        <div>
          <label
            className="text-xs mb-1.5 block"
            style={{
              fontFamily: "var(--rm-font-mono)",
              color: "var(--rm-text-muted)",
            }}
          >
            Availability
          </label>
          <Select
            value={form.availability}
            onChange={setVal("availability")}
            options={AVAILABILITY_OPTIONS}
          />
        </div>
      </div>

      {/* Bio */}
      <div>
        <label
          className="text-xs mb-1.5 block"
          style={{
            fontFamily: "var(--rm-font-mono)",
            color: "var(--rm-text-muted)",
          }}
        >
          Bio
        </label>
        <textarea
          value={form.bio}
          onChange={set("bio")}
          rows={3}
          maxLength={500}
          placeholder="tell other musicians about yourself..."
          className="w-full rounded-xl px-4 py-3 outline-none resize-none text-sm"
          style={inputStyle}
          onFocus={focus}
          onBlur={blur}
        />
        <p
          className="text-[11px] mt-1"
          style={{
            fontFamily: "var(--rm-font-mono)",
            color: "var(--rm-text-muted)",
          }}
        >
          {form.bio.length}/500
        </p>
      </div>

      {/* Location */}
      <div>
        <label
          className="text-xs mb-1.5 block"
          style={{
            fontFamily: "var(--rm-font-mono)",
            color: "var(--rm-text-muted)",
          }}
        >
          Location
        </label>
        <input
          value={form.location}
          onChange={set("location")}
          placeholder="Mumbai, India"
          className="w-full rounded-xl px-4 py-2.5 outline-none text-sm"
          style={inputStyle}
          onFocus={focus}
          onBlur={blur}
        />
      </div>

      {/* Genres */}
      <div>
        <label
          className="text-xs mb-2 block"
          style={{
            fontFamily: "var(--rm-font-mono)",
            color: "var(--rm-text-muted)",
          }}
        >
          Genres
        </label>
        <div className="flex flex-wrap gap-2">
          {GENRES.map((genre) => {
            const active = form.genres.includes(genre);
            return (
              <button
                type="button"
                key={genre}
                onClick={() => toggleGenre(genre)}
                className="px-3 py-1.5 rounded-full text-sm transition-all"
                style={
                  active
                    ? {
                        background: "var(--rm-purple-dim)",
                        border: "1px solid var(--rm-purple-border)",
                        color: "var(--rm-purple-light)",
                      }
                    : {
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        color: "var(--rm-text-muted)",
                      }
                }
              >
                {genre}
              </button>
            );
          })}
        </div>
      </div>

      <TagInput
        label="Skills & Instruments"
        hint="press Enter or tap + to add"
        items={form.instruments}
        onChange={(instruments) => setForm((f) => ({ ...f, instruments }))}
        placeholder="e.g. Guitar, Ableton, Mixing"
      />

      <TagInput
        label="Certifications"
        hint="courses, degrees, or credentials"
        items={form.certificates}
        onChange={(certificates) => setForm((f) => ({ ...f, certificates }))}
        placeholder="e.g. Berklee Online — Music Production"
      />

      {/* Social links */}
      <div>
        <label
          className="text-xs mb-2 block"
          style={{
            fontFamily: "var(--rm-font-mono)",
            color: "var(--rm-text-muted)",
          }}
        >
          Social Links
        </label>
        <div className={compact ? "grid sm:grid-cols-2 gap-3" : "space-y-3"}>
          {[
            { key: "instagram", placeholder: "instagram.com/yourhandle" },
            { key: "soundcloud", placeholder: "soundcloud.com/yourprofile" },
            { key: "spotify", placeholder: "open.spotify.com/artist/..." },
            { key: "youtube", placeholder: "youtube.com/@yourchannel" },
            { key: "website", placeholder: "yoursite.com" },
          ].map(({ key, placeholder }) => (
            <input
              key={key}
              value={form.socials[key]}
              onChange={setSocial(key)}
              placeholder={placeholder}
              className="w-full rounded-xl px-4 py-2.5 outline-none text-sm"
              style={inputStyle}
              onFocus={focus}
              onBlur={blur}
            />
          ))}
        </div>
      </div>

      {error && (
        <p className="text-xs" style={{ color: "#F87171" }}>
          {error}
        </p>
      )}

      <div className="flex gap-3 pt-1">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 rounded-xl font-medium text-white transition-all disabled:opacity-50 flex items-center gap-2"
          style={{ background: saved ? "#10B981" : "var(--rm-purple)" }}
        >
          {saved && <Check size={15} />}
          {saved ? "Saved" : saving ? "Saving..." : "Save Changes"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2.5 rounded-xl font-medium transition-all"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "var(--rm-text-secondary)",
            }}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default ProfileEditForm;
