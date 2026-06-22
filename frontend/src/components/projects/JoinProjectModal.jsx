import { useState } from "react";
import Modal from "./Modal";

export default function JoinProjectModal({
  isOpen,
  onClose,
  project,
  onSubmit,
}) {
  const [role, setRole] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  if (!project) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSending(true);
    try {
      await onSubmit({ role, message });
      setRole("");
      setMessage("");
      onClose();
    } catch (err) {
      setError(err.message || "Failed to send request");
    } finally {
      setSending(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Join Project">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            className="text-xs mb-1.5 block"
            style={{
              fontFamily: "var(--rm-font-mono)",
              color: "var(--rm-text-muted)",
            }}
          >
            Role you'd join as
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
            className="w-full p-3 rounded-xl outline-none transition-all"
            style={{
              background: "var(--rm-bg)",
              border: "1px solid var(--rm-purple-border)",
              color: "var(--rm-text-primary)",
            }}
          >
            <option value="">Select Role</option>
            {project.neededRoles?.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            className="text-xs mb-1.5 block"
            style={{
              fontFamily: "var(--rm-font-mono)",
              color: "var(--rm-text-muted)",
            }}
          >
            Message
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell them why you'd be a good fit..."
            rows={5}
            className="w-full p-3 rounded-xl outline-none resize-none transition-all"
            style={{
              background: "var(--rm-bg)",
              border: "1px solid var(--rm-purple-border)",
              color: "var(--rm-text-primary)",
            }}
          />
        </div>

        {error && (
          <p className="text-xs" style={{ color: "#F87171" }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={sending || !role}
          className="w-full py-3 rounded-xl font-medium text-white transition-all disabled:opacity-50"
          style={{ background: "var(--rm-purple)" }}
          onMouseEnter={(e) =>
            !e.currentTarget.disabled &&
            (e.currentTarget.style.background = "#6D28D9")
          }
          onMouseLeave={(e) =>
            !e.currentTarget.disabled &&
            (e.currentTarget.style.background = "var(--rm-purple)")
          }
        >
          {sending ? "Sending..." : "Send Request"}
        </button>
      </form>
    </Modal>
  );
}
