import { useEffect, useState } from "react";
import { Bookmark } from "lucide-react";

import { getSavedProjects } from "../api/savedProjects";
import ProjectCard from "../components/projects/ProjectCard";
import PageHeader from "../components/ui/PageHeader";

export default function SavedProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await getSavedProjects();
        setProjects(data);
      } catch (err) {
        // The original version had no error handling here at all —
        // a failed fetch would leave the page stuck blank with no feedback.
        console.error(err);
        setError("Couldn't load your saved mixes. Try refreshing.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Saved Mixes"
        subtitle="projects you've bookmarked for later"
      />

      {loading ? (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {Array.from({ length: 3 }).map((_, i) => (
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
      ) : error ? (
        <div
          className="text-center py-16 rounded-2xl"
          style={{
            background: "var(--rm-bg-card)",
            border: "1px solid rgba(248,113,113,0.25)",
          }}
        >
          <p className="text-sm" style={{ color: "#F87171" }}>
            {error}
          </p>
        </div>
      ) : projects.length === 0 ? (
        <div
          className="text-center py-16 rounded-2xl"
          style={{
            background: "var(--rm-bg-card)",
            border: "1px dashed var(--rm-purple-border)",
          }}
        >
          <Bookmark size={24} color="#C084FC" className="mx-auto mb-3" />
          <p className="text-sm" style={{ color: "var(--rm-text-primary)" }}>
            No saved mixes yet
          </p>
          <p
            className="text-xs mt-1"
            style={{
              fontFamily: "var(--rm-font-mono)",
              color: "var(--rm-text-muted)",
            }}
          >
            bookmark a mix to find it here later
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {projects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
