import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";

import SettingsSidebar from "../components/settings/SettingsSidebar";
import AccountSection from "../components/settings/AccountSection";
import ProfileSection from "../components/settings/ProfileSection";
import AppearanceSection from "../components/settings/AppearanceSection";
import NotificationsSection from "../components/settings/NotificationsSection";
import PrivacySection from "../components/settings/PrivacySection";
import SecuritySection from "../components/settings/SecuritySection";
import PageHeader from "../components/ui/PageHeader";

const SECTIONS = [
  "account",
  "profile",
  "appearance",
  "notifications",
  "privacy",
  "security",
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
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    if (tab && SECTIONS.includes(tab)) setActive(tab);
  }, [location.search]);

  return (
    <div>
      {/*
        NOTE: the original page had a global "Save Changes" button here that
        only ran a fake setTimeout — it never called any API. Each section
        below manages its own real save action instead (Account + Profile
        actually persist to the backend; the rest are clearly labeled as
        not-yet-supported rather than faking success).
      */}
      <PageHeader
        title="Settings"
        subtitle="manage your account and preferences"
      />

      <div className="grid lg:grid-cols-[220px_1fr] gap-6">
        <SettingsSidebar active={active} onChange={setActive} />

        <motion.div
          key={active}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="rounded-2xl p-6"
          style={{
            background: "var(--rm-bg-card)",
            border: "1px solid var(--rm-border)",
          }}
        >
          {sectionComponents[active]}
        </motion.div>
      </div>
    </div>
  );
}
