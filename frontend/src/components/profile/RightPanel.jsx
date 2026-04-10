import { Copy, Check } from "lucide-react";
import { useState } from "react";

const RightPanel = ({ responseTime, certificates, profileUrl }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-5">
      {/* Info Card */}
      <div className="bg-slate-900/30 rounded-xl p-5 border border-slate-800 hover:border-slate-700 transition-all duration-200">
        <h3 className="text-sm font-bold text-white mb-4">Response Time</h3>

        <p className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
          {responseTime}
        </p>

        <p className="text-xs text-slate-400">
          Usually responds within this timeframe to collaboration requests
        </p>
      </div>

      {/* Certificates */}
      <div className="bg-slate-900/30 rounded-xl p-5 border border-slate-800 hover:border-slate-700 transition-all duration-200">
        <h3 className="text-sm font-bold text-white mb-4">Certifications</h3>

        <div className="space-y-2">
          {certificates.map((cert, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 text-xs text-slate-300 bg-purple-600/10 rounded-lg p-2.5 border border-purple-500/20"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
              {cert}
            </div>
          ))}
        </div>
      </div>

      {/* Share Profile */}
      <div className="bg-slate-900/30 rounded-xl p-5 border border-slate-800 hover:border-slate-700 transition-all duration-200">
        <h3 className="text-sm font-bold text-white mb-3">Share Profile</h3>

        <div className="flex gap-2">
          <input
            type="text"
            value={profileUrl}
            readOnly
            className="flex-1 bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-400 focus:outline-none focus:border-purple-500"
          />

          <button
            onClick={handleCopy}
            className="bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 rounded-lg p-2 text-purple-400 transition-all duration-200"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </button>
        </div>
      </div>

      {/* Promo */}
      <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-xl p-5 border border-purple-500/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5" />

        <div className="relative z-10 text-center">
          <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-purple-400 to-pink-400 mx-auto mb-3 flex items-center justify-center text-2xl">
            🎵
          </div>

          <h3 className="text-sm font-bold text-white mb-1">
            Ready to Collaborate?
          </h3>

          <p className="text-xs text-slate-300 mb-4">
            Join thousands of musicians creating amazing tracks together
          </p>

          <button className="w-full py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 text-white text-xs font-semibold hover:from-purple-500 hover:to-pink-400 transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/30">
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default RightPanel;
