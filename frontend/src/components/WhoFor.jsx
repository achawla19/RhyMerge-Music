import Card from "./ui/Card";
import { Mic2, Music2, Guitar, Headphones } from "lucide-react";

const roles = [
  {
    title: "Producer",
    icon: Music2,
    count: "124 Active",
  },
  {
    title: "Singer",
    icon: Mic2,
    count: "89 Active",
  },
  {
    title: "Guitarist",
    icon: Guitar,
    count: "54 Active",
  },
  {
    title: "DJ / Engineer",
    icon: Headphones,
    count: "72 Active",
  },
];

export default function WhoFor() {
  return (
    <Card>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-white">Discover By Role</h2>

        <p className="text-gray-400 mt-1">
          Find creators matching your workflow.
        </p>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        {roles.map((role) => {
          const Icon = role.icon;

          return (
            <div
              key={role.title}
              className="
                p-6
                rounded-3xl
                bg-white/[0.03]
                border border-white/10
                hover:border-purple-500/30
                transition-all
              "
            >
              <Icon size={30} className="text-purple-400 mb-4" />

              <h3 className="text-white font-medium">{role.title}</h3>

              <p className="text-gray-400 text-sm mt-1">{role.count}</p>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
