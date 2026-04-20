import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function Profile() {
  const { username } = useParams();
  const navigate = useNavigate();

  const users = {
    chhavi: {
      name: "Chhavi",
      role: "Singer • Songwriter",
      location: "Mumbai, India",
      avatar: "/assets/who1.jpg",
      connections: 128,
      projects: 24,
      bio: "Passionate about blending soulful vocals with modern beats.",
      genre: "Pop / Indie",
      instruments: ["Vocals", "Guitar"],
    },
  };

  const user = users[username];

  if (!user) {
    return <div className="text-white p-10">User not found</div>;
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="min-h-screen px-6 py-6 text-white
      bg-gradient-to-br from-[#0b1220] via-[#0f1c35] to-[#0a0f1f]
      relative overflow-hidden"
    >
      {/* BG GLOW */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600/20 blur-[120px]" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/20 blur-[120px]" />

      {/* HEADER */}
      <motion.div variants={item} className="relative mb-10">
        <div className="h-56 rounded-2xl bg-gradient-to-r from-purple-500/10 via-transparent to-cyan-500/10 border border-white/10 backdrop-blur-xl" />

        <div className="absolute -bottom-16 left-8 flex items-end gap-6">
          {/* AVATAR */}
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/10 shadow-lg">
            <img src={user.avatar} className="w-full h-full object-cover" />
          </div>

          {/* INFO */}
          <div>
            <h1 className="text-4xl font-bold">{user.name}</h1>
            <p className="text-purple-300">{user.role}</p>
            <p className="text-sm text-gray-400">{user.location}</p>
          </div>
        </div>

        {/* ACTION BUTTON */}
        <div className="absolute right-6 bottom-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/messages")}
            className="px-6 py-3 rounded-full text-white font-medium flex items-center gap-2
            bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500"
          >
            <MessageCircle size={18} />
            Message
          </motion.button>
        </div>
      </motion.div>

      {/* STATS */}
      <motion.div
        variants={item}
        className="grid grid-cols-3 md:grid-cols-4 gap-4 mt-20 mb-10"
      >
        {[
          { label: "Connections", value: user.connections },
          { label: "Projects", value: user.projects },
          { label: "Genre", value: user.genre },
          { label: "Instruments", value: user.instruments.length },
        ].map((s, i) => (
          <div
            key={i}
            className="rounded-xl p-4 text-center
            bg-gradient-to-br from-white/10 to-white/5
            backdrop-blur-xl border border-white/10"
          >
            <p className="text-2xl font-bold text-white">{s.value}</p>
            <p className="text-xs text-gray-400">{s.label}</p>
          </div>
        ))}
      </motion.div>

      {/* MAIN GRID */}
      <div className="grid lg:grid-cols-[300px_1fr_300px] gap-6">
        {/* LEFT */}
        <motion.div variants={item} className="space-y-4">
          <div className="rounded-xl p-5 bg-white/10 backdrop-blur-xl border border-white/10">
            <h2 className="font-semibold mb-3">Bio</h2>
            <p className="text-sm text-gray-300">{user.bio}</p>
          </div>

          <div className="rounded-xl p-5 bg-white/10 backdrop-blur-xl border border-white/10">
            <h2 className="font-semibold mb-3">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {user.instruments.map((i) => (
                <span
                  key={i}
                  className="px-3 py-1 text-xs rounded-full bg-white/10 border border-white/10"
                >
                  {i}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* CENTER */}
        <motion.div variants={item} className="space-y-4">
          <div className="rounded-xl p-5 bg-white/10 backdrop-blur-xl border border-white/10">
            <h2 className="font-semibold mb-4">Projects</h2>

            {[1, 2, 3].map((p) => (
              <div key={p} className="mb-4">
                <p className="text-sm mb-1">Project {p}</p>

                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-cyan-500"
                    style={{ width: `${40 + p * 15}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* RIGHT PANEL */}
        <motion.div variants={item} className="space-y-4">
          <div className="rounded-xl p-5 bg-white/10 backdrop-blur-xl border border-white/10">
            <h2 className="font-semibold mb-3">Activity</h2>

            <div className="space-y-2 text-sm">
              <div className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition">
                🎧 Uploaded new track
              </div>

              <div className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition">
                🤝 Connected with 2 artists
              </div>

              <div className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition">
                🎤 Collaborated on project
              </div>
            </div>
          </div>

          <div className="rounded-xl p-5 bg-white/10 backdrop-blur-xl border border-white/10">
            <h2 className="font-semibold mb-3">Availability</h2>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Open for collab</span>

              <span className="text-xs px-3 py-1 rounded-full bg-green-500/20 text-green-300">
                Available
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
