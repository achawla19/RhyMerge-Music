import { Copy, Check, Clock, Award, Share2, Music } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const RightPanel = ({
  responseTime = "Unknown",
  certificates = [],
  profileUrl,
}) => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-4">
      {/* Response Time */}
      <div
        className="rounded-2xl p-5"
        style={{
          background: "var(--rm-bg-card)",
          border: "1px solid var(--rm-border)",
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Clock size={16} color="#C084FC" />
          <h3 className="font-semibold text-white text-sm">Response Time</h3>
        </div>
        <p
          className="text-xl font-bold"
          style={{
            color: "var(--rm-purple-light)",
            fontFamily: "var(--rm-font-mono)",
          }}
        >
          {responseTime}
        </p>
        <p className="text-xs mt-2" style={{ color: "var(--rm-text-muted)" }}>
          based on current availability status
        </p>
      </div>

      {/* Certificates */}
      <div
        className="rounded-2xl p-5"
        style={{
          background: "var(--rm-bg-card)",
          border: "1px solid var(--rm-border)",
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Award size={16} color="#C084FC" />
          <h3 className="font-semibold text-white text-sm">Certifications</h3>
        </div>
        {certificates.length > 0 ? (
          <div className="space-y-2">
            {certificates.map((cert) => (
              <div
                key={cert}
                className="text-sm rounded-lg px-3 py-2"
                style={{
                  background: "var(--rm-bg)",
                  color: "var(--rm-text-secondary)",
                }}
              >
                {cert}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm" style={{ color: "var(--rm-text-muted)" }}>
            no certifications added yet
          </p>
        )}
      </div>

      {/* Share */}
      <div
        className="rounded-2xl p-5"
        style={{
          background: "var(--rm-bg-card)",
          border: "1px solid var(--rm-border)",
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Share2 size={16} color="#C084FC" />
          <h3 className="font-semibold text-white text-sm">Share Profile</h3>
        </div>
        <div className="flex gap-2">
          <input
            value={profileUrl}
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
            className="px-3 rounded-lg transition-colors flex-shrink-0"
            style={{ background: copied ? "#10B981" : "var(--rm-purple)" }}
          >
            {copied ? (
              <Check size={15} color="#fff" />
            ) : (
              <Copy size={15} color="#fff" />
            )}
          </button>
        </div>
      </div>

      {/* CTA */}
      <div
        className="rounded-2xl p-5 text-center"
        style={{
          background:
            "linear-gradient(135deg, rgba(124,58,237,0.18), rgba(192,132,252,0.08))",
          border: "1px solid var(--rm-purple-border)",
        }}
      >
        <Music size={24} color="#C084FC" className="mx-auto mb-3" />
        <h3 className="font-semibold text-white mb-1.5 text-sm">
          Looking to Collaborate?
        </h3>
        <p
          className="text-xs mb-4"
          style={{ color: "var(--rm-text-secondary)" }}
        >
          connect with musicians, producers and creators
        </p>
        <button
          onClick={() => navigate("/projects")}
          className="w-full py-2.5 rounded-lg text-white font-medium text-sm transition-all"
          style={{ background: "var(--rm-purple)" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#6D28D9")}
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "var(--rm-purple)")
          }
        >
          Start a Mix
        </button>
      </div>
    </div>
  );
};

export default RightPanel;
