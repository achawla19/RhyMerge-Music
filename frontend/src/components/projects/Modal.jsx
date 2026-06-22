const Modal = ({ isOpen, onClose, title, children, wide = false }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-[100] p-4"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <div
        className={`w-full ${wide ? "max-w-xl" : "max-w-md"} p-6 rounded-2xl relative max-h-[88vh] overflow-y-auto`}
        style={{
          background: "var(--rm-bg-card)",
          border: "1px solid var(--rm-border)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
            style={{
              background: "rgba(255,255,255,0.05)",
              color: "var(--rm-text-muted)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#F87171")}
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "var(--rm-text-muted)")
            }
          >
            ✕
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
