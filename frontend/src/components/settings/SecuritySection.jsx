import { LogOut, Trash2 } from "lucide-react";

const SecuritySection = () => {
  return (
    <div>
      <h2 className="text-white font-semibold text-lg mb-1">Security</h2>
      <p className="text-gray-500 text-sm mb-5">Keep your account safe</p>

      <div className="space-y-4 mb-6">
        <div>
          <label className="text-gray-400 text-sm mb-1 block">
            Current Password
          </label>
          <input
            type="password"
            placeholder="Enter current password"
            className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 outline-none focus:border-purple-500 transition placeholder-gray-600"
          />
        </div>
        <div>
          <label className="text-gray-400 text-sm mb-1 block">
            New Password
          </label>
          <input
            type="password"
            placeholder="Enter new password"
            className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 outline-none focus:border-purple-500 transition placeholder-gray-600"
          />
        </div>
        <div>
          <label className="text-gray-400 text-sm mb-1 block">
            Confirm New Password
          </label>
          <input
            type="password"
            placeholder="Confirm new password"
            className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 outline-none focus:border-purple-500 transition placeholder-gray-600"
          />
        </div>
        <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-xl font-medium transition">
          Update Password
        </button>
      </div>

      <div className="border-t border-white/5 pt-5 space-y-3">
        <button className="w-full flex items-center justify-center gap-2 border border-white/10 text-gray-400 hover:text-white px-4 py-2.5 rounded-xl text-sm transition">
          <LogOut className="w-4 h-4" /> Log Out
        </button>
        <div className="pt-2">
          <p className="text-red-400 text-xs font-medium mb-2">Danger Zone</p>
          <button className="w-full flex items-center justify-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 px-4 py-2.5 rounded-xl text-sm transition">
            <Trash2 className="w-4 h-4" /> Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};
export default SecuritySection;
