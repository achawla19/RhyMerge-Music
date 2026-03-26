import { useState } from "react";
import Tabs from "../components/network/Tabs";
import RequestCard from "../components/network/RequestCard";
import SuggestedCard from "../components/network/SuggestedCard";
import ConnectionCard from "../components/network/ConnectionCard";

const initialRequests = [
  {
    id: 1,
    avatar: "https://i.pravatar.cc/150?img=32",
    name: "Jordan Blake",
    role: "Music Producer",
    bio: "Grammy-nominated producer looking to expand my network.",
  },
  {
    id: 2,
    avatar: "https://i.pravatar.cc/150?img=36",
    name: "Samira Hassan",
    role: "Vocalist / Songwriter",
    bio: "R&B artist with 5 years of studio experience.",
  },
];

const initialConnections = [
  {
    id: 10,
    avatar: "https://i.pravatar.cc/150?img=44",
    name: "Elena Martinez",
    role: "DJ / Producer",
    status: "Working together",
  },
];

const suggestedArtists = [
  {
    id: 100,
    avatar: "https://i.pravatar.cc/150?img=60",
    name: "Maya Sterling",
    role: "Composer",
  },
  {
    id: 101,
    avatar: "https://i.pravatar.cc/150?img=64",
    name: "Leo Chang",
    role: "Drummer",
  },
];

const statusOptions = [
  "Working together",
  "Invite to collab",
  "Pending collab",
  "Past collaborator",
];

const Network = () => {
  const [activeTab, setActiveTab] = useState("connections");
  const [requests, setRequests] = useState(initialRequests);
  const [connections, setConnections] = useState(initialConnections);

  // Accept
  const handleAccept = (id) => {
    const user = requests.find((r) => r.id === id);
    setRequests((prev) => prev.filter((r) => r.id !== id));
    setConnections((prev) => [
      ...prev,
      { ...user, status: "Invite to collab" },
    ]);
  };

  // Decline
  const handleDecline = (id) => {
    setRequests((prev) => prev.filter((r) => r.id !== id));
  };

  // Update Status
  const handleStatusChange = (id, status) => {
    setConnections((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status } : c)),
    );
  };

  // Remove Connection
  const handleRemove = (id) => {
    setConnections((prev) => prev.filter((c) => c.id !== id));
  };

  // Connect with Suggested Artist
  const handleConnect = (artist) => {
    setConnections((prev) => [
      ...prev,
      { ...artist, status: "Invite to collab" },
    ]);
  };

  return (
    <div className="min-h-screen bg-[#0B2540] text-white px-4 py-6">
      {/* HEADER */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">Your Network</h1>
        <p className="text-gray-400">Manage your connections</p>
      </div>

      {/* TABS */}
      <Tabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        connectionsCount={connections.length}
        requestsCount={requests.length}
      />

      {/* REQUESTS */}
      {activeTab === "requests" && (
        <div className="space-y-4 mt-6">
          {requests.length === 0 ? (
            <p className="text-gray-400 text-center">No pending requests</p>
          ) : (
            requests.map((r) => (
              <RequestCard
                key={r.id}
                data={r}
                onAccept={handleAccept}
                onDecline={handleDecline}
              />
            ))
          )}
        </div>
      )}

      {/* CONNECTIONS */}
      {activeTab === "connections" && (
        <div className="space-y-4 mt-6">
          {connections.map((c) => (
            <ConnectionCard
              key={c.id}
              data={c}
              statusOptions={statusOptions}
              onStatusChange={handleStatusChange}
              onRemove={handleRemove}
            />
          ))}
        </div>
      )}

      {/* SUGGESTED */}
      <div className="mt-10">
        <h2 className="mb-4 font-semibold text-xl">Suggested Artists</h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {suggestedArtists.map((a) => (
            <SuggestedCard key={a.id} data={a} onConnect={handleConnect} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Network;
