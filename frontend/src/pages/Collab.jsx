import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Handshake, Plus, SlidersHorizontal, X } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import CollabCard from "../components/collab/CollabCard";
import CollabComposer from "../components/collab/CollabComposer";
import CollabDetailModal from "../components/collab/CollabDetailModal";
import { getCollabPosts, getCollabPostById } from "../api/collab";
import { ROLES, GENRES } from "../constants/profileOptions";

const TERMS = ["Paid", "Revenue Split", "Credit Only", "Just for Fun"];

const FilterPill = ({ active, children, onClick }) => (
  <button
    onClick={onClick}
    className="px-3 py-1.5 rounded-xl text-xs transition-all whitespace-nowrap"
    style={
      active
        ? {
            background: "var(--rm-purple-dim)",
            border: "1px solid var(--rm-purple-border)",
            color: "var(--rm-purple-light)",
          }
        : {
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "var(--rm-text-muted)",
          }
    }
  >
    {children}
  </button>
);

const Collab = () => {
  const { id: deepLinkId } = useParams();
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [showComposer, setShowComposer] = useState(false);
  const [activePost, setActivePost] = useState(null);

  const [lookingFor, setLookingFor] = useState("");
  const [genre, setGenre] = useState("");
  const [terms, setTerms] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getCollabPosts({ lookingFor, genre, terms });
      setPosts(data.posts || []);
    } catch {
      // stays empty; the empty state below covers this gracefully
    } finally {
      setLoading(false);
    }
  }, [lookingFor, genre, terms]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!deepLinkId) return;
    getCollabPostById(deepLinkId)
      .then(setActivePost)
      .catch(() => {})
      .finally(() => navigate("/collab", { replace: true }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deepLinkId]);

  const hasActiveFilters = lookingFor || genre || terms;
  const clearFilters = () => {
    setLookingFor("");
    setGenre("");
    setTerms("");
  };

  return (
    <div>
      <PageHeader
        title="Collab"
        subtitle="find the person your project is missing"
        action={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters((v) => !v)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm transition-all"
              style={{
                background: showFilters
                  ? "var(--rm-purple-dim)"
                  : "rgba(255,255,255,0.04)",
                border: `1px solid ${showFilters ? "var(--rm-purple-border)" : "rgba(255,255,255,0.08)"}`,
                color: showFilters
                  ? "var(--rm-purple-light)"
                  : "var(--rm-text-secondary)",
              }}
            >
              <SlidersHorizontal size={14} />
              Filters
              {hasActiveFilters && (
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: "var(--rm-purple-light)" }}
                />
              )}
            </button>
            <button
              onClick={() => setShowComposer(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white transition-all"
              style={{ background: "var(--rm-purple)" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#D63850")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "var(--rm-purple)")
              }
            >
              <Plus size={15} />
              Post a Collab
            </button>
          </div>
        }
      />

      {showFilters && (
        <div
          className="rounded-2xl p-5 mb-6 space-y-4"
          style={{
            background: "var(--rm-bg-card)",
            border: "1px solid var(--rm-border)",
          }}
        >
          <div className="flex items-center justify-between">
            <p
              className="text-[11px] uppercase tracking-wider"
              style={{
                fontFamily: "var(--rm-font-mono)",
                color: "var(--rm-purple-light)",
              }}
            >
              Refine
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 text-xs"
                style={{ color: "var(--rm-text-muted)" }}
              >
                <X size={12} /> Clear
              </button>
            )}
          </div>

          <div>
            <p
              className="text-xs mb-2"
              style={{
                fontFamily: "var(--rm-font-mono)",
                color: "var(--rm-text-muted)",
              }}
            >
              looking for
            </p>
            <div className="flex flex-wrap gap-2">
              {ROLES.map((r) => (
                <FilterPill
                  key={r}
                  active={lookingFor === r}
                  onClick={() => setLookingFor(lookingFor === r ? "" : r)}
                >
                  {r}
                </FilterPill>
              ))}
            </div>
          </div>

          <div>
            <p
              className="text-xs mb-2"
              style={{
                fontFamily: "var(--rm-font-mono)",
                color: "var(--rm-text-muted)",
              }}
            >
              genre
            </p>
            <div className="flex flex-wrap gap-2">
              {GENRES.map((g) => (
                <FilterPill
                  key={g}
                  active={genre === g}
                  onClick={() => setGenre(genre === g ? "" : g)}
                >
                  {g}
                </FilterPill>
              ))}
            </div>
          </div>

          <div>
            <p
              className="text-xs mb-2"
              style={{
                fontFamily: "var(--rm-font-mono)",
                color: "var(--rm-text-muted)",
              }}
            >
              terms
            </p>
            <div className="flex flex-wrap gap-2">
              {TERMS.map((t) => (
                <FilterPill
                  key={t}
                  active={terms === t}
                  onClick={() => setTerms(terms === t ? "" : t)}
                >
                  {t}
                </FilterPill>
              ))}
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl animate-pulse"
              style={{
                background: "var(--rm-bg-card)",
                border: "1px solid var(--rm-border)",
                height: 240,
              }}
            />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div
          className="rounded-2xl p-12 text-center"
          style={{
            background: "var(--rm-bg-card)",
            border: "1px solid var(--rm-border)",
          }}
        >
          <Handshake
            size={28}
            color="var(--rm-purple-light)"
            className="mx-auto mb-3"
          />
          <p className="text-white font-medium mb-1">
            {hasActiveFilters
              ? "Nothing matches those filters"
              : "No collab posts yet"}
          </p>
          <p className="text-sm" style={{ color: "var(--rm-text-muted)" }}>
            {hasActiveFilters
              ? "Try clearing a filter or two."
              : "Be the first to post what you're working on."}
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {posts.map((post) => (
            <CollabCard key={post._id} post={post} onOpen={setActivePost} />
          ))}
        </div>
      )}

      <CollabComposer
        isOpen={showComposer}
        onClose={() => setShowComposer(false)}
        onCreated={(post) => setPosts((prev) => [post, ...prev])}
      />

      <CollabDetailModal
        post={activePost}
        isOpen={!!activePost}
        onClose={() => setActivePost(null)}
        onChanged={(updated) => {
          if (updated?._id) {
            setPosts((prev) =>
              prev.map((p) => (p._id === updated._id ? updated : p)),
            );
            setActivePost(updated);
          }
        }}
        onDeleted={(id) => {
          setPosts((prev) => prev.filter((p) => p._id !== id));
          setActivePost(null);
        }}
      />
    </div>
  );
};

export default Collab;
