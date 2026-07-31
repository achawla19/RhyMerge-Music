const Card = ({ children, className = "", hover = false }) => {
  return (
    <div
      className={`
        rounded-3xl

        bg-white/[0.04]
        backdrop-blur-xl

        border
        border-white/[0.06]

        p-5

        transition-all duration-300

        ${hover ? "hover:bg-white/[0.06] hover:border-[#F9576F]/20" : ""}

        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Card;
