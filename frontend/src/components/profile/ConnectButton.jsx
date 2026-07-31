import { useState } from "react";
import { UserPlus, UserCheck, Loader2 } from "lucide-react";

const API = import.meta.env.VITE_API_URL;

export default function ConnectButton({ profileData, currentUser }) {
  const [status, setStatus] = useState(() => {
    if (!currentUser || !profileData) return "none";
    if (
      profileData.connections?.some(
        (c) => (c._id || c).toString() === currentUser._id?.toString(),
      )
    )
      return "connected";
    if (
      profileData.receivedRequests?.some(
        (r) => (r._id || r).toString() === currentUser._id?.toString(),
      )
    )
      return "pending";
    return "none";
  });
  const [loading, setLoading] = useState(false);

  const handle = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch(
        `${API}/api/connections/request/${profileData._id}`,
        {
          method: "POST",
          credentials: "include",
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg);
      setStatus("pending");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (status === "connected")
    return (
      <span
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm"
        style={{
          background: "rgba(16,185,129,0.1)",
          border: "1px solid rgba(16,185,129,0.3)",
          color: "#34D399",
        }}
      >
        <UserCheck size={14} /> Synced
      </span>
    );

  if (status === "pending")
    return (
      <span
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm"
        style={{
          background: "rgba(245,158,11,0.1)",
          border: "1px solid rgba(245,158,11,0.3)",
          color: "#FBBF24",
        }}
      >
        Request Sent
      </span>
    );

  return (
    <button
      onClick={handle}
      disabled={loading}
      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white transition-all disabled:opacity-50"
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
      {loading ? (
        <Loader2 size={14} className="animate-spin" />
      ) : (
        <UserPlus size={14} />
      )}
      {loading ? "Sending..." : "Sync"}
    </button>
  );
}
