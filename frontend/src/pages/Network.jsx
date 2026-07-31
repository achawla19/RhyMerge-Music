import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users } from "lucide-react";

import SuggestedCard from "../components/network/SuggestedCard";
import RequestCard from "../components/network/RequestCard";
import ConnectionCard from "../components/network/ConnectionCard";
import Tabs from "../components/network/Tabs";
import PageHeader from "../components/ui/PageHeader";

import {
  acceptRequest,
  rejectRequest,
  sendConnectionRequest,
  getConnections,
  getRequests,
  getSentRequests,
} from "../api/connection";
import { getRecommendations } from "../api/recommendations";

export default function Network() {
  const [requests, setRequests] = useState([]);
  const [connections, setConnections] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [activeTab, setActiveTab] = useState("connections");
  const [loading, setLoading] = useState(true);
  const [syncError, setSyncError] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [
        requestsData,
        connectionsData,
        sentRequestsData,
        recommendationsData,
      ] = await Promise.all([
        getRequests(),
        getConnections(),
        getSentRequests(),
        getRecommendations(),
      ]);

      const uniqueRecommendations = Array.from(
        new Map(recommendationsData.map((user) => [user._id, user])).values(),
      );
      setSuggestions(uniqueRecommendations.slice(0, 9));
      setRequests(requestsData);

      const uniqueConnections = Array.from(
        new Map(connectionsData.map((u) => [u._id, u])).values(),
      );
      setConnections(uniqueConnections);
      setSentRequests(sentRequestsData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (id) => {
    try {
      await acceptRequest(id);
      await fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDecline = async (id) => {
    try {
      await rejectRequest(id);
      await fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleConnect = async (user) => {
    setSyncError("");
    try {
      await sendConnectionRequest(user._id);
      await fetchData();
    } catch (err) {
      console.error(err);
      // Previously this only logged to console — clicking Sync and having
      // nothing visibly happen (e.g. on an "Already connected" rejection)
      // looked exactly like the button was broken.
      setSyncError(err.message || "Failed to send sync request");
      setTimeout(() => setSyncError(""), 4000);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Your Syncs"
        subtitle={`${connections.length} musician${connections.length === 1 ? "" : "s"} you're tuned into`}
      />

      {syncError && (
        <div
          className="rounded-xl px-4 py-3 text-sm"
          style={{
            background: "rgba(248,113,113,0.1)",
            border: "1px solid rgba(248,113,113,0.3)",
            color: "#F87171",
          }}
        >
          {syncError}
        </div>
      )}

      <Tabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        connectionsCount={connections.length}
        requestsCount={requests.length}
      />

      <div className="space-y-12 pt-2">
        {/* ── REQUESTS TAB ── */}
        {activeTab === "requests" && (
          <div>
            <h2 className="text-xl font-bold text-white mb-5">
              Pending Invites
            </h2>
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-20 rounded-2xl animate-pulse"
                    style={{
                      background: "var(--rm-bg-card)",
                      border: "1px solid var(--rm-border)",
                    }}
                  />
                ))}
              </div>
            ) : requests.length === 0 ? (
              <div
                className="text-center py-16 rounded-2xl"
                style={{
                  background: "var(--rm-bg-card)",
                  border: "1px dashed var(--rm-purple-border)",
                }}
              >
                <p
                  className="text-sm"
                  style={{ color: "var(--rm-text-primary)" }}
                >
                  No pending requests
                </p>
                <p
                  className="text-xs mt-1"
                  style={{
                    fontFamily: "var(--rm-font-mono)",
                    color: "var(--rm-text-muted)",
                  }}
                >
                  invites you receive will show up here
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {requests.map((r) => (
                  <RequestCard
                    key={r._id}
                    data={{ ...r, id: r._id, name: r.name || r.username }}
                    onAccept={handleAccept}
                    onDecline={handleDecline}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── CONNECTIONS TAB ── */}
        {activeTab === "connections" && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white">
                Your Collaborators
              </h2>
              <p
                className="text-sm mt-1.5"
                style={{
                  color: "var(--rm-text-muted)",
                  fontFamily: "var(--rm-font-mono)",
                }}
              >
                people you're actively creating music with
              </p>
            </div>

            {loading ? (
              <div className="grid md:grid-cols-2 gap-5">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-56 rounded-2xl animate-pulse"
                    style={{
                      background: "var(--rm-bg-card)",
                      border: "1px solid var(--rm-border)",
                    }}
                  />
                ))}
              </div>
            ) : connections.length === 0 ? (
              <div
                className="text-center py-16 rounded-2xl"
                style={{
                  background: "var(--rm-bg-card)",
                  border: "1px dashed var(--rm-purple-border)",
                }}
              >
                <Users size={26} color="#FF8B93" className="mx-auto mb-3" />
                <p
                  className="text-sm"
                  style={{ color: "var(--rm-text-primary)" }}
                >
                  No syncs yet
                </p>
                <p
                  className="text-xs mt-1"
                  style={{
                    fontFamily: "var(--rm-font-mono)",
                    color: "var(--rm-text-muted)",
                  }}
                >
                  sync with a creator below to get started
                </p>
              </div>
            ) : (
              <motion.div layout className="grid md:grid-cols-2 gap-5">
                {connections.map((c) => (
                  <ConnectionCard key={c._id} data={c} />
                ))}
              </motion.div>
            )}

            {/* ── DISCOVER ── */}
            <div className="mt-12">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-white">
                  Discover Creators
                </h2>
                <p
                  className="text-sm mt-1.5"
                  style={{
                    color: "var(--rm-text-muted)",
                    fontFamily: "var(--rm-font-mono)",
                  }}
                >
                  handpicked based on your genres and network
                </p>
              </div>

              {!loading && suggestions.length === 0 ? (
                <div
                  className="text-center py-16 rounded-2xl"
                  style={{
                    background: "var(--rm-bg-card)",
                    border: "1px dashed var(--rm-purple-border)",
                  }}
                >
                  <p
                    className="text-sm"
                    style={{ color: "var(--rm-text-muted)" }}
                  >
                    No recommendations yet
                  </p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {suggestions.map((user) => (
                    <SuggestedCard
                      key={user._id}
                      data={user}
                      pending={sentRequests.some((r) => r._id === user._id)}
                      onConnect={handleConnect}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
