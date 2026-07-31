import { useState } from "react";
import {
  Shield,
  Eye,
  EyeOff,
  Loader2,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

const API = import.meta.env.VITE_API_URL;

const handle = async (res) => {
  const data = await res.json();
  if (!res.ok) throw new Error(data.msg || "Request failed");
  return data;
};

const inputStyle = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  color: "var(--rm-text-primary)",
  borderRadius: 12,
  padding: "10px 44px 10px 16px",
  width: "100%",
  outline: "none",
  fontSize: 14,
};

const PasswordField = ({
  value,
  onChange,
  placeholder,
  autoComplete = "new-password",
}) => {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        name={`rhymerge-${placeholder?.toLowerCase().replace(/\s+/g, "-")}`}
        style={inputStyle}
        onFocus={(e) =>
          (e.currentTarget.style.borderColor = "var(--rm-purple)")
        }
        onBlur={(e) =>
          (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")
        }
      />
      <button
        type="button"
        onClick={() => setShow((v) => !v)}
        className="absolute right-3 top-1/2 -translate-y-1/2"
        style={{ color: "var(--rm-text-muted)" }}
      >
        {show ? <EyeOff size={15} /> : <Eye size={15} />}
      </button>
    </div>
  );
};

const Toast = ({ msg, type }) => (
  <div
    className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm"
    style={{
      background:
        type === "success" ? "rgba(16,185,129,0.1)" : "rgba(248,113,113,0.1)",
      border: `1px solid ${type === "success" ? "rgba(16,185,129,0.3)" : "rgba(248,113,113,0.3)"}`,
      color: type === "success" ? "#34D399" : "#F87171",
    }}
  >
    {type === "success" ? (
      <CheckCircle2 size={15} />
    ) : (
      <AlertTriangle size={15} />
    )}
    {msg}
  </div>
);

export default function SecuritySection() {
  const [current, setCurrent] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [pwLoading, setPwLoading] = useState(false);
  const [pwMsg, setPwMsg] = useState(null);

  const [deletePass, setDeletePass] = useState("");
  const [delLoading, setDelLoading] = useState(false);
  const [delMsg, setDelMsg] = useState(null);
  const [showDeleteBox, setShowDeleteBox] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPass !== confirm) {
      setPwMsg({ type: "error", text: "Passwords don't match" });
      return;
    }
    if (newPass.length < 8) {
      setPwMsg({ type: "error", text: "Min 8 characters" });
      return;
    }
    setPwLoading(true);
    setPwMsg(null);
    try {
      await handle(
        await fetch(`${API}/api/auth/change-password`, {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            currentPassword: current,
            newPassword: newPass,
          }),
        }),
      );
      setPwMsg({ type: "success", text: "Password updated" });
      setCurrent("");
      setNewPass("");
      setConfirm("");
    } catch (err) {
      setPwMsg({ type: "error", text: err.message });
    } finally {
      setPwLoading(false);
    }
  };

  const handleDeleteAccount = async (e) => {
    e?.preventDefault();
    if (!deletePass) {
      setDelMsg({ type: "error", text: "Enter your password" });
      return;
    }
    setDelLoading(true);
    setDelMsg(null);
    try {
      await handle(
        await fetch(`${API}/api/auth/delete-account`, {
          method: "DELETE",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password: deletePass }),
        }),
      );
      window.location.href = "/login";
    } catch (err) {
      setDelMsg({ type: "error", text: err.message });
      setDelLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 mb-2">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{
            background: "var(--rm-purple-dim)",
            border: "1px solid var(--rm-purple-border)",
          }}
        >
          <Shield size={16} color="#FF8B93" />
        </div>
        <div>
          <h2 className="text-white font-semibold text-lg">Security</h2>
          <p
            className="text-xs"
            style={{
              fontFamily: "var(--rm-font-mono)",
              color: "var(--rm-text-muted)",
            }}
          >
            manage your password and account access
          </p>
        </div>
      </div>

      <div>
        <h3 className="text-white font-medium mb-1">Change Password</h3>
        <p className="text-sm mb-4" style={{ color: "var(--rm-text-muted)" }}>
          Use a strong password of at least 8 characters.
        </p>
        <form
          onSubmit={handleChangePassword}
          className="space-y-3 max-w-md"
          autoComplete="off"
        >
          <PasswordField
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            placeholder="Current password"
          />
          <PasswordField
            value={newPass}
            onChange={(e) => setNewPass(e.target.value)}
            placeholder="New password"
          />
          <PasswordField
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Confirm new password"
          />
          {pwMsg && <Toast msg={pwMsg.text} type={pwMsg.type} />}
          <button
            type="submit"
            disabled={pwLoading || !current || !newPass || !confirm}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white disabled:opacity-40 transition-all"
            style={{ background: "var(--rm-purple)" }}
            onMouseEnter={(e) =>
              !e.currentTarget.disabled &&
              (e.currentTarget.style.background = "#D63850")
            }
            onMouseLeave={(e) =>
              !e.currentTarget.disabled &&
              (e.currentTarget.style.background = "var(--rm-purple)")
            }
          >
            {pwLoading && <Loader2 size={14} className="animate-spin" />}
            {pwLoading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>

      <div style={{ borderTop: "1px solid var(--rm-border)" }} />

      <div>
        <h3 className="font-medium mb-1" style={{ color: "#F87171" }}>
          Delete Account
        </h3>
        <p className="text-sm mb-4" style={{ color: "var(--rm-text-muted)" }}>
          Permanently removes your account. Projects remain visible to
          collaborators for 30 days.
        </p>
        {!showDeleteBox ? (
          <button
            type="button"
            onClick={() => setShowDeleteBox(true)}
            className="px-5 py-2.5 rounded-xl text-sm font-medium transition-all"
            style={{
              background: "rgba(248,113,113,0.08)",
              border: "1px solid rgba(248,113,113,0.25)",
              color: "#F87171",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(248,113,113,0.16)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "rgba(248,113,113,0.08)")
            }
          >
            Delete My Account
          </button>
        ) : (
          <form
            onSubmit={handleDeleteAccount}
            autoComplete="off"
            className="max-w-md p-4 rounded-xl space-y-3"
            style={{
              background: "rgba(248,113,113,0.06)",
              border: "1px solid rgba(248,113,113,0.2)",
            }}
          >
            <p className="text-sm font-medium" style={{ color: "#F87171" }}>
              This cannot be undone. Enter your password to confirm.
            </p>
            <PasswordField
              value={deletePass}
              onChange={(e) => setDeletePass(e.target.value)}
              placeholder="Your password"
              autoComplete="off"
            />
            {delMsg && <Toast msg={delMsg.text} type={delMsg.type} />}
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={delLoading || !deletePass}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium disabled:opacity-40"
                style={{ background: "#DC2626", color: "#fff" }}
              >
                {delLoading && <Loader2 size={13} className="animate-spin" />}
                {delLoading ? "Deleting..." : "Confirm Delete"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowDeleteBox(false);
                  setDeletePass("");
                  setDelMsg(null);
                }}
                className="px-4 py-2 rounded-xl text-sm"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid var(--rm-border)",
                  color: "var(--rm-text-muted)",
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
