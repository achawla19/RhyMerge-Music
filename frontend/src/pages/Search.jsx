import { useEffect, useState } from "react";

import PageHeader from "../components/ui/PageHeader";
import SearchTabs from "../components/search/SearchTabs";
import SmartFilters from "../components/search/SmartFilters";
import ArtistGrid from "../components/search/ArtistGrid";
import ProjectGrid from "../components/search/ProjectGrid";

import { searchProjects } from "../api/projects";
import { searchUsers } from "../api/user";
import { getSentRequests } from "../api/connection";

const Search = () => {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState("Creators");
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [artists, setArtists] = useState([]);
  const [projects, setProjects] = useState([]);
  const [pendingIds, setPendingIds] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load sent-request state once, so Sync buttons reflect reality on first paint
  useEffect(() => {
    (async () => {
      try {
        const sent = await getSentRequests();
        setPendingIds(sent.map((u) => u._id));
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (activeTab === "Creators") {
          const data = await searchUsers({
            q: query,
            role: selectedRole,
            genre: selectedGenre,
          });
          setArtists(data);
        } else {
          const data = await searchProjects({ q: query, genre: selectedGenre });
          setProjects(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [query, activeTab, selectedRole, selectedGenre]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Find Stems"
        subtitle="discover artists, roles, and sounds that match yours"
      />

      <div className="relative max-w-xl">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={
            activeTab === "Creators"
              ? "search creators by name or role..."
              : "search mixes by title or genre..."
          }
          className="w-full px-4 py-3 rounded-2xl outline-none transition-all"
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

      <SearchTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <SmartFilters
        selectedRole={selectedRole}
        selectedGenre={selectedGenre}
        onSelectRole={setSelectedRole}
        onSelectGenre={setSelectedGenre}
      />

      <div className="flex items-center justify-between">
        <h2 className="text-white text-base font-semibold">Results</h2>
        <p
          className="text-xs"
          style={{
            color: "var(--rm-text-muted)",
            fontFamily: "var(--rm-font-mono)",
          }}
        >
          {activeTab === "Creators"
            ? `${artists.length} creators found`
            : `${projects.length} mixes found`}
        </p>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-44 rounded-2xl animate-pulse"
              style={{
                background: "var(--rm-bg-card)",
                border: "1px solid var(--rm-border)",
              }}
            />
          ))}
        </div>
      ) : activeTab === "Creators" ? (
        <ArtistGrid artists={artists} pendingIds={pendingIds} />
      ) : (
        <ProjectGrid projects={projects} />
      )}
    </div>
  );
};

export default Search;
