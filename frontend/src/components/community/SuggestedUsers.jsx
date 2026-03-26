const suggested = [
  {
    id: 1,
    name: "Alex Storm",
    role: "Guitarist",
    avatar: "https://i.pravatar.cc/150?img=15",
  },
  {
    id: 2,
    name: "Luna Ray",
    role: "Singer",
    avatar: "https://i.pravatar.cc/150?img=20",
  },
];

const SuggestedUsers = () => {
  return (
    <div className="bg-gray-900 p-5 rounded-xl border border-gray-800">
      <h2 className="font-semibold mb-3 flex justify-start">Suggested</h2>

      {suggested.map((user) => (
        <div key={user.id} className="flex items-center gap-3 mb-3 pr-10 pl-10">
          <img src={user.avatar} className="w-10 h-10 rounded-full" />

          <div className="flex-1">
            <p className="text-sm">{user.name}</p>
            <p className="text-xs text-gray-500">{user.role}</p>
          </div>

          <button className="text-xs bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 px-3 py-1 rounded-full hover:bg-gradient-to-r hover:from-purple-500 hover:via-pink-600 hover:to-purple-700 transition">
            Connect
          </button>
        </div>
      ))}
    </div>
  );
};

export default SuggestedUsers;
