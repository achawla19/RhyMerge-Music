import { useState } from "react";
import { Eye, EyeOff, Info } from "lucide-react";
import Toggle from "./Toggle";

const PrivacySection = () => {
  const [profileVisible, setProfileVisible] = useState(true);
  const [showEmail, setShowEmail] = useState(false);
  const [messagePermission, setMessagePermission] = useState("everyone");

  return (
    <div>
      <h2 className="text-white font-semibold text-lg mb-1">Privacy</h2>
      <p className="text-sm mb-5" style={{ color: "var(--rm-text-muted)" }}>
        Control who can see your content
      </p>

      <div
        className="flex items-start gap-2 text-xs rounded-xl px-3 py-2.5 mb-5"
        style={{
          background: "rgba(245,158,11,0.08)",
          border: "1px solid rgba(245,158,11,0.25)",
          color: "#FBBF24",
        }}
      >
        <Info size={14} className="flex-shrink-0 mt-0.5" />
        <span style={{ fontFamily: "var(--rm-font-mono)" }}>
          these preferences aren't saved or enforced yet — every profile is
          currently public
        </span>
      </div>

      <div className="space-y-4">
        <div
          className="flex items-center justify-between py-3"
          style={{ borderBottom: "1px solid rgba(124,58,237,0.1)" }}
        >
          <div className="flex items-center gap-3">
            {profileVisible ? (
              <Eye size={16} color="#C084FC" />
            ) : (
              <EyeOff size={16} color="var(--rm-text-muted)" />
            )}
            <div>
              <p className="text-white text-sm font-medium">Public Profile</p>
              <p className="text-xs" style={{ color: "var(--rm-text-muted)" }}>
                anyone can view your profile
              </p>
            </div>
          </div>
          <Toggle
            enabled={profileVisible}
            onToggle={() => setProfileVisible(!profileVisible)}
          />
        </div>

        <div
          className="flex items-center justify-between py-3"
          style={{ borderBottom: "1px solid rgba(124,58,237,0.1)" }}
        >
          <div>
            <p className="text-white text-sm font-medium">Show Email</p>
            <p className="text-xs" style={{ color: "var(--rm-text-muted)" }}>
              display email on your profile
            </p>
          </div>
          <Toggle
            enabled={showEmail}
            onToggle={() => setShowEmail(!showEmail)}
          />
        </div>

        <div className="py-3">
          <p className="text-white text-sm font-medium mb-3">
            Who can message you
          </p>
          <div className="flex gap-2 flex-wrap">
            {["everyone", "connections", "nobody"].map((option) => {
              const active = messagePermission === option;
              return (
                <button
                  key={option}
                  onClick={() => setMessagePermission(option)}
                  className="rounded-xl px-4 py-2 text-sm capitalize transition-all"
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
                  {option}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacySection;
