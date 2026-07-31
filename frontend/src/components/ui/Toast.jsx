import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";

/**
 * Global toast system — replaces every alert()/window.confirm() success-
 * or-failure message in the app. Mount <ToastProvider> once near the root
 * (see main.jsx) and call useToast() anywhere below it.
 *
 *   const toast = useToast();
 *   toast.success("Preferences saved");
 *   toast.error(err.message || "Something went wrong");
 *   toast.info("Heads up — this feature is in beta");
 */

const ToastContext = createContext(null);

const VARIANTS = {
  success: {
    icon: CheckCircle2,
    color: "var(--rm-success)",
    border: "rgba(79,190,138,0.35)",
    bg: "var(--rm-success-dim)",
  },
  error: {
    icon: XCircle,
    color: "var(--rm-error)",
    border: "rgba(229,72,77,0.35)",
    bg: "var(--rm-error-dim)",
  },
  info: {
    icon: Info,
    color: "var(--rm-coral-light)",
    border: "var(--rm-coral-border)",
    bg: "var(--rm-coral-dim)",
  },
};

let idCounter = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const timers = useRef({});

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    clearTimeout(timers.current[id]);
    delete timers.current[id];
  }, []);

  const push = useCallback(
    (type, message, opts = {}) => {
      const id = ++idCounter;
      const duration = opts.duration ?? (type === "error" ? 5000 : 3200);
      setToasts((prev) => [...prev, { id, type, message }]);
      if (duration > 0) {
        timers.current[id] = setTimeout(() => dismiss(id), duration);
      }
      return id;
    },
    [dismiss],
  );

  const api = {
    success: (msg, opts) => push("success", msg, opts),
    error: (msg, opts) => push("error", msg, opts),
    info: (msg, opts) => push("info", msg, opts),
    dismiss,
  };

  return (
    <ToastContext.Provider value={api}>
      {children}
      {createPortal(
        <div
          className="fixed top-4 right-4 z-[200] flex flex-col gap-2 pointer-events-none"
          style={{ maxWidth: "min(92vw, 380px)" }}
        >
          <AnimatePresence>
            {toasts.map((t) => {
              const v = VARIANTS[t.type] || VARIANTS.info;
              const Icon = v.icon;
              return (
                <motion.div
                  key={t.id}
                  layout
                  initial={{ opacity: 0, x: 40, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{
                    opacity: 0,
                    x: 40,
                    scale: 0.95,
                    transition: { duration: 0.15 },
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  className="pointer-events-auto flex items-start gap-2.5 rounded-xl px-4 py-3 shadow-lg backdrop-blur-md"
                  style={{
                    background: "var(--rm-bg-card)",
                    border: `1px solid ${v.border}`,
                    boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
                  }}
                  role="status"
                >
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: v.bg }}
                  >
                    <Icon size={14} color={v.color} />
                  </div>
                  <p
                    className="text-sm flex-1 leading-snug"
                    style={{ color: "var(--rm-text-primary)" }}
                  >
                    {t.message}
                  </p>
                  <button
                    onClick={() => dismiss(t.id)}
                    className="flex-shrink-0 mt-0.5 rounded-md p-0.5 transition-colors"
                    style={{ color: "var(--rm-text-muted)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "var(--rm-text-muted)")
                    }
                    aria-label="Dismiss"
                  >
                    <X size={14} />
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>,
        document.body,
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast() must be used inside <ToastProvider>");
  }
  return ctx;
};
