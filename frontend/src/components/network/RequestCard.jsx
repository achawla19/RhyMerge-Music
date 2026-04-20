const RequestCard = ({ data, onAccept, onDecline }) => {
  return (
    <div className="bg-gray-900 p-4 rounded-xl flex items-center gap-4">
      <img src={data.avatar} className="w-12 h-12 rounded-full" />

      <div className="flex-1">
        <p className="font-semibold">{data.name}</p>
        <p className="text-sm text-gray-400">{data.role}</p>
        <p className="text-xs text-gray-500">{data.bio}</p>
      </div>

      <button
        onClick={() => onAccept(data.id)}
        className="bg-purple-500/30 hover:bg-purple-500/70 border border-white/10 rounded-full px-3 py-1 text-white"
      >
        Accept
      </button>

      <button
        onClick={() => onDecline(data.id)}
        className="text-red-400 hover:bg-red-500/15 border border-red-400 rounded-full px-3 py-1"
      >
        Decline
      </button>
    </div>
  );
};

export default RequestCard;
