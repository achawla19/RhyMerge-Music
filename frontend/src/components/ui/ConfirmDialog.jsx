import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, HelpCircle } from "lucide-react";

/**
 * Global confirmation dialog — replaces every window.confirm() in the app.
 * Mount <ConfirmProvider> once near the root (see main.jsx) and call
 * useConfirm() anywhere below it. Returns a Promise<boolean>.
 *
 *   const confirm = useConfirm();
 *   const ok = await confirm({
 *     title: 'Delete this stem?',
 *     message: 'This cannot be undone.',
 *     confirmText: 'Delete',
 *     tone: 'danger',
 *   });
 *   if (!ok) return;
 */

const ConfirmContext = createContext(null);

export const ConfirmProvider = ({ children }) => {
  const [state, setState] = useState(null); // { title, message, confirmText, cancelText, tone, resolve }
  const confirmBtnRef = useRef(null);

  const confirm = useCallback((opts) => {
    return new Promise((resolve) => {
      setState({
        title: opts.title || "Are you sure?",
        message: opts.message || "",
        confirmText: opts.confirmText || "Confirm",
        cancelText: opts.cancelText || "Cancel",
        tone: opts.tone || "default", // 'default' | 'danger'
        resolve,
      });
    });
  }, []);

  const close = useCallback(
    (result) => {
      state?.resolve?.(result);
      setState(null);
    },
    [state],
  );

  useEffect(() => {
    if (!state) return;
    confirmBtnRef.current?.focus();
    const onKey = (e) => {
      if (e.key === "Escape") close(false);
      if (e.key === "Enter") close(true);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [state, close]);

  const danger = state?.tone === "danger";

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {createPortal(
        <AnimatePresence>
          {state && (
            <motion.div
              className="fixed inset-0 z-[210] flex items-center justify-center p-4"
              style={{
                background: "rgba(0,0,0,0.7)",
                backdropFilter: "blur(6px)",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={() => close(false)}
            >
              <motion.div
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="confirm-dialog-title"
                initial={{ opacity: 0, scale: 0.94, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 8 }}
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
                className="w-full max-w-sm rounded-2xl p-6"
                style={{
                  background: "var(--rm-bg-card)",
                  border: `1px solid ${danger ? "rgba(248,113,113,0.3)" : "var(--rm-border)"}`,
                  boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-start gap-3 mb-2">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: danger
                        ? "rgba(248,113,113,0.1)"
                        : "var(--rm-purple-dim)",
                      border: `1px solid ${danger ? "rgba(248,113,113,0.3)" : "var(--rm-purple-border)"}`,
                    }}
                  >
                    {danger ? (
                      <AlertTriangle size={16} color="#F87171" />
                    ) : (
                      <HelpCircle size={16} color="#C084FC" />
                    )}
                  </div>
                  <div className="min-w-0 pt-1">
                    <h3
                      id="confirm-dialog-title"
                      className="text-white font-semibold text-base leading-snug"
                    >
                      {state.title}
                    </h3>
                    {state.message && (
                      <p
                        className="text-sm mt-1.5 leading-relaxed"
                        style={{ color: "var(--rm-text-secondary)" }}
                      >
                        {state.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => close(false)}
                    className="flex-1 py-2.5 rounded-xl text-sm text-white transition-all"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background =
                        "rgba(255,255,255,0.08)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background =
                        "rgba(255,255,255,0.04)")
                    }
                  >
                    {state.cancelText}
                  </button>
                  <button
                    ref={confirmBtnRef}
                    onClick={() => close(true)}
                    className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white transition-all"
                    style={{
                      background: danger ? "#DC2626" : "var(--rm-purple)",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = danger
                        ? "#B91C1C"
                        : "#6D28D9")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = danger
                        ? "#DC2626"
                        : "var(--rm-purple)")
                    }
                  >
                    {state.confirmText}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </ConfirmContext.Provider>
  );
};

export const useConfirm = () => {
  const ctx = useContext(ConfirmContext);
  if (!ctx) {
    throw new Error("useConfirm() must be used inside <ConfirmProvider>");
  }
  return ctx;
};
