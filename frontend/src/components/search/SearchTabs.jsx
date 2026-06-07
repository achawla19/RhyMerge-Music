const SearchTabs = ({ activeTab, setActiveTab }) => {
  return (
    <div
      className="
        inline-flex
        rounded-2xl
        bg-white/[0.04]
        border border-white/[0.08]
        p-1
      "
    >
      {["Creators", "Projects"].map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`
            px-5
            py-2
            rounded-xl
            text-sm
            font-medium
            transition-all
            ${
              activeTab === tab
                ? "bg-purple-500/20 text-white"
                : "text-slate-400 hover:text-white"
            }
          `}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default SearchTabs;
