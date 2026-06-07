import { useEffect, useState } from "react";

import PageHeader from "../components/ui/PageHeader";

import SearchTabs from "../components/search/SearchTabs";
import SmartFilters from "../components/search/SmartFilters";
import ArtistGrid from "../components/search/ArtistGrid";
import ProjectGrid from "../components/search/ProjectGrid";
import { searchProjects } from "../api/projects";

import { searchUsers } from "../api/user";

const Search = () => {
  const [query, setQuery] = useState("");

  const [activeTab, setActiveTab] = useState("Creators");

  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [selectedTag, setSelectedTag] = useState(null);
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);

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
          const data = await searchProjects({
            q: query,
            genre: selectedGenre,
          });

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
    <div className="space-y-8">
      <div className="space-y-5">
        <SearchTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      <SmartFilters
        selectedRole={selectedRole}
        selectedGenre={selectedGenre}
        onSelectRole={setSelectedRole}
        onSelectGenre={setSelectedGenre}
      />

      <div className="flex items-center justify-between">
        <h2 className="text-white text-lg font-semibold">Results</h2>

        <p className="text-slate-400">
          {activeTab === "Creators"
            ? `${artists.length} creators found`
            : `${projects.length} projects found`}
        </p>
      </div>

      {activeTab === "Creators" ? (
        <ArtistGrid artists={artists} />
      ) : (
        <ProjectGrid projects={projects} />
      )}
    </div>
  );
};

export default Search;
