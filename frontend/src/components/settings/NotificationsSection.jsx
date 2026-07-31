import { useState } from "react";
import {
  Bell,
  Mail,
  Smartphone,
  UserPlus,
  MessageSquare,
  Loader2,
} from "lucide-react";
import Toggle from "./Toggle";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../ui/Toast";
import { updatePreferences } from "../../api/user";

const ROWS = [
  {
    key: "email",
    icon: Mail,
    title: "Email Notifications",
    desc: "Get a summary of activity sent to your inbox",
  },
  {
    key: "push",
    icon: Smartphone,
    title: "Push Notifications",
    desc: "Real-time alerts on this device while you're online",
  },
  {
    key: "connectionRequests",
    icon: UserPlus,
    title: "Connection Requests",
    desc: "When someone wants to connect or join your project",
  },
  {
    key: "messages",
    icon: MessageSquare,
    title: "Messages",
    desc: "When you receive a new direct message",
  },
];

const DEFAULTS = {
  email: true,
  push: false,
  connectionRequests: true,
  messages: true,
};

const NotificationsSection = () => {
  const { user, updateUser } = useAuth();
  const toast = useToast();

  const [prefs, setPrefs] = useState({
    ...DEFAULTS,
    ...(user?.preferences?.notifications || {}),
  });
  const [savingKey, setSavingKey] = useState(null);

  const handleToggle = async (key) => {
    if (savingKey) return; // avoid overlapping saves clobbering each other
    const previous = prefs;
    const next = { ...prefs, [key]: !prefs[key] };
    setPrefs(next); // optimistic
    setSavingKey(key);
    try {
      const { user: updated } = await updatePreferences({
        notifications: next,
      });
      updateUser(updated);
    } catch (err) {
      setPrefs(previous); // roll back this one toggle
      toast.error(err.message || "Couldn't save that setting");
    } finally {
      setSavingKey(null);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-1">
        <Bell size={16} color="#FF8B93" />
        <h2 className="text-white font-semibold text-lg">Notifications</h2>
      </div>
      <p className="text-sm mb-5" style={{ color: "var(--rm-text-muted)" }}>
        Choose what RhyMerge notifies you about
      </p>

      <div className="space-y-1">
        {ROWS.map(({ key, icon: Icon, title, desc }, i) => (
          <div
            key={key}
            className="flex items-center justify-between py-3.5"
            style={{
              borderBottom:
                i < ROWS.length - 1 ? "1px solid rgba(249,87,111,0.1)" : "none",
            }}
          >
            <div className="flex items-center gap-3 min-w-0">
              <Icon
                size={16}
                color="var(--rm-text-muted)"
                className="flex-shrink-0"
              />
              <div className="min-w-0">
                <p className="text-white text-sm font-medium">{title}</p>
                <p
                  className="text-xs mt-0.5"
                  style={{ color: "var(--rm-text-muted)" }}
                >
                  {desc}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {savingKey === key && (
                <Loader2
                  size={13}
                  className="animate-spin"
                  color="var(--rm-text-muted)"
                />
              )}
              <Toggle
                enabled={prefs[key]}
                onToggle={() => handleToggle(key)}
                disabled={savingKey === key}
              />
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs mt-5" style={{ color: "var(--rm-text-muted)" }}>
        Changes save automatically and sync across your devices.
      </p>
    </div>
  );
};

export default NotificationsSection;
