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

  const toggleRole = (role) => {
    setNeededRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role],
    );
  };

  const [lookingForCollaborators, setLookingForCollaborators] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await onCreate({
      title,
      description,
      genre,
      neededRoles,
    });

    setTitle("");
    setDescription("");
    setGenre("");
    setNeededRoles([]);

    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Project">
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Project Name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Midnight Echoes"
        />

        <Textarea
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your project..."
        />

        <Input
          label="Genre"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          placeholder="Lo-Fi"
        />

        {/* NEEDED ROLES */}

        <div>
          <label
            className="
              block
              mb-3

              text-sm
              font-medium

              text-slate-300
            "
          >
            Looking For
          </label>

          <div
            className="
              flex
              flex-wrap
              gap-2
            "
          >
            {AVAILABLE_ROLES.map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => toggleRole(role)}
                className={`
                  px-3 py-2

                  rounded-xl

                  text-sm

                  border

                  transition-all

                  ${
                    neededRoles.includes(role)
                      ? `
                        bg-purple-500/20
                        text-purple-300
                        border-purple-500/30
                      `
                      : `
                        bg-white/[0.03]
                        text-slate-400
                        border-white/[0.08]
                      `
                  }
                `}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        <div
          className="
    flex
    items-center
    justify-between

    rounded-2xl

    bg-white/[0.03]

    border border-white/[0.08]

    px-4 py-3
  "
        >
          <div>
            <p className="text-white text-sm">Looking For Collaborators</p>

            <p className="text-slate-500 text-xs">
              Show this project in opportunity feeds
            </p>
          </div>

          <input
            type="checkbox"
            checked={lookingForCollaborators}
            onChange={(e) => setLookingForCollaborators(e.target.checked)}
            className="w-5 h-5"
          />
        </div>

        <button
          type="submit"
          className="
            w-full

            py-3

            rounded-2xl

            bg-gradient-to-r
            from-purple-600
            to-pink-500

            text-white
            font-medium
          "
        >
          Create Project
        </button>
      </form>
    </Modal>
  );
}
