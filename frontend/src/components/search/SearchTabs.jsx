const SearchTabs = ({ activeTab, setActiveTab }) => {
  return (
    <div
      className="inline-flex rounded-2xl p-1"
      style={{
        background: "var(--rm-bg-card)",
        border: "1px solid var(--rm-border)",
      }}
    >
      {["Creators", "Projects"].map((tab) => {
        const active = activeTab === tab;
        return (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="px-5 py-2 rounded-xl text-sm font-medium transition-all"
            style={
              active
                ? {
                    background: "var(--rm-purple-dim)",
                    color: "var(--rm-text-primary)",
                  }
                : { color: "var(--rm-text-muted)" }
            }
          >
            {tab === "Creators" ? "Stems" : "Mixes"}
          </button>
        );
      })}
    </div>
  );
};

export default SearchTabs;
