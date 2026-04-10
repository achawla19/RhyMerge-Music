import { useState } from "react";
import { Check, Save } from "lucide-react";
import SettingsSidebar from "../components/settings/SettingsSidebar";
import AccountSection from "../components/settings/AccountSection";
import ProfileSection from "../components/settings/ProfileSection";
import AppearanceSection from "../components/settings/AppearanceSection";
import NotificationsSection from "../components/settings/NotificationsSection";
import PrivacySection from "../components/settings/PrivacySection";
import SecuritySection from "../components/settings/SecuritySection";

const sections = {
  account: <AccountSection />,
  profile: <ProfileSection />,
  appearance: <AppearanceSection />,
  notifications: <NotificationsSection />,
  privacy: <PrivacySection />,
  security: <SecuritySection />,
};

const Settings = () => {
  const [activeSection, setActiveSection] = useState("account");
  const [isSaving, setIsSaving] = useState(false);
  const [showSaved, setShowSaved] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowSaved(true);
      setTimeout(() => setShowSaved(false), 2000);
    }, 800);
  };

  return (
    <div className="min-h-screen mx-auto max-w-7xl bg-[#0B2540] text-white px-4 py-6 lg:ml-64">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-4xl font-bold text-transparent">
            Settings
          </h1>
          <p className="text-gray-400 mt-1">
            Manage your account and preferences
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-5 py-2.5 rounded-xl font-medium hover:opacity-90 transition disabled:opacity-60"
        >
          {showSaved ? (
            <>
              <Check className="w-4 h-4" /> Saved
            </>
          ) : isSaving ? (
            "Saving..."
          ) : (
            <>
              <Save className="w-4 h-4" /> Save Changes
            </>
          )}
        </button>
      </div>

      {/* LAYOUT */}
      <div className="flex gap-6">
        <SettingsSidebar active={activeSection} onChange={setActiveSection} />
        <div className="flex-1 bg-gray-900/50 border border-white/5 rounded-2xl p-6">
          {sections[activeSection]}
        </div>
      </div>
    </div>
  );
};
export default Settings;
