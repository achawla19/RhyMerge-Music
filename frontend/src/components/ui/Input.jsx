const Input = ({ label, value, onChange, placeholder, type = "text" }) => {
  return (
    <div className="space-y-2">
      {label && <label className="text-sm text-gray-400">{label}</label>}

      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="
          w-full
          rounded-2xl
          bg-white/[0.03]
          border border-white/10
          px-4 py-3
          text-white
          outline-none
          focus:border-purple-500
          transition
        "
      />
    </div>
  );
};

export default Input;
