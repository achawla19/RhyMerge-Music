import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Info, Copy, Check, Calendar, Mail, Hash } from "lucide-react";

const AccountSection = () => {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Unknown";

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(user?._id || "");
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2 className="text-white font-semibold text-lg mb-1">Account</h2>
      <p className="text-sm mb-5" style={{ color: "var(--rm-text-muted)" }}>
        Your core account information
      </p>

      <div
        className="flex items-start gap-2 text-xs rounded-xl px-3 py-2.5 mb-5"
        style={{
          background: "var(--rm-purple-dim)",
          border: "1px solid var(--rm-purple-border)",
          color: "var(--rm-purple-light)",
        }}
      >
        <Info size={14} className="flex-shrink-0 mt-0.5" />
        <span style={{ fontFamily: "var(--rm-font-mono)" }}>
          name, username, and your public details live in the Profile tab
        </span>
      </div>

      <div className="space-y-4">
        {/* Email */}
        <div
          className="flex items-center justify-between p-4 rounded-xl"
          style={{
            background: "var(--rm-bg)",
            border: "1px solid rgba(249,87,111,0.15)",
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: "var(--rm-purple-dim)" }}
            >
              <Mail size={15} color="#FF8B93" />
            </div>
            <div>
              <p className="text-sm text-white">{user?.email || "—"}</p>
              <p
                className="text-[11px]"
                style={{ color: "var(--rm-text-muted)" }}
              >
                account email
              </p>
            </div>
          </div>
          <span
            className="text-[10px] px-2 py-1 rounded-full"
            style={{
              background: "rgba(255,255,255,0.04)",
              color: "var(--rm-text-muted)",
              fontFamily: "var(--rm-font-mono)",
            }}
          >
            not editable yet
          </span>
        </div>

        {/* Member since */}
        <div
          className="flex items-center gap-3 p-4 rounded-xl"
          style={{
            background: "var(--rm-bg)",
            border: "1px solid rgba(249,87,111,0.15)",
          }}
        >
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: "var(--rm-purple-dim)" }}
          >
            <Calendar size={15} color="#FF8B93" />
          </div>
          <div>
            <p className="text-sm text-white">{memberSince}</p>
            <p
              className="text-[11px]"
              style={{ color: "var(--rm-text-muted)" }}
            >
              member since
            </p>
          </div>
        </div>

        {/* Account ID */}
        <div
          className="flex items-center justify-between gap-3 p-4 rounded-xl"
          style={{
            background: "var(--rm-bg)",
            border: "1px solid rgba(249,87,111,0.15)",
          }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: "var(--rm-purple-dim)" }}
            >
              <Hash size={15} color="#FF8B93" />
            </div>
            <div className="min-w-0">
              <p
                className="text-sm text-white truncate"
                style={{ fontFamily: "var(--rm-font-mono)" }}
              >
                {user?._id || "—"}
              </p>
              <p
                className="text-[11px]"
                style={{ color: "var(--rm-text-muted)" }}
              >
                account ID
              </p>
            </div>
          </div>
          <button
            onClick={handleCopyId}
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all"
            style={{
              background: copied
                ? "rgba(16,185,129,0.15)"
                : "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            {copied ? (
              <Check size={14} color="#34D399" />
            ) : (
              <Copy size={14} color="var(--rm-text-muted)" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountSection;
