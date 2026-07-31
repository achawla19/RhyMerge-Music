import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { acceptRequest, rejectRequest } from "../../api/projectRequests";

export default function ProjectRequests({ requests, refresh }) {
  const navigate = useNavigate();
  const [processingId, setProcessingId] = useState(null);

  const handleAccept = async (id) => {
    setProcessingId(id);
    try {
      await acceptRequest(id);
      // Real state refresh instead of a full page reload — the original
      // did window.location.reload() here, which throws away all React
      // state and reloads the entire app just to update one list.
      await refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id) => {
    setProcessingId(id);
    try {
      await rejectRequest(id);
      await refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div
      className="rounded-2xl p-6"
      style={{
        background: "var(--rm-bg-card)",
        border: "1px solid var(--rm-border)",
      }}
    >
      <h3 className="text-white text-lg font-semibold mb-5">
        Pending Requests
      </h3>

      <div className="space-y-3">
        {requests.map((request) => {
          const isProcessing = processingId === request._id;
          return (
            <div
              key={request._id}
              className="flex items-center justify-between flex-wrap gap-3 rounded-xl p-4"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid var(--rm-border)",
              }}
            >
              <button
                onClick={() => navigate(`/profile/${request.sender.username}`)}
                className="flex items-center gap-3 text-left"
              >
                <img
                  src={
                    request.sender.avatar ||
                    `https://ui-avatars.com/api/?name=${request.sender.username}&background=F9576F&color=fff`
                  }
                  alt=""
                  className="w-12 h-12 rounded-full transition-transform hover:scale-105"
                  style={{ border: "1.5px solid var(--rm-purple-border)" }}
                />
                <div>
                  <p className="text-white text-sm font-medium">
                    {request.sender.username}
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: "var(--rm-text-muted)" }}
                  >
                    {request.sender.role}
                  </p>
                  <p
                    className="text-xs mt-0.5"
                    style={{ color: "var(--rm-purple-light)" }}
                  >
                    wants to join as {request.role}
                  </p>
                </div>
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => handleAccept(request._id)}
                  disabled={isProcessing}
                  className="px-4 py-2 rounded-xl text-sm font-medium transition-all disabled:opacity-50"
                  style={{
                    background: "var(--rm-success-dim)",
                    color: "var(--rm-success)",
                    border: "1px solid rgba(79,190,138,0.35)",
                  }}
                >
                  {isProcessing ? "..." : "Accept"}
                </button>
                <button
                  onClick={() => handleReject(request._id)}
                  disabled={isProcessing}
                  className="px-4 py-2 rounded-xl text-sm font-medium transition-all disabled:opacity-50"
                  style={{
                    background: "var(--rm-error-dim)",
                    color: "var(--rm-error)",
                    border: "1px solid rgba(229,72,77,0.3)",
                  }}
                >
                  {isProcessing ? "..." : "Reject"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
