import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, Save, User, Palette, Bell, Lock } from "lucide-react";
import { useLocation } from "react-router-dom";

import AccountSection from "../components/settings/AccountSection";
import ProfileSection from "../components/settings/ProfileSection";
import AppearanceSection from "../components/settings/AppearanceSection";
import NotificationsSection from "../components/settings/NotificationsSection";
import PrivacySection from "../components/settings/PrivacySection";
import SecuritySection from "../components/settings/SecuritySection";

const SECTIONS = [
  { id: "account", label: "Account", icon: User },
  { id: "profile", label: "Profile", icon: User },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "privacy", label: "Privacy", icon: Lock },
  { id: "security", label: "Security", icon: Lock },
];

const sectionComponents = {
  account: <AccountSection />,
  profile: <ProfileSection />,
  appearance: <AppearanceSection />,
  notifications: <NotificationsSection />,
  privacy: <PrivacySection />,
  security: <SecuritySection />,
};

export default function Settings() {
  const [active, setActive] = useState("account");
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab"); // ✅ FIXED

    if (tab && SECTIONS.some((s) => s.id === tab)) {
      setActive(tab); // ✅ FIXED
    }
  }, [location.search]);

  const handleSave = () => {
    setIsSaving(true);

    setTimeout(() => {
      setIsSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 800);
  };

  return (
    <div
      className="min-h-screen px-6 py-6 text-white
    bg-gradient-to-br from-[#0b1220] via-[#0f1c35] to-[#0a0f1f]
    relative overflow-visible"
    >
      {/* BG GLOW */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600/20 blur-[120px]" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/20 blur-[120px]" />

      <div className="relative max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-semibold">Settings</h1>
            <p className="text-gray-400 text-sm">
              Manage your account and preferences
            </p>
          </div>

          {/* SAVE BUTTON */}
          <motion.button
            onClick={handleSave}
            disabled={isSaving}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-white font-medium
            bg-white/30   hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-400
hover:bg-clip-text hover:text-transparent hover:opacity-90 transition
            disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saved ? (
              <>
                <Check size={16} /> Saved
              </>
            ) : isSaving ? (
              "Saving..."
            ) : (
              <>
                <Save size={16} /> Save Changes
              </>
            )}
          </motion.button>
        </div>

        {/* LAYOUT */}
        <div className="grid lg:grid-cols-[240px_1fr] gap-6">
          {/* SIDEBAR */}
          <div className="rounded-xl bg-black/30 backdrop-blur-xl border border-white/10 overflow-hidden">
            {SECTIONS.map((s) => {
              const Icon = s.icon;

              return (
                <button
                  key={s.id}
                  onClick={() => setActive(s.id)}
                  className={`w-full flex items-center gap-3 px-4 py-4 text-sm transition
                    ${
                      active === s.id
                        ? "bg-white/10 border-l-2 border-purple-400 text-white"
                        : "text-gray-400 hover:bg-white/5 hover:text-white"
                    }`}
                >
                  <Icon size={18} />
                  {s.label}
                </button>
              );
            })}
          </div>

          {/* CONTENT */}
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="rounded-xl p-6
            bg-white/10 backdrop-blur-xl border border-white/10"
          >
            {sectionComponents[active]}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
