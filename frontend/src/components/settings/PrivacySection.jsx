import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Toggle from "./Toggle";

const PrivacySection = () => {
  const [profileVisible, setProfileVisible] = useState(true);
  const [showEmail, setShowEmail] = useState(false);
  const [messagePermission, setMessagePermission] = useState("everyone");

  return (
    <div>
      <h2 className="text-white font-semibold text-lg mb-1">Privacy</h2>
      <p className="text-gray-500 text-sm mb-5">
        Control who can see your content
      </p>
      <div className="space-y-4">
        <div className="flex items-center justify-between py-3 border-b border-white/5">
          <div className="flex items-center gap-3">
            {profileVisible ? (
              <Eye className="w-4 h-4 text-purple-400" />
            ) : (
              <EyeOff className="w-4 h-4 text-gray-400" />
            )}
            <div>
              <p className="text-white text-sm font-medium">Public Profile</p>
              <p className="text-gray-500 text-xs">
                Anyone can view your profile
              </p>
            </div>
          </div>
          <Toggle
            enabled={profileVisible}
            onToggle={() => setProfileVisible(!profileVisible)}
          />
        </div>
        <div className="flex items-center justify-between py-3 border-b border-white/5">
          <div>
            <p className="text-white text-sm font-medium">Show Email</p>
            <p className="text-gray-500 text-xs">
              Display email on your profile
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
          <div className="flex gap-3">
            {["everyone", "connections", "nobody"].map((option) => (
              <button
                key={option}
                onClick={() => setMessagePermission(option)}
                className={`rounded-xl border px-4 py-2 text-sm capitalize transition-all ${
                  messagePermission === option
                    ? "border-purple-500 bg-purple-500/20 text-purple-400"
                    : "border-white/10 bg-white/5 text-gray-400 hover:border-purple-500/30"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default PrivacySection;
