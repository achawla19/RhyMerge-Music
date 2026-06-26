import { useState, useEffect } from "react";
import { User, Loader2, CheckCircle2, Globe, Link } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import Select from "../ui/Select";

const API = import.meta.env.VITE_API_URL;

const GENRES = [
  "Hip-Hop",
  "R&B",
  "Pop",
  "Electronic",
  "Rock",
  "Jazz",
  "Classical",
  "Afrobeats",
  "Lo-Fi",
  "Trap",
  "Soul",
  "Reggae",
];
const INSTRUMENTS = [
  "Guitar",
  "Piano",
  "Drums",
  "Bass",
  "Violin",
  "Saxophone",
  "Trumpet",
  "Vocals",
  "Synthesizer",
  "DJ Decks",
];
const ROLES = [
  "Producer",
  "Vocalist",
  "Lyricist",
  "Mix Engineer",
  "Mastering Engineer",
  "Beatmaker",
  "Guitarist",
  "Drummer",
  "Sound Designer",
  "A&R",
];
const EXPERIENCE = ["Beginner", "Intermediate", "Advanced", "Professional"];
const AVAILABILITY = ["Available", "Busy", "Not Looking"];

const inputStyle = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  color: "var(--rm-text-primary)",
  borderRadius: 12,
  padding: "10px 16px",
  width: "100%",
  outline: "none",
  fontSize: 14,
};

const label = (text) => (
  <label
    style={{
      fontFamily: "var(--rm-font-mono)",
      color: "var(--rm-text-muted)",
      fontSize: 11,
      marginBottom: 6,
      display: "block",
    }}
  >
    {text}
  </label>
);

const ChipGroup = ({ options, selected, onChange }) => (
  <div className="flex flex-wrap gap-2">
    {options.map((opt) => {
      const active = selected.includes(opt);
      return (
        <button
          key={opt}
          type="button"
          onClick={() =>
            onChange(
              active ? selected.filter((x) => x !== opt) : [...selected, opt],
            )
          }
          className="px-3 py-1.5 rounded-xl text-xs transition-all"
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
          {opt}
        </button>
      );
    })}
  </div>
);

