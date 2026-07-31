import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { getRecommendations } from "../../api/recommendations";
import { sendConnectionRequest, getSentRequests } from "../../api/connection";

const SuggestedUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [pending, setPending] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [recs, sent] = await Promise.all([
          getRecommendations(),
          getSentRequests(),
        ]);
        setUsers(recs.slice(0, 3));
        const pendingMap = {};
        sent.forEach((u) => (pendingMap[u._id] = true));
        setPending(pendingMap);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSync = async (id) => {
    if (pending[id]) return;
    setPending((prev) => ({ ...prev, [id]: true }));
    try {
      await sendConnectionRequest(id);
    } catch (err) {
      console.error(err);
      setPending((prev) => ({ ...prev, [id]: false }));
    }
  };

  return (
    <div
      className="rounded-2xl p-5"
      style={{
        background: "var(--rm-bg-card)",
        border: "1px solid var(--rm-border)",
      }}
    >
      <div className="flex items-center gap-2 mb-4">
        <Sparkles size={15} color="#FF8B93" />
        <h2
          className="text-xs font-semibold uppercase tracking-wider"
          style={{
            fontFamily: "var(--rm-font-mono)",
            color: "var(--rm-purple-light)",
          }}
        >
          sync suggestions
        </h2>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="h-12 rounded-xl animate-pulse"
              style={{ background: "rgba(255,255,255,0.03)" }}
            />
          ))}
        </div>
      ) : users.length === 0 ? (
        <p
          className="text-xs py-4 text-center"
          style={{
            color: "var(--rm-text-muted)",
            fontFamily: "var(--rm-font-mono)",
          }}
        >
          no suggestions right now
        </p>
      ) : (
        <div className="space-y-3">
          {users.map((u) => (
            <div key={u._id} className="flex items-center gap-3">
              <button
                onClick={() => navigate(`/profile/${u.username}`)}
                className="flex-shrink-0"
              >
                <img
                  src={
                    u.avatar ||
                    `https://ui-avatars.com/api/?name=${u.username}&background=F9576F&color=fff`
                  }
                  alt={u.username}
                  className="w-9 h-9 rounded-full object-cover"
                  style={{ border: "1.5px solid var(--rm-purple-border)" }}
                />
              </button>
              <div className="flex-1 min-w-0">
                <p
                  className="text-sm font-medium truncate"
                  style={{ color: "var(--rm-text-primary)" }}
                >
                  {u.username}
                </p>
                <p
                  className="text-[10px] truncate"
                  style={{
                    fontFamily: "var(--rm-font-mono)",
                    color: "var(--rm-text-muted)",
                  }}
                >
                  {u.role || "Music Creator"}
                </p>
              </div>
              <button
                onClick={() => handleSync(u._id)}
                disabled={pending[u._id]}
                className="text-[11px] font-medium px-3 py-1.5 rounded-full transition-all flex-shrink-0"
                style={
                  pending[u._id]
                    ? {
                        background: "var(--rm-purple)",
                        color: "#fff",
                        border: "1px solid var(--rm-purple)",
                        opacity: 0.7,
                      }
                    : {
                        background: "transparent",
                        color: "var(--rm-purple-light)",
                        border: "1px solid var(--rm-purple-border)",
                      }
                }
              >
                {pending[u._id] ? "pending" : "+ sync"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SuggestedUsers;
