import { useState } from "react";
import { motion } from "framer-motion";

const statusOptions = [
  "Working together",
  "Invite to collab",
  "Pending collab",
  "Past collaborator",
];

export default function Network() {
  const [requests, setRequests] = useState([
    {
      id: 1,
      name: "Leo Chang",
      role: "Drummer",
      avatar: "https://i.pravatar.cc/150?img=12",
    },
    {
      id: 2,
      name: "Maya Sterling",
      role: "Composer",
      avatar: "https://i.pravatar.cc/150?img=32",
    },
  ]);

  const [connections, setConnections] = useState([
    {
      id: 10,
      name: "Elena Martinez",
      avatar: "https://i.pravatar.cc/150?img=44",
      status: "Working together",
    },
  ]);

  // ✅ ACCEPT
  const handleAccept = (id) => {
    const user = requests.find((r) => r.id === id);
    setRequests((prev) => prev.filter((r) => r.id !== id));
    setConnections((prev) => [
      ...prev,
      { ...user, status: "Invite to collab" },
    ]);
  };

  // ✅ DECLINE
  const handleDecline = (id) => {
    setRequests((prev) => prev.filter((r) => r.id !== id));
  };

  // ✅ QUICK ACTION
  const handleQuick = (id) => {
    setConnections((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: "Working together" } : c)),
    );
  };

  // ✅ REMOVE
  const handleRemove = (id) => {
    setConnections((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="min-h-screen px-6 py-6 text-white relative overflow-hidden bg-gradient-to-br from-[#0b1220] via-[#0f1c35] to-[#0a0f1f]">
      {/* BG GLOW */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600/20 blur-[120px]" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/20 blur-[120px]" />

      <div className="relative flex gap-6">
        {/* LEFT */}
        <div className="flex-1 space-y-10">
          {/* REQUESTS */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Pending Invites</h2>

            <div className="flex gap-4 overflow-x-auto pb-3">
              {requests.length === 0 && (
                <p className="text-gray-400">No pending requests</p>
              )}

              {requests.map((r) => (
                <motion.div
                  key={r.id}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="min-w-[260px] rounded-xl p-4 flex items-center gap-3
                  bg-white/10 backdrop-blur-xl border border-white/20"
                >
                  <img src={r.avatar} className="w-12 h-12 rounded-full" />

                  <div className="flex-1">
                    <p className="font-medium">{r.name}</p>
                    <p className="text-xs text-gray-400">{r.role}</p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAccept(r.id)}
                      className="px-3 py-1 text-xs rounded-full text-white
                      bg-gradient-to-r from-purple-500 to-cyan-500"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() => handleDecline(r.id)}
                      className="px-3 py-1 text-xs text-gray-400 hover:text-white"
                    >
                      Deny
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* CONNECTIONS */}
          <div>
            <h2 className="text-xl font-semibold mb-4">
              Frequent Collaborators
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              {connections.map((c) => (
                <motion.div
                  key={c.id}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="rounded-xl p-4 flex items-center gap-4
                  bg-white/10 backdrop-blur-xl border border-white/20"
                >
                  <img src={c.avatar} className="w-12 h-12 rounded-full" />

                  <div className="flex-1">
                    <p className="font-medium">{c.name}</p>
                    <p className="text-xs text-purple-300">{c.status}</p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleQuick(c.id)}
                      className="px-3 py-1 text-xs rounded-full text-white
                      bg-gradient-to-r from-purple-500 to-cyan-500"
                    >
                      Quick
                    </button>

                    <button
                      onClick={() => handleRemove(c.id)}
                      className="px-3 py-1 text-xs text-gray-400 hover:text-red-400"
                    >
                      Remove
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="w-[300px] space-y-4">
          <div className="rounded-xl p-4 bg-white/10 backdrop-blur-xl border border-white/20">
            <h3 className="font-semibold mb-3">Intelligence Panel</h3>

            <div className="space-y-3 text-sm">
              <div className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition">
                🎧 3 Producers match your style
              </div>

              <div className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition">
                🔥 Trending: Lo-Fi
              </div>

              <div className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition">
                🎯 Best Match: Vocal Mixing
              </div>
            </div>
          </div>

          <div className="rounded-xl p-4 bg-white/10 backdrop-blur-xl border border-white/20">
            <h3 className="font-semibold mb-3">Shared Projects</h3>

            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i}>
                  <p className="text-sm mb-1">Project {i}</p>

                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-cyan-500"
                      style={{ width: `${40 + i * 20}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
