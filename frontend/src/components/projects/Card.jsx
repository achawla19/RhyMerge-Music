const Card = ({ children, className = "", hover = false }) => {
  return (
    <div
      className={`
        bg-[#111118] border border-gray-800 rounded-xl p-5
        ${hover ? "hover:border-purple-500 hover:shadow-lg hover:shadow-purple-500/10 transition" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Card;
