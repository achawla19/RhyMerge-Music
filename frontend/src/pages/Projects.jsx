import { useState } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";

import ProjectDetail from "../components/projects/ProjectDetail";
import Modal from "../components/projects/Modal";

const mockProjects = [
  {
    id: 1,
    title: "Neon Dreams",
    genres: ["Synth-Pop"],
    progress: 65,
    status: "In Progress",
    collaborators: ["A", "J"],
  },
  {
    id: 2,
    title: "Urban Flow",
    genres: ["Hip-Hop"],
    progress: 100,
    status: "Completed",
    collaborators: ["S"],
  },
];

const tabs = ["all", "in progress", "completed"];

export default function Projects() {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredProjects = mockProjects.filter((p) =>
    activeTab === "all" ? true : p.status.toLowerCase() === activeTab,
  );

  return (
    <div
      className="min-h-screen px-6 py-6 text-white
    bg-gradient-to-br from-[#0b1220] via-[#0f1c35] to-[#0a0f1f]
    relative overflow-hidden"
    >
      {/* BG GLOW */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600/20 blur-[120px]" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/20 blur-[120px]" />

      <div className="relative">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-semibold">Projects</h1>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-white
            bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500"
          >
            <Plus size={18} />
            New Project
          </motion.button>
        </div>

        {/* FILTER TABS */}
        <div className="flex gap-3 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-full text-sm capitalize transition
                ${
                  activeTab === tab
                    ? "bg-white/10 border border-purple-400/30 text-white"
                    : "bg-white/5 text-gray-400 hover:bg-white/10"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* GRID */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <motion.div
              key={project.id}
              whileHover={{ y: -6, scale: 1.02 }}
              onClick={() => setSelectedProject(project)}
              className="cursor-pointer rounded-xl p-5
              bg-white/10 backdrop-blur-xl border border-white/10
              hover:border-purple-400/30 transition-all"
            >
              {/* GENRES */}
              <div className="flex flex-wrap gap-2 mb-4">
                {project.genres.map((g) => (
                  <span
                    key={g}
                    className="px-2 py-1 text-xs rounded-full
                    bg-white/10 border border-white/10"
                  >
                    {g}
                  </span>
                ))}
              </div>

              {/* TITLE */}
              <h3 className="text-lg font-semibold mb-4">{project.title}</h3>

              {/* PROGRESS */}
              <div className="mb-5">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">Progress</span>
                  <span>{project.progress}%</span>
                </div>

                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${project.progress}%` }}
                    transition={{ duration: 0.8 }}
                    className="h-full bg-gradient-to-r from-purple-500 to-cyan-500"
                  />
                </div>
              </div>

              {/* COLLABS */}
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {project.collaborators.map((c, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-white/20 border border-white/10
                      flex items-center justify-center text-xs"
                    >
                      {c}
                    </div>
                  ))}
                </div>

                <span className="text-xs text-gray-400">
                  {project.collaborators.length} collaborators
                </span>
              </div>

              {/* STATUS */}
              <div className="mt-4 text-xs text-purple-300">
                {project.status}
              </div>
            </motion.div>
          ))}

          {filteredProjects.length === 0 && (
            <div className="col-span-full text-center text-gray-400 py-10">
              No projects found
            </div>
          )}
        </div>
      </div>

      {/* MODAL */}
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
}
