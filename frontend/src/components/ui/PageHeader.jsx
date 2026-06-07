const PageHeader = ({ title, subtitle, action }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="
              text-4xl
              font-bold
              tracking-tight
              text-white
            "
          >
            {title}
          </h1>

          {subtitle && (
            <p
              className="
                mt-2
                text-[15px]
                text-slate-400
              "
            >
              {subtitle}
            </p>
          )}
        </div>

        {action && <div>{action}</div>}
      </div>
    </div>
  );
};

export default PageHeader;
