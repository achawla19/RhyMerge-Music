const Badge = ({ children }) => {
  return (
    <span
      className="
        px-3
        py-1
        rounded-full
        bg-purple-500/10
        border
        border-purple-500/20
        text-purple-300
        text-xs
      "
    >
      {children}
    </span>
  );
};

export default Badge;
