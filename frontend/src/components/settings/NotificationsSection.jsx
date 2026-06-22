import { useState } from "react";
import { Info } from "lucide-react";
import Toggle from "./Toggle";

const NotificationsSection = () => {
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(false);
  const [connectionAlerts, setConnectionAlerts] = useState(true);
  const [messageAlerts, setMessageAlerts] = useState(true);

  const items = [
    {
      label: "Email Notifications",
      desc: "receive updates via email",
      state: emailNotifs,
      toggle: () => setEmailNotifs(!emailNotifs),
    },
    {
      label: "Push Notifications",
      desc: "browser push alerts",
      state: pushNotifs,
      toggle: () => setPushNotifs(!pushNotifs),
    },
    {
      label: "Connection Requests",
      desc: "when someone wants to sync",
      state: connectionAlerts,
      toggle: () => setConnectionAlerts(!connectionAlerts),
    },
    {
      label: "New Messages",
      desc: "when you receive a message",
      state: messageAlerts,
      toggle: () => setMessageAlerts(!messageAlerts),
    },
  ];

  return (
    <div>
      <h2 className="text-white font-semibold text-lg mb-1">Notifications</h2>
      <p className="text-sm mb-5" style={{ color: "var(--rm-text-muted)" }}>
        Choose what you get notified about
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
          these preferences aren't saved to your account yet — in-app
          notifications work regardless
        </span>
      </div>

      <div>
        {items.map(({ label, desc, state, toggle }) => (
          <div
            key={label}
            className="flex items-center justify-between py-3"
            style={{ borderBottom: "1px solid rgba(124,58,237,0.1)" }}
          >
            <div>
              <p className="text-white text-sm font-medium">{label}</p>
              <p
                className="text-xs mt-0.5"
                style={{ color: "var(--rm-text-muted)" }}
              >
                {desc}
              </p>
            </div>
            <Toggle enabled={state} onToggle={toggle} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsSection;
