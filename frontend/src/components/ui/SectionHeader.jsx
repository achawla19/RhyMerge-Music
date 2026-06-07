const SectionHeader = ({ title, subtitle }) => {
  return (
    <div className="mb-5">
      <h2 className="text-xl font-medium text-white">{title}</h2>

      {subtitle && <p className="text-sm text-gray-400 mt-1">{subtitle}</p>}
    </div>
  );
};

export default SectionHeader;
