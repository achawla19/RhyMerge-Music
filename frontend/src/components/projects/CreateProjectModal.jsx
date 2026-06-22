import { useState } from "react";
import Modal from "./Modal";
import Input from "../ui/Input";
import Textarea from "../ui/Textarea";

const AVAILABLE_ROLES = [
  "Singer",
  "Producer",
  "Guitarist",
  "Drummer",
  "Bassist",
  "Pianist",
  "Songwriter",
  "Mixing Engineer",
  "Mastering Engineer",
];

export default function CreateProjectModal({ isOpen, onClose, onCreate }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("");
  const [neededRoles, setNeededRoles] = useState([]);
  const [lookingForCollaborators, setLookingForCollaborators] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const toggleRole = (role) => {
    setNeededRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role],
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onCreate({
        title,
        description,
        genre,
        neededRoles,
        lookingForCollaborators,
      });
      setTitle("");
      setDescription("");
      setGenre("");
      setNeededRoles([]);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Start a Mix">
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Project name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Midnight Echoes"
        />

        <Textarea
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="what's this mix about?"
        />

        <Input
          label="Genre"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          placeholder="Lo-Fi"
        />

        <div>
          <label
            className="block mb-3 text-xs"
            style={{
              fontFamily: "var(--rm-font-mono)",
              color: "var(--rm-text-muted)",
            }}
          >
            looking for
          </label>
          <div className="flex flex-wrap gap-2">
            {AVAILABLE_ROLES.map((role) => {
              const active = neededRoles.includes(role);
              return (
                <button
                  key={role}
                  type="button"
                  onClick={() => toggleRole(role)}
                  className="px-3 py-2 rounded-xl text-sm transition-all"
                  style={
                    active
                      ? {
                          background: "var(--rm-purple-dim)",
                          color: "var(--rm-purple-light)",
                          border: "1px solid var(--rm-purple-border)",
                        }
                      : {
                          background: "rgba(255,255,255,0.03)",
                          color: "var(--rm-text-muted)",
                          border: "1px solid rgba(255,255,255,0.08)",
                        }
                  }
                >
                  {role}
                </button>
              );
            })}
          </div>
        </div>

        <div
          className="flex items-center justify-between rounded-2xl px-4 py-3"
          style={{
            background: "var(--rm-bg)",
            border: "1px solid var(--rm-purple-border)",
          }}
        >
          <div>
            <p className="text-white text-sm">Open for collaborators</p>
            <p
              className="text-xs mt-0.5"
              style={{
                color: "var(--rm-text-muted)",
                fontFamily: "var(--rm-font-mono)",
              }}
            >
              show this mix in open mixes
            </p>
          </div>
          <input
            type="checkbox"
            checked={lookingForCollaborators}
            onChange={(e) => setLookingForCollaborators(e.target.checked)}
            className="w-5 h-5 accent-[#7C3AED]"
          />
        </div>

        <button
          type="submit"
          disabled={submitting || !title.trim()}
          className="w-full py-3 rounded-2xl text-white font-medium transition-all disabled:opacity-40"
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
          {submitting ? "creating..." : "Create Mix"}
        </button>
      </form>
    </Modal>
  );
}
