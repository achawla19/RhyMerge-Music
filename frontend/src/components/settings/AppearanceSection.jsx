import { useState } from "react";
import { Moon, Sun } from "lucide-react";
import Toggle from "./Toggle";

const accentColors = [
  "bg-purple-500",
  "bg-pink-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-orange-500",
];

const AppearanceSection = () => {
  const [darkMode, setDarkMode] = useState(true);

  return (
    <div>
      <h2 className="text-white font-semibold text-lg mb-1">Appearance</h2>
      <p className="text-gray-500 text-sm mb-5">Customize how RhyMerge looks</p>
      <div className="space-y-5">
        <div className="flex items-center justify-between py-3 border-b border-white/5">
          <div className="flex items-center gap-3">
            {darkMode ? (
              <Moon className="w-4 h-4 text-purple-400" />
            ) : (
              <Sun className="w-4 h-4 text-yellow-400" />
            )}
            <div>
              <p className="text-white text-sm font-medium">Dark Mode</p>
              <p className="text-gray-500 text-xs">
                Currently {darkMode ? "enabled" : "disabled"}
              </p>
            </div>
          </div>
          <Toggle enabled={darkMode} onToggle={() => setDarkMode(!darkMode)} />
        </div>
        <div>
          <p className="text-white text-sm font-medium mb-3">Accent Color</p>
          <div className="flex gap-3">
            {accentColors.map((color) => (
              <button
                key={color}
                className={`w-8 h-8 rounded-full ${color} hover:ring-2 ring-white/50 transition`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default AppearanceSection;
