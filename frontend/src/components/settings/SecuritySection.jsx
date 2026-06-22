import { LogOut, Trash2, Loader2, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

const API = import.meta.env.VITE_API_URL;

const SecuritySection = () => {
  const navigate = useNavigate();
  const { logout: clearAuthContext } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Real, working — calls your actual /api/auth/logout endpoint
  const handleLogout = async () => {
    if (!window.confirm("Are you sure you want to log out?")) return;
    try {
      setIsLoggingOut(true);
      await fetch(`${API}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      clearAuthContext();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div>
      <h2 className="text-white font-semibold text-lg mb-1">Security</h2>
      <p className="text-sm mb-5" style={{ color: "var(--rm-text-muted)" }}>
        Keep your account safe
      </p>

      <div
        className="flex items-start gap-2 text-xs rounded-xl px-3 py-2.5 mb-6"
        style={{
          background: "rgba(245,158,11,0.08)",
          border: "1px solid rgba(245,158,11,0.25)",
          color: "#FBBF24",
        }}
      >
        <Info size={14} className="flex-shrink-0 mt-0.5" />
        <span style={{ fontFamily: "var(--rm-font-mono)" }}>
          password changes and account deletion need backend support that
          doesn't exist yet — disabled below to avoid a broken action
        </span>
      </div>

      {/* PASSWORD — disabled, no backend route exists */}
      <div className="space-y-4 mb-6 opacity-50 pointer-events-none">
        {["Current Password", "New Password", "Confirm New Password"].map(
          (label) => (
            <div key={label}>
              <label
                className="text-xs mb-1.5 block"
                style={{
                  fontFamily: "var(--rm-font-mono)",
                  color: "var(--rm-text-muted)",
                }}
              >
                {label}
              </label>
              <input
                type="password"
                disabled
                placeholder="not available yet"
                className="w-full rounded-xl px-4 py-2.5 outline-none"
                style={{
                  background: "var(--rm-bg)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "var(--rm-text-muted)",
                }}
              />
            </div>
          ),
        )}
        <button
          disabled
          className="px-6 py-2.5 rounded-xl font-medium text-white"
          style={{ background: "var(--rm-purple)" }}
        >
          Update Password
        </button>
      </div>

      {/* ACTIONS */}
      <div
        className="pt-5 space-y-3"
        style={{ borderTop: "1px solid rgba(124,58,237,0.12)" }}
      >
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm transition-all disabled:opacity-50"
          style={{
            border: "1px solid var(--rm-purple-border)",
            color: "var(--rm-text-secondary)",
          }}
        >
          {isLoggingOut ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <LogOut size={15} />
          )}
          {isLoggingOut ? "Logging out..." : "Log Out"}
        </button>

        <div className="pt-2">
          <p
            className="text-xs font-medium mb-2"
            style={{ color: "#F87171", fontFamily: "var(--rm-font-mono)" }}
          >
            danger zone
          </p>
          <button
            disabled
            title="Account deletion requires a backend endpoint that doesn't exist yet"
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm opacity-50 cursor-not-allowed"
            style={{
              background: "rgba(248,113,113,0.08)",
              border: "1px solid rgba(248,113,113,0.25)",
              color: "#F87171",
            }}
          >
            <Trash2 size={15} />
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default SecuritySection;
