export default function Tabs({
  activeTab,
  setActiveTab,
  connectionsCount,
  requestsCount,
}) {
  const tabs = [
    { key: "connections", label: "Syncs", count: connectionsCount },
    { key: "requests", label: "Requests", count: requestsCount },
  ];

  return (
    <div
      className="flex items-center gap-6"
      style={{ borderBottom: "1px solid rgba(124,58,237,0.15)" }}
    >
      {tabs.map((tab) => {
        const active = activeTab === tab.key;
        return (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className="pb-3 text-sm font-medium transition-all flex items-center gap-2"
            style={{
              color: active ? "var(--rm-text-primary)" : "var(--rm-text-muted)",
              borderBottom: active
                ? "2px solid var(--rm-purple)"
                : "2px solid transparent",
            }}
          >
            {tab.label}
            <span
              className="text-[10px] px-1.5 py-0.5 rounded-full"
              style={{
                fontFamily: "var(--rm-font-mono)",
                background: active
                  ? "var(--rm-purple-dim)"
                  : "rgba(255,255,255,0.05)",
                color: active
                  ? "var(--rm-purple-light)"
                  : "var(--rm-text-muted)",
              }}
            >
              {tab.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
