import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import {
  acceptRequest,
  rejectRequest,
  sendConnectionRequest,
  getConnections,
  getRequests,
} from "../api/connection";
import { getAllUsers } from "../api/user";

const statusOptions = [
  "Working together",
  "Invite to collab",
  "Pending collab",
  "Past collaborator",
];

export default function Network() {
  const [requests, setRequests] = useState([]);
  const [connections, setConnections] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [allUsers, requestsData, connectionsData] = await Promise.all([
        getAllUsers(),
        getRequests(),
        getConnections(),
      ]);

      setSuggestions(allUsers);
      setRequests(requestsData);
      setConnections(connectionsData);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ ACCEPT
  const handleAccept = async (id) => {
    try {
      await acceptRequest(id);

      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ DECLINE
  const handleDecline = async (id) => {
    try {
      await rejectRequest(id);

      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ CONNECT
  const handleConnect = async (user) => {
    try {
      await sendConnectionRequest(user._id);

      alert("Request sent");
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ QUICK ACTION
  const handleQuick = (id) => {
    setConnections((prev) =>
      prev.map((c) =>
        c._id === id ? { ...c, status: "Working together" } : c,
      ),
    );
  };

  // ✅ REMOVE
  const handleRemove = (id) => {
    setConnections((prev) => prev.filter((c) => c._id !== id));
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
                  key={r._id}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="min-w-[260px] rounded-xl p-4 flex items-center gap-3
                  bg-white/10 backdrop-blur-xl border border-white/20"
                >
                  <img
                    src={
                      r.avatar ||
                      `https://ui-avatars.com/api/?name=${r.username}`
                    }
                    className="w-12 h-12 rounded-full"
                  />

                  <div className="flex-1">
                    <p className="font-medium">{r.username}</p>
                    <p className="text-xs text-gray-400">{r.role}</p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAccept(r._id)}
                      className="px-3 py-1 text-xs rounded-full text-white
                      bg-gradient-to-r from-purple-500 to-cyan-500"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() => handleDecline(r._id)}
                      className="px-3 py-1 text-xs text-gray-400 hover:text-white"
                    >
                      Deny
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* SUGGESTIONS */}
          <div className="mb-10">
            <h2 className="text-xl font-semibold mb-4">Suggested Artists</h2>

            <div className="grid md:grid-cols-3 gap-4">
              {suggestions.map((user) => (
                <SuggestedCard
                  key={user._id}
                  data={user}
                  onConnect={handleConnect}
                />
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
                  key={c._id}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="rounded-xl p-4 flex items-center gap-4
                  bg-white/10 backdrop-blur-xl border border-white/20"
                >
                  <img src={c.avatar} className="w-12 h-12 rounded-full" />

                  <div className="flex-1">
                    <p className="font-medium">{c.username}</p>
                    <p className="text-xs text-purple-300">{c.status}</p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleQuick(c._id)}
                      className="px-3 py-1 text-xs rounded-full text-white
                      bg-gradient-to-r from-purple-500 to-cyan-500"
                    >
                      Quick
                    </button>

                    <button
                      onClick={() => handleRemove(c._id)}
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
