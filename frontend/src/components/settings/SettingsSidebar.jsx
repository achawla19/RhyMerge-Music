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
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: "var(--rm-bg-card)",
        border: "1px solid var(--rm-border)",
      }}
    >
      {navItems.map(({ id, label, icon: Icon }) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            className="w-full flex items-center gap-3 px-4 py-3.5 text-sm font-medium transition-all"
            style={
              isActive
                ? {
                    background: "var(--rm-purple-dim)",
                    color: "var(--rm-purple-light)",
                    borderLeft: "2px solid var(--rm-purple)",
                  }
                : {
                    color: "var(--rm-text-muted)",
                    borderLeft: "2px solid transparent",
                  }
            }
          >
            <Icon size={16} />
            {label}
          </button>
        );
      })}
    </div>
  );
};

export default SettingsSidebar;
