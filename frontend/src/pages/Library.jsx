import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Library as LibraryIcon,
  Bookmark,
  BookmarkX,
  Music2,
  Clock,
} from "lucide-react";
import { getSavedProjects, toggleSavedProject } from "../api/savedProjects";
import { getProjectsByUsername } from "../api/projects";
import { useAuth } from "../context/AuthContext";
import ProjectCard from "../components/projects/ProjectCard";

const TABS = ["Saved Mixes", "My Mixes"];

export default function Library() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tab, setTab] = useState("Saved Mixes");
  const [saved, setSaved] = useState([]);
  const [myMixes, setMyMixes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unsaving, setUnsaving] = useState(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getSavedProjects().catch(() => []),
      getProjectsByUsername(user?.username).catch(() => []),
    ])
      .then(([savedData, myData]) => {
        setSaved(Array.isArray(savedData) ? savedData : []);
        setMyMixes(Array.isArray(myData) ? myData : myData?.projects || []);
      })
      .finally(() => setLoading(false));
  }, [user?.username]);

  const handleUnsave = async (e, projectId) => {
    e.stopPropagation();
    setUnsaving(projectId);
    try {
      await toggleSavedProject(projectId);
      setSaved((prev) => prev.filter((p) => p._id !== projectId));
    } catch (err) {
      console.error(err);
    } finally {
      setUnsaving(null);
    }
  };

  const projects = tab === "Saved Mixes" ? saved : myMixes;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: "var(--rm-purple-dim)",
              border: "1px solid var(--rm-purple-border)",
            }}
          >
            <LibraryIcon size={18} color="#C084FC" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Your Library</h1>
            <p
              className="text-xs mt-0.5"
              style={{
                color: "var(--rm-text-muted)",
                fontFamily: "var(--rm-font-mono)",
              }}
            >
              {saved.length} saved · {myMixes.length} created
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div
        className="flex gap-1 p-1 rounded-2xl w-fit"
        style={{
          background: "var(--rm-bg-card)",
          border: "1px solid var(--rm-border)",
        }}
      >
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="px-5 py-2 rounded-xl text-sm font-medium transition-all"
            style={
              tab === t
                ? {
                    background: "var(--rm-purple-dim)",
                    color: "var(--rm-text-primary)",
                    border: "1px solid var(--rm-purple-border)",
                  }
                : {
                    color: "var(--rm-text-muted)",
                    border: "1px solid transparent",
                  }
            }
          >
            {t}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-52 rounded-2xl animate-pulse"
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
          {tab === "Saved Mixes" ? (
            <>
              <Bookmark size={28} color="#C084FC" className="mx-auto mb-3" />
              <p className="text-sm text-white">No saved mixes yet</p>
              <p
                className="text-xs mt-1"
                style={{
                  color: "var(--rm-text-muted)",
                  fontFamily: "var(--rm-font-mono)",
                }}
              >
                tap the bookmark on any mix to save it here
              </p>
              <button
                onClick={() => navigate("/projects")}
                className="mt-4 px-5 py-2 rounded-xl text-sm font-medium text-white"
                style={{ background: "var(--rm-purple)" }}
              >
                Browse Mixes
              </button>
            </>
          ) : (
            <>
              <Music2 size={28} color="#C084FC" className="mx-auto mb-3" />
              <p className="text-sm text-white">No mixes created yet</p>
              <p
                className="text-xs mt-1"
                style={{
                  color: "var(--rm-text-muted)",
                  fontFamily: "var(--rm-font-mono)",
                }}
              >
                start your first mix and it'll appear here
              </p>
              <button
                onClick={() => navigate("/projects")}
                className="mt-4 px-5 py-2 rounded-xl text-sm font-medium text-white"
                style={{ background: "var(--rm-purple)" }}
              >
                Start a Mix
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {projects.map((project) => (
            <div key={project._id} className="relative group">
              <ProjectCard project={project} />
              {tab === "Saved Mixes" && (
                <button
                  onClick={(e) => handleUnsave(e, project._id)}
                  disabled={unsaving === project._id}
                  className="absolute top-3 right-3 w-8 h-8 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all disabled:opacity-50"
                  style={{
                    background: "rgba(248,113,113,0.15)",
                    border: "1px solid rgba(248,113,113,0.3)",
                    color: "#F87171",
                  }}
                  title="Remove from library"
                >
                  <BookmarkX size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