export default function ProfileSection() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: "",
    bio: "",
    role: "",
    location: "",
    experienceLevel: "Beginner",
    availability: "Available",
    genres: [],
    instruments: [],
    socials: {
      instagram: "",
      soundcloud: "",
      spotify: "",
      youtube: "",
      website: "",
    },
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    if (!user) return;
    setForm({
      name: user.name || "",
      bio: user.bio || "",
      role: user.role || "",
      location: user.location || "",
      experienceLevel: user.experienceLevel || "Beginner",
      availability: user.availability || "Available",
      genres: user.genres || [],
      instruments: user.instruments || [],
      socials: {
        instagram: user.socials?.instagram || "",
        soundcloud: user.socials?.soundcloud || "",
        spotify: user.socials?.spotify || "",
        youtube: user.socials?.youtube || "",
        website: user.socials?.website || "",
      },
    });
  }, [user]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const setSocial = (k) => (e) =>
    setForm((f) => ({ ...f, socials: { ...f.socials, [k]: e.target.value } }));

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch(`${API}/api/users/profile`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Save failed");
      updateUser(data.user);
      setMsg({ type: "success", text: "Profile saved" });
    } catch (err) {
      setMsg({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const focus = (e) => (e.currentTarget.style.borderColor = "var(--rm-purple)");
  const blur = (e) =>
    (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)");

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{
            background: "var(--rm-purple-dim)",
            border: "1px solid var(--rm-purple-border)",
          }}
        >
          <User size={16} color="#C084FC" />
        </div>
        <div>
          <h2 className="text-white font-semibold text-lg">Profile</h2>
          <p
            className="text-xs"
            style={{
              fontFamily: "var(--rm-font-mono)",
              color: "var(--rm-text-muted)",
            }}
          >
            how other creators see you
          </p>
        </div>
      </div>

      {/* Basic */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          {label("display name")}
          <input
            value={form.name}
            onChange={set("name")}
            style={inputStyle}
            maxLength={60}
            onFocus={focus}
            onBlur={blur}
          />
        </div>
        <div>
          {label("location")}
          <input
            value={form.location}
            onChange={set("location")}
            style={inputStyle}
            placeholder="City, Country"
            onFocus={focus}
            onBlur={blur}
          />
        </div>
      </div>

      {/* Role */}
      <div>
        {label("primary role")}
        <div className="flex flex-wrap gap-2">
          {ROLES.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() =>
                setForm((f) => ({ ...f, role: f.role === r ? "" : r }))
              }
              className="px-3 py-1.5 rounded-xl text-xs transition-all"
              style={
                form.role === r
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
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Bio */}
      <div>
        {label("bio")}
        <textarea
          value={form.bio}
          onChange={set("bio")}
          rows={3}
          maxLength={500}
          placeholder="What's your sound? Who do you make music for?"
          style={{ ...inputStyle, resize: "none" }}
          onFocus={focus}
          onBlur={blur}
        />
        <p
          className="text-right text-xs mt-1"
          style={{
            color: "var(--rm-text-muted)",
            fontFamily: "var(--rm-font-mono)",
          }}
        >
          {form.bio.length}/500
        </p>
      </div>

      {/* Experience + Availability */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          {label("experience level")}
          <Select
            value={form.experienceLevel}
            onChange={(v) => setForm((f) => ({ ...f, experienceLevel: v }))}
            options={EXPERIENCE}
          />
        </div>
        <div>
          {label("availability")}
          <Select
            value={form.availability}
            onChange={(v) => setForm((f) => ({ ...f, availability: v }))}
            options={AVAILABILITY}
          />
        </div>
      </div>

      {/* Genres */}
      <div>
        {label("genres")}
        <ChipGroup
          options={GENRES}
          selected={form.genres}
          onChange={(v) => setForm((f) => ({ ...f, genres: v }))}
        />
      </div>

      {/* Instruments */}
      <div>
        {label("instruments / skills")}
        <ChipGroup
          options={INSTRUMENTS}
          selected={form.instruments}
          onChange={(v) => setForm((f) => ({ ...f, instruments: v }))}
        />
      </div>

      {/* Social Links */}
      <div>
        {label("social links")}
        <div className="space-y-3">
          {[
            {
              key: "instagram",
              placeholder: "instagram.com/yourhandle",
              icon: <Link size={14} />,
            },
            {
              key: "soundcloud",
              placeholder: "soundcloud.com/yourprofile",
              icon: (
                <span
                  style={{ fontSize: 12, fontFamily: "var(--rm-font-mono)" }}
                >
                  SC
                </span>
              ),
            },
            {
              key: "spotify",
              placeholder: "open.spotify.com/artist/...",
              icon: (
                <span
                  style={{ fontSize: 12, fontFamily: "var(--rm-font-mono)" }}
                >
                  SP
                </span>
              ),
            },
            {
              key: "youtube",
              placeholder: "youtube.com/@yourchannel",
              icon: <Link size={14} />,
            },
            {
              key: "website",
              placeholder: "yourwebsite.com",
              icon: <Globe size={14} />,
            },
          ].map(({ key, placeholder, icon }) => (
            <div key={key} className="relative">
              <div
                className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: "var(--rm-text-muted)" }}
              >
                {icon}
              </div>
              <input
                value={form.socials[key]}
                onChange={setSocial(key)}
                placeholder={placeholder}
                style={{ ...inputStyle, paddingLeft: 36 }}
                onFocus={focus}
                onBlur={blur}
              />
            </div>
          ))}
        </div>
      </div>

      {msg && (
        <div
          className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm"
          style={{
            background:
              msg.type === "success"
                ? "rgba(16,185,129,0.1)"
                : "rgba(248,113,113,0.1)",
            border: `1px solid ${msg.type === "success" ? "rgba(16,185,129,0.3)" : "rgba(248,113,113,0.3)"}`,
            color: msg.type === "success" ? "#34D399" : "#F87171",
          }}
        >
          {msg.type === "success" && <CheckCircle2 size={14} />}
          {msg.text}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium text-white disabled:opacity-40 transition-all"
        style={{ background: "var(--rm-purple)" }}
        onMouseEnter={(e) =>
          !e.currentTarget.disabled &&
          (e.currentTarget.style.background = "#6D28D9")
        }
        onMouseLeave={(e) =>
          !e.currentTarget.disabled &&
          (e.currentTarget.style.background = "var(--rm-purple)")
        }
      >
        {loading && <Loader2 size={14} className="animate-spin" />}
        {loading ? "Saving..." : "Save Profile"}
      </button>
    </form>
  );
}
