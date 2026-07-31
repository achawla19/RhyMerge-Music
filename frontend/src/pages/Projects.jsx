import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  X,
  CheckCircle2,
} from "lucide-react";

import ProjectCard from "../components/projects/ProjectCard";
import CreateProjectModal from "../components/projects/CreateProjectModal";
import PageHeader from "../components/ui/PageHeader";

import { getProjects, searchProjects, createProject } from "../api/projects";
import { useProjectPanel } from "../context/ProjectPanelContext";

const GENRES = [
  "Hip-Hop",
  "R&B",
  "Pop",
  "Electronic",
  "Rock",
  "Jazz",
  "Classical",
  "Afrobeats",
  "Lo-Fi",
  "Trap",
];
const STATUSES = ["Planning", "Recording", "Production", "Mixing", "Completed"];

// Simple toast — no external dep
const Toast = ({ msg, onDone }) => {
  useEffect(() => {
    const t = setTimeout(onDone, 3500);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 24 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-5 py-3 rounded-2xl shadow-xl"
      style={{
        background: "rgba(16,185,129,0.15)",
        border: "1px solid rgba(16,185,129,0.4)",
        color: "#34D399",
      }}
    >
      <CheckCircle2 size={16} />
      <span className="text-sm font-medium">{msg}</span>
    </motion.div>
  );
};

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({ genre: "", status: "" });
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState("");

  const { openPanel, consumePendingId } = useProjectPanel();

  // On mount: if we were redirected from /projects/:id, open that panel
  useEffect(() => {
    const pendingId = consumePendingId();
    if (pendingId) openPanel(pendingId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isFiltering = search.trim() || filters.genre || filters.status;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      if (isFiltering) {
        const data = await searchProjects({
          q: search,
          genre: filters.genre,
          status: filters.status,
        });
        setProjects(data);
        setTotal(data.length);
        setPages(1);
      } else {
        const data = await getProjects(page, 18);
        setProjects(data.projects);
        setTotal(data.total);
        setPages(data.pages);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, filters, page, isFiltering]);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [load]);

  const handleCreate = async (payload) => {
    try {
      const project = await createProject(payload);
      setProjects((prev) => [project, ...prev]);
      setTotal((t) => t + 1);
      setToast(`"${project.title}" created — let's go!`);
    } catch (err) {
      throw err; // bubble up to modal to show inline error
    }
  };

  const clearFilters = () => {
    setSearch("");
    setFilters({ genre: "", status: "" });
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Projects"
        subtitle={`${total} project${total === 1 ? "" : "s"} on the platform`}
        action={
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl text-white font-medium transition-all"
            style={{ background: "var(--rm-purple)" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#D63850")}
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "var(--rm-purple)")
            }
          >
            <Plus size={18} />
            Post a Project
          </button>
        }
      />

      {/* SEARCH + FILTERS */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[220px] max-w-lg">
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2"
            style={{ color: "var(--rm-text-muted)" }}
          />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="search projects, genres, ideas..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl outline-none"
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
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-4 top-1/2 -translate-y-1/2"
              style={{ color: "var(--rm-text-muted)" }}
            >
              <X size={13} />
            </button>
          )}
        </div>

        <button
          onClick={() => setFiltersOpen((v) => !v)}
          className="flex items-center gap-2 px-4 py-3 rounded-2xl text-sm transition-all"
          style={{
            background:
              filtersOpen || filters.genre || filters.status
                ? "var(--rm-purple-dim)"
                : "var(--rm-bg-card)",
            border:
              filtersOpen || filters.genre || filters.status
                ? "1px solid var(--rm-purple-border)"
                : "1px solid var(--rm-border)",
            color:
              filtersOpen || filters.genre || filters.status
                ? "var(--rm-purple-light)"
                : "var(--rm-text-muted)",
          }}
        >
          <SlidersHorizontal size={15} />
          Filters
          {(filters.genre || filters.status) && (
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: "var(--rm-purple)" }}
            />
          )}
        </button>

        {(search || filters.genre || filters.status) && (
          <button
            onClick={clearFilters}
            className="px-4 py-3 rounded-2xl text-sm flex items-center gap-1.5 transition-all"
            style={{
              background: "rgba(248,113,113,0.08)",
              border: "1px solid rgba(248,113,113,0.2)",
              color: "#F87171",
            }}
          >
            <X size={13} /> Clear
          </button>
        )}
      </div>

      {/* FILTER PANEL */}
      <AnimatePresence>
        {filtersOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div
              className="rounded-2xl p-5 space-y-4"
              style={{
                background: "var(--rm-bg-card)",
                border: "1px solid var(--rm-border)",
              }}
            >
              {/* Genre */}
              <div>
                <p
                  className="text-xs mb-2"
                  style={{
                    fontFamily: "var(--rm-font-mono)",
                    color: "var(--rm-text-muted)",
                  }}
                >
                  genre
                </p>
                <div className="flex flex-wrap gap-2">
                  {GENRES.map((g) => (
                    <button
                      key={g}
                      onClick={() => {
                        setFilters((f) => ({
                          ...f,
                          genre: f.genre === g ? "" : g,
                        }));
                        setPage(1);
                      }}
                      className="px-3 py-1.5 rounded-xl text-sm transition-all"
                      style={
                        filters.genre === g
                          ? {
                              background: "var(--rm-purple-dim)",
                              border: "1px solid var(--rm-purple-border)",
                              color: "var(--rm-purple-light)",
                            }
                          : {
                              background: "rgba(255,255,255,0.03)",
                              border: "1px solid rgba(255,255,255,0.08)",
                              color: "var(--rm-text-muted)",
                            }
                      }
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status */}
              <div>
                <p
                  className="text-xs mb-2"
                  style={{
                    fontFamily: "var(--rm-font-mono)",
                    color: "var(--rm-text-muted)",
                  }}
                >
                  status
                </p>
                <div className="flex flex-wrap gap-2">
                  {STATUSES.map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        setFilters((f) => ({
                          ...f,
                          status: f.status === s ? "" : s,
                        }));
                        setPage(1);
                      }}
                      className="px-3 py-1.5 rounded-xl text-sm transition-all"
                      style={
                        filters.status === s
                          ? {
                              background: "var(--rm-purple-dim)",
                              border: "1px solid var(--rm-purple-border)",
                              color: "var(--rm-purple-light)",
                            }
                          : {
                              background: "rgba(255,255,255,0.03)",
                              border: "1px solid rgba(255,255,255,0.08)",
                              color: "var(--rm-text-muted)",
                            }
                      }
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
      ) : projects.length === 0 ? (
        <div
          className="text-center py-20 rounded-2xl"
          style={{
            background: "var(--rm-bg-card)",
            border: "1px dashed var(--rm-purple-border)",
          }}
        >
          <p className="text-sm" style={{ color: "var(--rm-text-primary)" }}>
            {isFiltering
              ? "No projects match those filters"
              : "No projects yet"}
          </p>
          <p
            className="text-xs mt-1"
            style={{
              fontFamily: "var(--rm-font-mono)",
              color: "var(--rm-text-muted)",
            }}
          >
            {isFiltering
              ? "try adjusting your search or filters"
              : "be the first to start one"}
          </p>
        </div>
      ) : (
        <motion.div layout className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {projects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </motion.div>
      )}

      {/* PAGINATION */}
      {!isFiltering && pages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all disabled:opacity-30"
            style={{
              background: "var(--rm-bg-card)",
              border: "1px solid var(--rm-border)",
              color: "var(--rm-text-muted)",
            }}
          >
            <ChevronLeft size={16} />
          </button>

          <span
            className="text-sm"
            style={{
              fontFamily: "var(--rm-font-mono)",
              color: "var(--rm-text-muted)",
            }}
          >
            {page} / {pages}
          </span>

          <button
            onClick={() => setPage((p) => Math.min(pages, p + 1))}
            disabled={page === pages}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all disabled:opacity-30"
            style={{
              background: "var(--rm-bg-card)",
              border: "1px solid var(--rm-border)",
              color: "var(--rm-text-muted)",
            }}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreate}
      />

      <AnimatePresence>
        {toast && <Toast msg={toast} onDone={() => setToast("")} />}
      </AnimatePresence>
    </div>
  );
}
