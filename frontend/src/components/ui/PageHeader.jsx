const PageHeader = ({ title, subtitle, action }) => {
  return (
    <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p
            className="mt-1.5 text-sm"
            style={{
              color: "var(--rm-text-muted)",
              fontFamily: "var(--rm-font-mono)",
            }}
          >
            {subtitle}
          </p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
};

export default PageHeader;
