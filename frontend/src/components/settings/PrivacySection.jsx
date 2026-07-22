import { useState } from "react";
import { Eye, EyeOff, MessageCircle, LayoutGrid, Loader2 } from "lucide-react";
import Toggle from "./Toggle";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../ui/Toast";
import { updatePreferences } from "../../api/user";

const VISIBILITY_OPTIONS = [
  { value: "everyone", label: "Everyone" },
  { value: "connections", label: "Connections only" },
  { value: "nobody", label: "Nobody" },
];

const DEFAULTS = {
  profileVisible: true,
  showEmail: false,
  messagePermission: "everyone",
  projectVisibility: "everyone",
};

const PrivacySection = () => {
  const { user, updateUser } = useAuth();
  const toast = useToast();

  const [privacy, setPrivacy] = useState({
    ...DEFAULTS,
    ...(user?.preferences?.privacy || {}),
  });
  const [savingKey, setSavingKey] = useState(null);

  const save = async (patch) => {
    const key = Object.keys(patch)[0];
    const previous = privacy;
    const next = { ...privacy, ...patch };
    setPrivacy(next); // optimistic
    setSavingKey(key);
    try {
      const { user: updated } = await updatePreferences({ privacy: next });
      updateUser(updated);
    } catch (err) {
      setPrivacy(previous); // roll back just this change
      toast.error(err.message || "Couldn't save that setting");
    } finally {
      setSavingKey(null);
    }
  };

  return (
    <div>
      <h2 className="text-white font-semibold text-lg mb-1">Privacy</h2>
      <p className="text-sm mb-6" style={{ color: "var(--rm-text-muted)" }}>
        Control who can see your profile, your work, and reach out to you
      </p>

      <div className="space-y-1">
        {/* Public Profile */}
        <div
          className="flex items-center justify-between py-3.5"
          style={{ borderBottom: "1px solid rgba(124,58,237,0.1)" }}
        >
          <div className="flex items-center gap-3">
            {privacy.profileVisible ? (
              <Eye size={16} color="#C084FC" />
            ) : (
              <EyeOff size={16} color="var(--rm-text-muted)" />
            )}
            <div>
              <p className="text-white text-sm font-medium">Public Profile</p>
              <p
                className="text-xs mt-0.5"
                style={{ color: "var(--rm-text-muted)" }}
              >
                {privacy.profileVisible
                  ? "Anyone can view your profile"
                  : "Only you can view your profile"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {savingKey === "profileVisible" && (
              <Loader2
                size={13}
                className="animate-spin"
                color="var(--rm-text-muted)"
              />
            )}
            <Toggle
              enabled={privacy.profileVisible}
              onToggle={() => save({ profileVisible: !privacy.profileVisible })}
              disabled={savingKey === "profileVisible"}
            />
          </div>
        </div>

        {/* Show Email */}
        <div
          className="flex items-center justify-between py-3.5"
          style={{ borderBottom: "1px solid rgba(124,58,237,0.1)" }}
        >
          <div>
            <p className="text-white text-sm font-medium">Show Email</p>
            <p
              className="text-xs mt-0.5"
              style={{ color: "var(--rm-text-muted)" }}
            >
              Display your email address on your public profile
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {savingKey === "showEmail" && (
              <Loader2
                size={13}
                className="animate-spin"
                color="var(--rm-text-muted)"
              />
            )}
            <Toggle
              enabled={privacy.showEmail}
              onToggle={() => save({ showEmail: !privacy.showEmail })}
              disabled={savingKey === "showEmail"}
            />
          </div>
        </div>

        {/* Who can message you */}
        <div
          className="py-3.5"
          style={{ borderBottom: "1px solid rgba(124,58,237,0.1)" }}
        >
          <div className="flex items-center gap-2 mb-3">
            <MessageCircle size={15} color="var(--rm-text-muted)" />
            <p className="text-white text-sm font-medium">
              Who can message you
            </p>
            {savingKey === "messagePermission" && (
              <Loader2
                size={13}
                className="animate-spin ml-1"
                color="var(--rm-text-muted)"
              />
            )}
          </div>
          <div className="flex gap-2 flex-wrap">
            {VISIBILITY_OPTIONS.map(({ value, label }) => {
              const active = privacy.messagePermission === value;
              return (
                <button
                  key={value}
                  onClick={() => save({ messagePermission: value })}
                  disabled={savingKey === "messagePermission"}
                  className="rounded-xl px-4 py-2 text-sm transition-all disabled:opacity-60"
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
                  {label}
                </button>
              );
            })}
          </div>
          <p
            className="text-xs mt-2.5"
            style={{ color: "var(--rm-text-muted)" }}
          >
            Doesn't affect conversations you're already in — only who can start
            a new one.
          </p>
        </div>

        {/* Who can see your projects */}
        <div className="py-3.5">
          <div className="flex items-center gap-2 mb-3">
            <LayoutGrid size={15} color="var(--rm-text-muted)" />
            <p className="text-white text-sm font-medium">
              Who can see your projects
            </p>
            {savingKey === "projectVisibility" && (
              <Loader2
                size={13}
                className="animate-spin ml-1"
                color="var(--rm-text-muted)"
              />
            )}
          </div>
          <div className="flex gap-2 flex-wrap">
            {VISIBILITY_OPTIONS.map(({ value, label }) => {
              const active = privacy.projectVisibility === value;
              return (
                <button
                  key={value}
                  onClick={() => save({ projectVisibility: value })}
                  disabled={savingKey === "projectVisibility"}
                  className="rounded-xl px-4 py-2 text-sm transition-all disabled:opacity-60"
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
                  {label}
                </button>
              );
            })}
          </div>
          <p
            className="text-xs mt-2.5"
            style={{ color: "var(--rm-text-muted)" }}
          >
            Collaborators on a project can always see it, regardless of this
            setting.
          </p>
        </div>
      </div>

      <p className="text-xs mt-5" style={{ color: "var(--rm-text-muted)" }}>
        Changes save automatically and take effect immediately.
      </p>
    </div>
  );
};

export default PrivacySection;
