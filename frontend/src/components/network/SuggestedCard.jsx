import { useNavigate } from "react-router-dom";
import { Plus, Check } from "lucide-react";
import { useState } from "react";

const SuggestedCard = ({ data, onConnect }) => {
  const navigate = useNavigate();
  const [connected, setConnected] = useState(false);

  const handleConnect = (e) => {
    e.stopPropagation();
    onConnect(data);
    setConnected(true);
  };

  return (
    <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-xl p-5 text-center group hover:border-purple-500/30 transition-all duration-300">
      <div
        onClick={() => navigate(`/profile/${data.username}`)}
        className="cursor-pointer"
      >
        <img
          src={data.avatar}
          className="w-16 h-16 rounded-full mx-auto mb-3 object-cover ring-2 ring-transparent group-hover:ring-purple-500/50 transition"
          alt={data.name}
        />

        <p className="font-semibold text-white group-hover:text-purple-400 transition">
          {data.name}
        </p>
        <p className="text-sm text-gray-400 mb-4">{data.role}</p>
      </div>

      <button
        onClick={handleConnect}
        disabled={connected}
        className={`w-full flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
          connected
            ? "bg-purple-500/20 border border-purple-500/50 text-purple-400"
            : "bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:opacity-90"
        }`}
      >
        {connected ? (
          <>
            <Check className="w-4 h-4" /> Connected
          </>
        ) : (
          <>
            <Plus className="w-4 h-4" /> Connect
          </>
        )}
      </button>
    </div>
  );
};

export default SuggestedCard;
