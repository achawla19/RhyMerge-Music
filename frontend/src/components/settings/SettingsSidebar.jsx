import { User, Bell, Lock, Palette, Edit, Shield } from "lucide-react";

const navItems = [
  { id: "account", label: "Account", icon: User },
  { id: "profile", label: "Profile", icon: Edit },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "privacy", label: "Privacy", icon: Shield },
  { id: "security", label: "Security", icon: Lock },
];

const SettingsSidebar = ({ active, onChange }) => {
  return (
    <div className="w-52 shrink-0 space-y-1">
      {navItems.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onChange(id)}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
            active === id
              ? "bg-purple-500/20 text-purple-400"
              : "text-gray-400 hover:bg-white/5 hover:text-white"
          }`}
        >
          <Icon className="w-4 h-4" />
          {label}
        </button>
      ))}
    </div>
  );
};
export default SettingsSidebar;
