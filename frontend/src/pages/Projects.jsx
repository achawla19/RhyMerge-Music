import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search } from "lucide-react";

import ProjectCard from "../components/projects/ProjectCard";

import CreateProjectModal from "../components/projects/CreateProjectModal";

import PageHeader from "../components/ui/PageHeader";
import Input from "../components/ui/Input";

import { getProjects, createProject } from "../api/projects";

export default function Projects() {
  const [projects, setProjects] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadProjects = async () => {
    try {
      setLoading(true);

      const data = await getProjects();

      setProjects(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const q = search.toLowerCase();

      return (
        project.title?.toLowerCase().includes(q) ||
        project.genre?.toLowerCase().includes(q) ||
        project.description?.toLowerCase().includes(q)
      );
    });
  }, [projects, search]);

  const handleCreateProject = async (payload) => {
    try {
      const project = await createProject(payload);

      setProjects((prev) => [project, ...prev]);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Projects"
        subtitle="Discover and manage music collaborations"
        action={
          <button
            onClick={() => setIsModalOpen(true)}
            className="
              flex items-center gap-2
              px-5 py-3

              rounded-2xl

              bg-gradient-to-r
              from-purple-600
              to-pink-500

              text-white
              font-medium

              hover:scale-[1.02]
              transition-all
            "
          >
            <Plus size={18} />
            New Project
          </button>
        }
      />

      {/* SEARCH */}

      <div className="relative max-w-lg">
        <Search
          size={18}
          className="
            absolute
            left-4
            top-1/2
            -translate-y-1/2
            text-slate-500
          "
        />

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search projects..."
          className="
            w-full

            pl-12
            pr-4
            py-3

            rounded-2xl

            bg-white/[0.04]
            border border-white/[0.08]

            text-white

            outline-none

            focus:border-purple-500/40
          "
        />
      </div>

      {/* GRID */}

      {loading ? (
        <div className="text-center py-20 text-slate-400">
          Loading projects...
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          No projects found
        </div>
      ) : (
        <motion.div
          layout
          className="
            grid

            md:grid-cols-2
            xl:grid-cols-3

            gap-5
          "
        >
          {filteredProjects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </motion.div>
      )}

      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateProject}
      />
    </div>
  );
}
