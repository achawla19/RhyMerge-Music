import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search } from "lucide-react";

import ProjectCard from "../components/projects/ProjectCard";
import CreateProjectModal from "../components/projects/CreateProjectModal";
import PageHeader from "../components/ui/PageHeader";

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
    <div className="space-y-6">
      <PageHeader
        title="Open Mixes"
        subtitle={`${projects.length} mix${projects.length === 1 ? "" : "es"} on the platform right now`}
        action={
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl text-white font-medium transition-all"
            style={{ background: "var(--rm-purple)" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#6D28D9")}
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "var(--rm-purple)")
            }
          >
            <Plus size={18} />
            Start a Mix
          </button>
        }
      />

      {/* SEARCH */}
      <div className="relative max-w-lg">
        <Search
          size={17}
          className="absolute left-4 top-1/2 -translate-y-1/2"
          style={{ color: "var(--rm-text-muted)" }}
        />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="search mixes, genres, ideas..."
          className="w-full pl-11 pr-4 py-3 rounded-2xl outline-none transition-all"
          style={{
            background: "var(--rm-bg-card)",
            border: "1px solid var(--rm-purple-border)",
            color: "var(--rm-text-primary)",
            fontFamily: "var(--rm-font-mono)",
            fontSize: 13,
          }}
          onFocus={(e) =>
            (e.currentTarget.style.borderColor = "var(--rm-purple)")
          }
          onBlur={(e) =>
            (e.currentTarget.style.borderColor = "var(--rm-purple-border)")
          }
        />
      </div>

      {/* GRID */}
      {loading ? (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-[210px] rounded-2xl animate-pulse"
              style={{
                background: "var(--rm-bg-card)",
                border: "1px solid var(--rm-border)",
              }}
            />
          ))}
        </div>
      ) : filteredProjects.length === 0 ? (
        <div
          className="text-center py-20 rounded-2xl"
          style={{
            background: "var(--rm-bg-card)",
            border: "1px dashed var(--rm-purple-border)",
          }}
        >
          <p className="text-sm" style={{ color: "var(--rm-text-primary)" }}>
            {search ? "No mixes match that search" : "No mixes yet"}
          </p>
          <p
            className="text-xs mt-1"
            style={{
              fontFamily: "var(--rm-font-mono)",
              color: "var(--rm-text-muted)",
            }}
          >
            {search
              ? "try a different genre or keyword"
              : "be the first to start one"}
          </p>
        </div>
      ) : (
        <motion.div layout className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
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
