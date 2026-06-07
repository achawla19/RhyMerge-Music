import Card from "../ui/Card";
import { Music2, ArrowRight } from "lucide-react";

const projects = [
  {
    id: 1,
    title: "Midnight Echoes",
    genre: "Lo-Fi",
    status: "Active",
  },
  {
    id: 2,
    title: "Neon Dreams",
    genre: "Synthwave",
    status: "Recruiting",
  },
  {
    id: 3,
    title: "Broken Frequencies",
    genre: "EDM",
    status: "Completed",
  },
];

export default function RecentProjects() {
  return (
    <Card>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-white">Recent Projects</h2>

        <button className="text-purple-400 flex items-center gap-1 text-sm hover:text-purple-300">
          View All
          <ArrowRight size={15} />
        </button>
      </div>

      <div className="space-y-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="
              p-4
              rounded-2xl
              border
              border-white/5
              bg-white/[0.03]
              hover:border-purple-500/20
              transition-all
            "
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <Music2 size={16} className="text-purple-400" />

                  <h3 className="text-white font-medium">{project.title}</h3>
                </div>

                <p className="text-gray-400 text-sm mt-2">{project.genre}</p>
              </div>

              <span
                className={`
                  px-3 py-1 rounded-full text-xs

                  ${
                    project.status === "Active"
                      ? "bg-green-500/10 text-green-300 border border-green-500/20"
                      : project.status === "Recruiting"
                        ? "bg-purple-500/10 text-purple-300 border border-purple-500/20"
                        : "bg-gray-500/10 text-gray-300 border border-gray-500/20"
                  }
                `}
              >
                {project.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
