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
        className="bg-purple-600 px-3 py-1 rounded"
      >
        Accept
      </button>

      <button onClick={() => onDecline(data.id)} className="text-red-400">
        Decline
      </button>
    </div>
  );
};

export default RequestCard;
