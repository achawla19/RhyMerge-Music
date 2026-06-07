const Card = ({ children, className = "", hover = false }) => {
  return (
    <div
      className={`
        bg-white/[0.03]
        backdrop-blur-xl
        border border-white/10
        rounded-3xl
        p-6
        transition-all duration-300
        ${hover ? "hover:border-purple-500/30 hover:bg-white/[0.05]" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Card;
