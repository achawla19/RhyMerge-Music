import { useState } from "react";

import Modal from "./Modal";

import Input from "../ui/Input";
import Textarea from "../ui/Textarea";

export default function CreateProjectModal({ isOpen, onClose, onCreate }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    await onCreate({
      title,
      description,
      genre,
    });

    setTitle("");
    setDescription("");
    setGenre("");

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
