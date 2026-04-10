const Button = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  className = "",
}) => {
  const styles = {
    primary: "bg-purple-600 hover:bg-purple-500 text-white",
    secondary:
      "bg-[#111118] border border-gray-700 text-gray-300 hover:border-purple-500 hover:text-white",
    danger: "bg-red-600 hover:bg-red-500 text-white",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`
        px-4 py-2 rounded-lg text-sm font-medium
        transition-all duration-200
        ${styles[variant]}
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default Button;
