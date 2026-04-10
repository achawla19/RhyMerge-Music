import { useState } from "react";
import ProjectCard from "../components/projects/ProjectCard";
import ProjectDetail from "../components/projects/ProjectDetail";
import Modal from "../components/projects/Modal";
import Button from "../components/projects/Button";
import Card from "../components/projects/Card";

const mockProjects = [
  {
    id: 1,
    title: "Neon Dreams",
    description: "A synth-pop collaboration blending electronic sounds.",
    genre: "Synth-Pop",
    status: "In Progress",
    date: "Mar 15, 2024",
    timeline: "4 weeks",
    collaborators: [
      { name: "Alex", avatar: "/assets/who1.jpg" },
      { name: "Jordan", avatar: "/assets/who1.jpg" },
    ],
  },
  {
    id: 2,
    title: "Urban Flow",
    description: "Hip-hop track with layered beats.",
    genre: "Hip-Hop",
    status: "Completed",
    date: "Feb 20, 2024",
    timeline: "3 weeks",
    collaborators: [{ name: "Sam", avatar: "/assets/who1.jpg" }],
  },
];

const Projects = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [genre, setGenre] = useState("All");

  const genres = ["All", "Synth-Pop", "Hip-Hop"];

  const filteredProjects = mockProjects.filter((p) =>
    genre === "All" ? true : p.genre === genre,
  );

  return (
    <div className="min-h-screen bg-[#0a0a12] text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Projects</h1>

          <Button onClick={() => setIsModalOpen(true)}>+ New Project</Button>
        </div>

        {/* FILTER */}
        <div className="flex gap-2 mb-6">
          {genres.map((g) => (
            <button
              key={g}
              onClick={() => setGenre(g)}
              className={`px-3 py-1 rounded-full text-sm ${
                genre === g
                  ? "bg-purple-600 text-white"
                  : "bg-[#111118] text-gray-400"
              }`}
            >
              {g}
            </button>
          ))}
        </div>

        {/* GRID */}
        {filteredProjects.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={() => setSelectedProject(project)}
              />
            ))}
          </div>
        ) : (
          <Card className="text-center py-10">No projects found</Card>
        )}
      </div>

      {/* CREATE MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Project"
      >
        <p className="text-gray-400 text-sm">
          (Form comes later when backend is ready)
        </p>
      </Modal>

      {/* DETAIL */}
      {selectedProject && (
        <ProjectDetail
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </div>
  );
};

export default Projects;
