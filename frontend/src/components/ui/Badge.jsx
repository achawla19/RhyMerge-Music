const Badge = ({ children }) => {
  return (
    <span
      className="
        px-3
        py-1
        rounded-full
        bg-[#F9576F]/10
        border
        border-[#F9576F]/20
        text-[#FFC2C7]
        text-xs
      "
    >
      {children}
    </span>
  );
};

export default Badge;
