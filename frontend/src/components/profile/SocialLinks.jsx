import { Link, Globe, Music2 } from "lucide-react";

const SOCIALS = [
  { key: "instagram", label: "Instagram", icon: <Link size={13} /> },
  { key: "soundcloud", label: "SoundCloud", icon: <Music2 size={13} /> },
  { key: "spotify", label: "Spotify", icon: <Music2 size={13} /> },
  { key: "youtube", label: "YouTube", icon: <Link size={13} /> },
  { key: "website", label: "Website", icon: <Globe size={13} /> },
];

export default function SocialLinks({ socials }) {
  if (!socials) return null;
  const active = SOCIALS.filter(({ key }) => socials[key]);
  if (!active.length) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {active.map(({ key, label, icon }) => (
        <a
          key={key}
          href={
            socials[key].startsWith("http")
              ? socials[key]
              : `https://${socials[key]}`
          }
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs transition-all no-underline"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "var(--rm-text-muted)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "rgba(124,58,237,0.4)";
            e.currentTarget.style.color = "var(--rm-purple-light)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
            e.currentTarget.style.color = "var(--rm-text-muted)";
          }}
        >
          {icon} {label}
        </a>
      ))}
    </div>
  );
}
