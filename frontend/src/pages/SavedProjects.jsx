import { useEffect, useState } from "react";

import { getSavedProjects } from "../api/savedProjects";

import ProjectCard from "../components/projects/ProjectCard";

export default function SavedProjects() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const load = async () => {
      const data = await getSavedProjects();

      setProjects(data);
    };

    load();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Saved Projects</h1>

        <p className="text-slate-400 mt-2">Projects you've bookmarked.</p>
      </div>

      <div
        className="
          grid

          md:grid-cols-2
          xl:grid-cols-3

          gap-5
        "
      >
        {projects.map((project) => (
          <ProjectCard key={project._id} project={project} />
        ))}
      </div>
    </div>
  );
}
