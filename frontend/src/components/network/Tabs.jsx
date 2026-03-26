const Tabs = ({ activeTab, setActiveTab, connectionsCount, requestsCount }) => {
  return (
    <div className="flex justify-center">
      <div className="bg-gray-900 p-1 rounded-xl flex gap-2">
        <button
          onClick={() => setActiveTab("connections")}
          className={`px-4 py-2 rounded-lg ${
            activeTab === "connections" ? "bg-purple-600" : "text-gray-400"
          }`}
        >
          Connections ({connectionsCount})
        </button>

        <button
          onClick={() => setActiveTab("requests")}
          className={`px-4 py-2 rounded-lg ${
            activeTab === "requests" ? "bg-purple-600" : "text-gray-400"
          }`}
        >
          Requests ({requestsCount})
        </button>
      </div>
    </div>
  );
};

export default Tabs;
