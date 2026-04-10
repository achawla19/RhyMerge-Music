import Avatar from "../Avatar";

const ProjectDetail = ({ project, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#111118] rounded-xl p-6 w-full max-w-xl">
        {/* HEADER */}
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-bold">{project.title}</h2>
          <button onClick={onClose}>✕</button>
        </div>

        {/* DESC */}
        <p className="text-gray-400 mb-4">{project.description}</p>

        {/* INFO */}
        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
          <p>Genre: {project.genre}</p>
          <p>Status: {project.status}</p>
          <p>Date: {project.date}</p>
          <p>Timeline: {project.timeline}</p>
        </div>

        {/* COLLAB */}
        <div>
          <p className="text-sm mb-2 text-gray-400">Collaborators</p>

          <div className="flex gap-2">
            {project.collaborators.map((c, i) => (
              <div key={i} className="flex items-center gap-2">
                <Avatar src={c.avatar} size="sm" />
                <span className="text-sm">{c.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
