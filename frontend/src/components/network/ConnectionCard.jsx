const ConnectionCard = ({ data, statusOptions, onStatusChange, onRemove }) => {
  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-4 flex items-center gap-4">
      <img src={data.avatar} className="w-12 h-12 rounded-full" />

      <div className="flex-1">
        <p className="font-semibold">{data.name}</p>
        <p className="text-sm text-gray-400">{data.role}</p>
      </div>

      <select
        value={data.status}
        onChange={(e) => onStatusChange(data.id, e.target.value)}
        className="bg-gray-800 px-2 py-1 rounded"
      >
        {statusOptions.map((s) => (
          <option key={s}>{s}</option>
        ))}
      </select>

      <button
        onClick={() => onRemove(data.id)}
        className="text-sm bg-white/5 border border-purple-400/30 px-3 py-1 rounded-md"
      >
        Remove
      </button>
    </div>
  );
};

export default ConnectionCard;
