import { useState } from "react";
import Toggle from "./Toggle";

const NotificationsSection = () => {
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(false);
  const [connectionAlerts, setConnectionAlerts] = useState(true);
  const [messageAlerts, setMessageAlerts] = useState(true);

  const items = [
    {
      label: "Email Notifications",
      desc: "Receive updates via email",
      state: emailNotifs,
      toggle: () => setEmailNotifs(!emailNotifs),
    },
    {
      label: "Push Notifications",
      desc: "Browser push alerts",
      state: pushNotifs,
      toggle: () => setPushNotifs(!pushNotifs),
    },
    {
      label: "Connection Requests",
      desc: "When someone wants to connect",
      state: connectionAlerts,
      toggle: () => setConnectionAlerts(!connectionAlerts),
    },
    {
      label: "New Messages",
      desc: "When you receive a message",
      state: messageAlerts,
      toggle: () => setMessageAlerts(!messageAlerts),
    },
  ];

  return (
    <div>
      <h2 className="text-white font-semibold text-lg mb-1">Notifications</h2>
      <p className="text-gray-500 text-sm mb-5">
        Choose what you get notified about
      </p>
      <div className="space-y-1">
        {items.map(({ label, desc, state, toggle }) => (
          <div
            key={label}
            className="flex items-center justify-between py-3 border-b border-white/5"
          >
            <div>
              <p className="text-white text-sm font-medium">{label}</p>
              <p className="text-gray-500 text-xs">{desc}</p>
            </div>
            <Toggle enabled={state} onToggle={toggle} />
          </div>
        ))}
      </div>
    </div>
  );
};
export default NotificationsSection;
