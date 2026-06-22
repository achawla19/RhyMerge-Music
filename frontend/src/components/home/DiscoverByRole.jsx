import { Mic2, Disc3, Guitar, SlidersHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";

const roles = [
  {
    title: "Producer",
    icon: Disc3,
    description: "Find vocalists and musicians for your next beat.",
  },
  {
    title: "Singer",
    icon: Mic2,
    description: "Collaborate with producers and engineers worldwide.",
  },
  {
    title: "Guitarist",
    icon: Guitar,
    description: "Join projects and contribute live instruments.",
  },
  {
    title: "Sound Engineer",
    icon: SlidersHorizontal,
    description: "Mix, master and polish tracks professionally.",
  },
];

const DiscoverByRole = () => {
  const navigate = useNavigate();

  return (
    <div
      className="rounded-2xl p-5 lg:p-6"
      style={{
        background: "var(--rm-bg-card)",
        border: "1px solid var(--rm-border)",
      }}
    >
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-white">Discover by Role</h2>
        <p
          className="text-xs mt-1"
          style={{
            color: "var(--rm-text-muted)",
            fontFamily: "var(--rm-font-mono)",
          }}
        >
          find creators matching your frequency
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
        {roles.map((role) => {
          const Icon = role.icon;
          return (
            <div
              key={role.title}
              onClick={() => navigate(`/search?role=${role.title}`)}
              className="rounded-xl p-4 cursor-pointer transition-all"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid var(--rm-border)",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor = "var(--rm-purple)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor = "var(--rm-border)")
              }
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
                style={{ background: "var(--rm-purple-dim)" }}
              >
                <Icon size={16} color="#C084FC" />
              </div>
              <h3 className="text-sm font-semibold text-white mb-1.5">
                {role.title}
              </h3>
              <p
                className="text-xs"
                style={{ color: "var(--rm-text-muted)", lineHeight: 1.5 }}
              >
                {role.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DiscoverByRole;
