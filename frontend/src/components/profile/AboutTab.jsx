import {
  Sparkles,
  Music2,
  Mic,
  Award,
  Share2,
  Copy,
  Check,
  Clock,
} from "lucide-react";
import { useState } from "react";
import AvailabilityBadge from "./AvailabilityBadge";

export default function AboutTab({ profileData }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Left — bio + genres + instruments */}
      <div className="lg:col-span-2 space-y-5">
        <div
          className="rounded-2xl p-6"
          style={{
            background: "var(--rm-bg-card)",
            border: "1px solid var(--rm-border)",
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={15} color="#C084FC" />
            <h2 className="text-white font-semibold">About</h2>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: "#D1D5DB" }}>
            {profileData.bio || "No bio yet."}
          </p>
        </div>

        <div
          className="rounded-2xl p-6"
          style={{
            background: "var(--rm-bg-card)",
            border: "1px solid var(--rm-border)",
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Music2 size={15} color="#C084FC" />
            <h2 className="text-white font-semibold">Sounds & Skills</h2>
          </div>

          {profileData.genres?.length > 0 && (
            <div className="mb-4">
              <p
                className="text-xs mb-2"
                style={{
                  fontFamily: "var(--rm-font-mono)",
                  color: "var(--rm-text-muted)",
                }}
              >
                genres
              </p>
              <div className="flex flex-wrap gap-2">
                {profileData.genres.map((g) => (
                  <span
                    key={g}
                    className="px-3 py-1 rounded-full text-xs"
                    style={{
                      background: "var(--rm-purple-dim)",
                      border: "1px solid var(--rm-purple-border)",
                      color: "var(--rm-purple-light)",
                    }}
                  >
                    {g}
                  </span>
                ))}
              </div>
            </div>
          )}

          {profileData.instruments?.length > 0 && (
            <div>
              <p
                className="text-xs mb-2 flex items-center gap-1"
                style={{
                  fontFamily: "var(--rm-font-mono)",
                  color: "var(--rm-text-muted)",
                }}
              >
                <Mic size={11} /> skills & instruments
              </p>
              <div className="flex flex-wrap gap-2">
                {profileData.instruments.map((inst) => (
                  <span
                    key={inst}
                    className="px-3 py-1 rounded-full text-xs"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      color: "var(--rm-text-secondary)",
                    }}
                  >
                    {inst}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right — availability, certs, share */}
      <div className="space-y-4">
        <div
          className="rounded-2xl p-5"
          style={{
            background: "var(--rm-bg-card)",
            border: "1px solid var(--rm-border)",
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Clock size={14} color="#C084FC" />
            <h3 className="text-white font-medium text-sm">Availability</h3>
          </div>
          <AvailabilityBadge availability={profileData.availability} />
        </div>

        {profileData.certificates?.length > 0 && (
          <div
            className="rounded-2xl p-5"
            style={{
              background: "var(--rm-bg-card)",
              border: "1px solid var(--rm-border)",
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Award size={14} color="#C084FC" />
              <h3 className="text-white font-medium text-sm">Certifications</h3>
            </div>
            <div className="space-y-2">
              {profileData.certificates.map((cert) => (
                <div
                  key={cert}
                  className="text-xs px-3 py-2 rounded-lg"
                  style={{
                    background: "var(--rm-bg)",
                    color: "var(--rm-text-secondary)",
                  }}
                >
                  {cert}
                </div>
              ))}
            </div>
          </div>
        )}

        <div
          className="rounded-2xl p-5"
          style={{
            background: "var(--rm-bg-card)",
            border: "1px solid var(--rm-border)",
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Share2 size={14} color="#C084FC" />
            <h3 className="text-white font-medium text-sm">Share Profile</h3>
          </div>
          <div className="flex gap-2">
            <input
              value={window.location.href}
              readOnly
              className="flex-1 rounded-lg px-3 py-2 text-xs outline-none"
              style={{
                background: "var(--rm-bg)",
                border: "1px solid var(--rm-purple-border)",
                color: "var(--rm-text-muted)",
              }}
            />
            <button
              onClick={handleCopy}
              className="px-3 rounded-lg flex-shrink-0"
              style={{ background: copied ? "#10B981" : "var(--rm-purple)" }}
            >
              {copied ? (
                <Check size={14} color="#fff" />
              ) : (
                <Copy size={14} color="#fff" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
