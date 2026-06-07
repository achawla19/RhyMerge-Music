import { Copy, Check, Clock, Award, Share2 } from "lucide-react";
import { useState } from "react";

const RightPanel = ({
  responseTime = "Unknown",
  certificates = [],
  profileUrl,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-5">
      {/* Response Time */}
      <div className="bg-[#111118] rounded-2xl p-5 border border-gray-800">
        <div className="flex items-center gap-2 mb-4">
          <Clock size={18} className="text-purple-400" />
          <h3 className="font-semibold text-white">Response Time</h3>
        </div>

        <p className="text-2xl font-bold text-purple-400">{responseTime}</p>

        <p className="text-xs text-gray-500 mt-2">
          Average response time for collaboration requests
        </p>
      </div>

      {/* Certificates */}
      <div className="bg-[#111118] rounded-2xl p-5 border border-gray-800">
        <div className="flex items-center gap-2 mb-4">
          <Award size={18} className="text-purple-400" />
          <h3 className="font-semibold text-white">Certifications</h3>
        </div>

        {certificates.length > 0 ? (
          <div className="space-y-2">
            {certificates.map((cert, index) => (
              <div
                key={index}
                className="text-sm text-gray-300 bg-slate-800 rounded-lg px-3 py-2"
              >
                {cert}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No certifications added yet.</p>
        )}
      </div>

      {/* Share Profile */}
      <div className="bg-[#111118] rounded-2xl p-5 border border-gray-800">
        <div className="flex items-center gap-2 mb-4">
          <Share2 size={18} className="text-purple-400" />
          <h3 className="font-semibold text-white">Share Profile</h3>
        </div>

        <div className="flex gap-2">
          <input
            value={profileUrl}
            readOnly
            className="flex-1 bg-slate-800 border border-gray-700 rounded-lg px-3 py-2 text-xs text-gray-400"
          />

          <button
            onClick={handleCopy}
            className="px-3 rounded-lg bg-purple-600 hover:bg-purple-500 transition-colors"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </button>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-2xl p-5 border border-purple-500/30">
        <div className="text-center">
          <div className="text-4xl mb-3">🎵</div>

          <h3 className="font-semibold text-white mb-2">
            Looking to Collaborate?
          </h3>

          <p className="text-sm text-gray-300 mb-4">
            Connect with musicians, producers and creators.
          </p>

          <button className="w-full py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 text-white font-medium hover:opacity-90 transition-opacity">
            Start Collaborating
          </button>
        </div>
      </div>
    </div>
  );
};

export default RightPanel;
