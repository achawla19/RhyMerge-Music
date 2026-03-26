const ConnectionCard = ({ data, statusOptions, onStatusChange, onRemove }) => {
  return (
    <div className="bg-gray-900 p-4 rounded-xl flex items-center gap-4">
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

      <button onClick={() => onRemove(data.id)} className="text-red-400">
        Remove
      </button>
    </div>
  );
};

export default ConnectionCard;
