import Card from "../ui/Card";

const roles = [
  {
    title: "Producer",
    description: "Find vocalists and musicians for your next beat.",
  },
  {
    title: "Singer",
    description: "Collaborate with producers and engineers worldwide.",
  },
  {
    title: "Guitarist",
    description: "Join projects and contribute live instruments.",
  },
  {
    title: "Sound Engineer",
    description: "Mix, master and polish tracks professionally.",
  },
];

const DiscoverByRole = () => {
  return (
    <Card>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-white">Discover By Role</h2>

        <p className="text-slate-400 mt-2">
          Find creators matching your workflow.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {roles.map((role) => (
          <div
            key={role.title}
            className="
              rounded-2xl
              border
              border-white/[0.06]
              bg-white/[0.03]
              p-5
              hover:border-purple-500/20
              transition-all
            "
          >
            <h3 className="text-white font-semibold mb-2">{role.title}</h3>

            <p className="text-sm text-slate-400">{role.description}</p>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default DiscoverByRole;
