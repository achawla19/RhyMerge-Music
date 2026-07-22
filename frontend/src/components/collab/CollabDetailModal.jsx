import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Sparkles,
  Send,
  Trash2,
  Check,
  X as XIcon,
} from "lucide-react";
import Modal from "../projects/Modal";
import Select from "../ui/Select";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../ui/Toast";
import { useConfirm } from "../ui/ConfirmDialog";
import {
  respondToCollab,
  getMyResponseStatus,
  getCollabResponses,
  acceptResponse,
  declineResponse,
  deleteCollabPost,
  updateCollabPost,
} from "../../api/collab";

const STATUS_OPTS = ["Open", "Collaborating", "Closed"];

const TERMS_COLOR = {
  Paid: "#34D399",
  "Revenue Split": "#C084FC",
  "Credit Only": "#60A5FA",
  "Just for Fun": "#F59E0B",
};

const CollabDetailModal = ({ post, isOpen, onClose, onChanged, onDeleted }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const confirm = useConfirm();

  const isMine = post?.postedBy?._id === user?._id;

  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [myStatus, setMyStatus] = useState(null);
  const [responses, setResponses] = useState([]);
  const [loadingResponses, setLoadingResponses] = useState(false);
  const [statusSaving, setStatusSaving] = useState(false);

  useEffect(() => {
    if (!isOpen || !post) return;
    setMessage("");
    if (isMine) {
      setLoadingResponses(true);
      getCollabResponses(post._id)
        .then(setResponses)
        .catch(() => toast.error("Couldn't load responses"))
        .finally(() => setLoadingResponses(false));
    } else {
      getMyResponseStatus(post._id)
        .then((r) => setMyStatus(r.status))
        .catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, post?._id, isMine]);

  if (!post) return null;

  const termsColor = TERMS_COLOR[post.terms] || "var(--rm-purple-light)";

  const handleReachOut = async () => {
    setSending(true);
    try {
      await respondToCollab(post._id, message);
      setMyStatus("Pending");
      toast.success("Reached out — they'll get a notification");
      onChanged?.();
    } catch (err) {
      toast.error(err.message || "Couldn't send that");
    } finally {
      setSending(false);
    }
  };

  const handleRespond = async (responseId, action) => {
    try {
      if (action === "accept") await acceptResponse(responseId);
      else await declineResponse(responseId);
      setResponses((prev) =>
        prev.map((r) =>
          r._id === responseId
            ? { ...r, status: action === "accept" ? "Accepted" : "Declined" }
            : r,
        ),
      );
      toast.success(
        action === "accept" ? "Accepted — let's make music" : "Declined",
      );
      onChanged?.();
    } catch (err) {
      toast.error(err.message || "Couldn't update that");
    }
  };

  const handleStatusChange = async (status) => {
    setStatusSaving(true);
    try {
      await updateCollabPost(post._id, { status });
      toast.success(`Marked as ${status}`);
      onChanged?.({ ...post, status });
    } catch (err) {
      toast.error(err.message || "Couldn't update status");
    } finally {
      setStatusSaving(false);
    }
  };

  const handleDelete = async () => {
    const ok = await confirm({
      title: "Take this post down?",
      message:
        "This can't be undone. Anyone who reached out will lose access to this thread.",
      confirmText: "Take it down",
      tone: "danger",
    });
    if (!ok) return;
    try {
      await deleteCollabPost(post._id);
      toast.success("Post removed");
      onDeleted?.(post._id);
      onClose();
    } catch (err) {
      toast.error(err.message || "Couldn't remove that");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isMine ? "Your Collab Post" : "Collab Post"}
      wide
    >
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <img
            src={
              post.postedBy?.avatar ||
              `https://ui-avatars.com/api/?name=${post.postedBy?.username}&background=7c3aed&color=fff`
            }
            alt=""
            onClick={() => navigate(`/profile/${post.postedBy?.username}`)}
            className="w-10 h-10 rounded-full object-cover cursor-pointer flex-shrink-0"
            style={{ border: "1.5px solid var(--rm-purple-border)" }}
          />
          <div>
            <p className="text-sm font-semibold text-white">
              {post.postedBy?.username}
            </p>
            <p
              className="text-xs"
              style={{
                color: "var(--rm-text-muted)",
                fontFamily: "var(--rm-font-mono)",
              }}
            >
              {new Date(post.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <h3 className="text-white font-semibold text-lg leading-snug">
          {post.title}
        </h3>
        <p className="text-sm leading-relaxed" style={{ color: "#D1D5DB" }}>
          {post.description}
        </p>

        <div
          className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
          style={{
            background: "var(--rm-bg)",
            border: "1px solid var(--rm-purple-border)",
          }}
        >
          <Sparkles size={14} color="var(--rm-purple-light)" />
          <span
            className="text-sm"
            style={{ color: "var(--rm-text-secondary)" }}
          >
            Looking for{" "}
            <span className="font-semibold text-white">{post.lookingFor}</span>
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {post.genres?.map((g) => (
            <span
              key={g}
              className="text-[10px] px-2.5 py-0.5 rounded-full"
              style={{
                fontFamily: "var(--rm-font-mono)",
                background: "var(--rm-purple-dim)",
                color: "var(--rm-purple-light)",
                border: "1px solid var(--rm-purple-border)",
              }}
            >
              {g}
            </span>
          ))}
        </div>

        <div
          className="flex items-center gap-4 text-xs pb-1"
          style={{ fontFamily: "var(--rm-font-mono)" }}
        >
          <span style={{ color: termsColor }}>
            {post.terms}
            {post.termsNote ? ` · ${post.termsNote}` : ""}
          </span>
          {post.location && (
            <span
              className="flex items-center gap-1"
              style={{ color: "var(--rm-text-muted)" }}
            >
              <MapPin size={12} /> {post.location}
            </span>
          )}
        </div>

        {isMine ? (
          <div
            style={{
              borderTop: "1px solid rgba(124,58,237,0.1)",
              paddingTop: 16,
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-40">
                <Select
                  value={post.status}
                  onChange={handleStatusChange}
                  options={STATUS_OPTS}
                  disabled={statusSaving}
                />
              </div>
              <button
                onClick={handleDelete}
                className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl transition-all"
                style={{
                  color: "#F87171",
                  background: "rgba(248,113,113,0.08)",
                }}
              >
                <Trash2 size={13} /> Take down
              </button>
            </div>

            <p
              className="text-xs mb-3"
              style={{ color: "var(--rm-text-muted)" }}
            >
              {responses.length}{" "}
              {responses.length === 1 ? "person has" : "people have"} reached
              out
            </p>

            {loadingResponses ? (
              <p
                className="text-sm text-center py-6"
                style={{ color: "var(--rm-text-muted)" }}
              >
                Loading...
              </p>
            ) : responses.length === 0 ? (
              <p
                className="text-sm text-center py-6"
                style={{ color: "var(--rm-text-muted)" }}
              >
                Nobody's reached out yet — sit tight.
              </p>
            ) : (
              <div className="space-y-2 max-h-72 overflow-y-auto">
                {responses.map((r) => (
                  <div
                    key={r._id}
                    className="rounded-xl p-3"
                    style={{
                      background: "var(--rm-bg)",
                      border: "1px solid var(--rm-purple-border)",
                    }}
                  >
                    <div className="flex items-start gap-2.5">
                      <img
                        src={
                          r.responder?.avatar ||
                          `https://ui-avatars.com/api/?name=${r.responder?.username}&background=7c3aed&color=fff`
                        }
                        alt=""
                        onClick={() =>
                          navigate(`/profile/${r.responder?.username}`)
                        }
                        className="w-8 h-8 rounded-full object-cover cursor-pointer flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-white">
                            {r.responder?.username}
                          </span>
                          {r.responder?.role && (
                            <span
                              className="text-[10px]"
                              style={{
                                color: "var(--rm-text-muted)",
                                fontFamily: "var(--rm-font-mono)",
                              }}
                            >
                              {r.responder.role}
                            </span>
                          )}
                        </div>
                        {r.message && (
                          <p
                            className="text-sm mt-1"
                            style={{ color: "#D1D5DB" }}
                          >
                            {r.message}
                          </p>
                        )}
                      </div>
                    </div>

                    {r.status === "Pending" ? (
                      <div className="flex gap-2 mt-2.5">
                        <button
                          onClick={() => handleRespond(r._id, "accept")}
                          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium text-white transition-all"
                          style={{ background: "#059669" }}
                        >
                          <Check size={13} /> Accept
                        </button>
                        <button
                          onClick={() => handleRespond(r._id, "decline")}
                          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs transition-all"
                          style={{
                            background: "rgba(255,255,255,0.05)",
                            color: "var(--rm-text-muted)",
                          }}
                        >
                          <XIcon size={13} /> Decline
                        </button>
                      </div>
                    ) : (
                      <p
                        className="text-xs mt-2.5 font-medium"
                        style={{
                          color:
                            r.status === "Accepted"
                              ? "#34D399"
                              : "var(--rm-text-muted)",
                          fontFamily: "var(--rm-font-mono)",
                        }}
                      >
                        {r.status}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div
            style={{
              borderTop: "1px solid rgba(124,58,237,0.1)",
              paddingTop: 16,
            }}
          >
            {myStatus === "Pending" ? (
              <p
                className="text-sm text-center py-3 rounded-xl"
                style={{
                  background: "var(--rm-purple-dim)",
                  color: "var(--rm-purple-light)",
                }}
              >
                You've reached out — waiting to hear back
              </p>
            ) : myStatus === "Accepted" ? (
              <p
                className="text-sm text-center py-3 rounded-xl font-medium"
                style={{ background: "rgba(16,185,129,0.1)", color: "#34D399" }}
              >
                You're in! Message {post.postedBy?.username} to get started
              </p>
            ) : (
              <>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={`Tell ${post.postedBy?.username} why you'd be a good fit...`}
                  maxLength={1000}
                  rows={3}
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none resize-none mb-3"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "white",
                  }}
                />
                <button
                  onClick={handleReachOut}
                  disabled={sending || post.status !== "Open"}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium text-white transition-all disabled:opacity-50"
                  style={{ background: "var(--rm-purple)" }}
                >
                  <Send size={14} />
                  {post.status !== "Open"
                    ? "No longer open"
                    : sending
                      ? "Sending..."
                      : "Reach out"}
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default CollabDetailModal;
