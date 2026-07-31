import { useState } from "react";
import Modal from "./Modal";
import Select from "../ui/Select";

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

  const roleOptions = project.neededRoles?.length
    ? project.neededRoles.map((r) => ({ value: r, label: r }))
    : [{ value: "Collaborator", label: "Collaborator" }];

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
          <Select
            value={role}
            onChange={setRole}
            options={roleOptions}
            placeholder="Select a role"
          />
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
            className="w-full p-3 rounded-xl outline-none resize-none transition-all text-sm"
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
            (e.currentTarget.style.background = "#D63850")
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
