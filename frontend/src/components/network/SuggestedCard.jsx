import { useNavigate } from "react-router-dom";
import { Plus, Check } from "lucide-react";
import { useState } from "react";

const SuggestedCard = ({ data, pending, onConnect }) => {
  const navigate = useNavigate();

  const handleConnect = async (e) => {
    e.stopPropagation();

    try {
      await onConnect(data);

      setPending(true);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-xl p-5 text-center group hover:border-purple-500/30 transition-all duration-300">
      {data.score > 0 && (
        <span
          className="
      text-xs

      px-2 py-1

      rounded-full

      bg-purple-500/15

      text-purple-400
    "
        >
          Match Score {data.score}
        </span>
      )}
      <div
        onClick={() => navigate(`/profile/${data.username}`)}
        className="cursor-pointer"
      >
        <img
          src={
            data.avatar || `https://ui-avatars.com/api/?name=${data.username}`
          }
          className="w-16 h-16 rounded-full mx-auto mb-3 object-cover ring-2 ring-transparent group-hover:ring-purple-500/50 transition"
          alt={data._name}
        />

        <p className="font-semibold text-white group-hover:text-purple-400 transition">
          {data._name || data.username}
        </p>
        <p className="text-sm text-gray-400 mb-4">{data.role}</p>
      </div>

      <button
        onClick={handleConnect}
        disabled={pending}
        className={`w-full flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
          pending
            ? "bg-purple-500/20 border border-purple-500/50 text-purple-400"
            : "bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:opacity-90"
        }`}
      >
        {pending ? (
          <>
            <Check className="w-4 h-4" /> pending
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
