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

  if (!project) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Join Project">
      <form
        onSubmit={async (e) => {
          e.preventDefault();

          await onSubmit({
            role,
            message,
          });

          onClose();
        }}
        className="space-y-4"
      >
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
          className="
            w-full
            p-3

            rounded-xl

            bg-[#111827]

            border
            border-white/10
          "
        >
          <option value="">Select Role</option>

          {project.neededRoles?.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell them why you'd be a good fit..."
          rows={5}
          className="
            w-full
            p-3

            rounded-xl

            bg-[#111827]

            border
            border-white/10
          "
        />

        <button
          type="submit"
          className="
            w-full

            py-3

            rounded-xl

            bg-gradient-to-r
            from-purple-600
            to-pink-500
          "
        >
          Send Request
        </button>
      </form>
    </Modal>
  );
}
