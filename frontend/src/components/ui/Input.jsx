const Input = ({ label, value, onChange, placeholder, type = "text" }) => {
  return (
    <div className="space-y-2">
      {label && (
        <label
          className="text-xs"
          style={{
            fontFamily: "var(--rm-font-mono)",
            color: "var(--rm-text-muted)",
          }}
        >
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-xl px-4 py-3 outline-none transition-all"
        style={{
          background: "var(--rm-bg)",
          border: "1px solid var(--rm-purple-border)",
          color: "var(--rm-text-primary)",
        }}
        onFocus={(e) =>
          (e.currentTarget.style.borderColor = "var(--rm-purple)")
        }
        onBlur={(e) =>
          (e.currentTarget.style.borderColor = "var(--rm-purple-border)")
        }
      />
    </div>
  );
};

export default Input;
