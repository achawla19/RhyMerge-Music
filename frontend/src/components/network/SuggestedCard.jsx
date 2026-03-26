const SuggestedCard = ({ data, onConnect }) => {
  return (
    <div className="bg-gray-900 p-4 rounded-xl text-center">
      <img src={data.avatar} className="w-14 h-14 rounded-full mx-auto mb-2" />

      <p className="font-semibold">{data.name}</p>
      <p className="text-sm text-gray-400 mb-3">{data.role}</p>

      <button
        onClick={() => onConnect(data)}
        className="bg-purple-600 px-4 py-1 rounded"
      >
        Connect
      </button>
    </div>
  );
};

export default SuggestedCard;
