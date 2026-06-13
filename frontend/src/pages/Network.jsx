import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import SuggestedCard from "../components/network/SuggestedCard";
import RequestCard from "../components/network/RequestCard";
import ConnectionCard from "../components/network/ConnectionCard";
import Tabs from "../components/network/Tabs";

import {
  acceptRequest,
  rejectRequest,
  sendConnectionRequest,
  getConnections,
  getRequests,
  getSentRequests,
} from "../api/connection";
import { getAllUsers } from "../api/user";
import { getRecommendations } from "../api/recommendations";

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
  const [sentRequests, setSentRequests] = useState([]);
  const [activeTab, setActiveTab] = useState("connections");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [allUsers, requestsData, connectionsData, sentRequestsData] =
        await Promise.all([
          getRequests(),
          getConnections(),
          getSentRequests(),
          getRecommendations(),
        ]);

      setSuggestions(allUsers.slice(0, 9));
      setRequests(requestsData);
      setConnections(connectionsData);
      setSentRequests(sentRequestsData);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ ACCEPT
  const handleAccept = async (id) => {
    try {
      await acceptRequest(id);

      await fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ DECLINE
  const handleDecline = async (id) => {
    try {
      await rejectRequest(id);

      await fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ CONNECT
  const handleConnect = async (user) => {
    try {
      await sendConnectionRequest(user._id);

      await fetchData();
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
      <Tabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        connectionsCount={Array.isArray(connections) ? connections.length : 0}
        requestsCount={Array.isArray(requests) ? requests.length : 0}
      />

      <div className="relative flex gap-6">
        {/* LEFT */}

        <div className="flex-1 space-y-10">
          {/* REQUESTS */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Pending Invites</h2>

            <div className="flex gap-4 overflow-x-auto pb-3">
              {/* {requests.length === 0 && (
                <p className="text-gray-400">No pending requests</p>
              )} */}

              {activeTab === "requests" && (
                <div className="space-y-4">
                  {requests.length === 0 ? (
                    <p className="text-gray-400">No pending requests</p>
                  ) : (
                    requests.map((r) => (
                      <RequestCard
                        key={r._id}
                        data={{
                          ...r,
                          id: r._id,
                          name: r.name || r.username,
                        }}
                        onAccept={handleAccept}
                        onDecline={handleDecline}
                      />
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          {/* CONNECTIONS */}
          <div>
            <h2 className="text-xl font-semibold mb-4">
              Frequent Collaborators
            </h2>

            {activeTab === "connections" && (
              <>
                <div className="grid md:grid-cols-2 gap-4">
                  {Array.isArray(connections) &&
                    connections.map((c) => (
                      <ConnectionCard
                        key={c._id}
                        data={{
                          ...c,
                          id: c._id,
                          name: c.name || c.username,
                          status: "Working together",
                        }}
                        statusOptions={statusOptions}
                        onStatusChange={() => {}}
                        onRemove={handleRemove}
                      />
                    ))}
                </div>

                {/* SUGGESTIONS */}
                <div className="mb-10">
                  <h2 className="text-xl font-semibold mb-4">
                    Suggested Artists
                  </h2>

                  <div className="grid md:grid-cols-3 gap-4">
                    {suggestions.map((user) => (
                      <SuggestedCard
                        key={user._id}
                        data={user}
                        pending={sentRequests.some((r) => r._id === user._id)}
                        onConnect={handleConnect}
                      />
                    ))}
                  </div>
                </div>
              </>
            )}
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
