import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Music2,
  Users,
  TrendingUp,
  Zap,
  ArrowRight,
  Play,
  Gauge,
  Hash,
  UserPlus,
  Check,
  Loader2,
  Handshake,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useProjectPanel } from "../context/ProjectPanelContext";
import { getProjects, searchProjects } from "../api/projects";
import { getCollabPosts } from "../api/collab";
import { sendConnectionRequest, getSentRequests } from "../api/connection";
import CollabCard from "../components/collab/CollabCard";

const API = import.meta.env.VITE_API_URL;

const GENRES = [
  "All",
  "Hip-Hop",
  "R&B",
  "Pop",
  "Electronic",
  "Rock",
  "Jazz",
  "Afrobeats",
  "Lo-Fi",
  "Trap",
  "Soul",
];

const GENRE_COLORS = {
  "Hip-Hop": "#FF8B93",
  "R&B": "#F472B6",
  Pop: "#60A5FA",
  Electronic: "#34D399",
  Rock: "#FBBF24",
  Jazz: "#FB923C",
  Afrobeats: "#4ADE80",
  "Lo-Fi": "#67E8F9",
  Trap: "#F87171",
  Soul: "#FCD34D",
};

// ── Mini project row ──────────────────────────────────────────────────────────
const ProjectRow = ({ project, onClick }) => (
  <div
    onClick={onClick}
    className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all group"
    style={{
      background: "rgba(255,255,255,0.02)",
      border: "1px solid transparent",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.background = "rgba(249,87,111,0.07)";
      e.currentTarget.style.borderColor = "rgba(249,87,111,0.2)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background = "rgba(255,255,255,0.02)";
      e.currentTarget.style.borderColor = "transparent";
    }}
  >
    <div
      className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden"
      style={{
        background: project.coverImage ? undefined : "var(--rm-purple-dim)",
        border: "1px solid var(--rm-purple-border)",
      }}
    >
      {project.coverImage ? (
        <img
          src={project.coverImage}
          alt=""
          className="w-full h-full object-cover"
        />
      ) : (
        <Music2 size={16} color="#FF8B93" />
      )}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-white truncate group-hover:text-[#FFC2C7] transition-colors">
        {project.title}
      </p>
      <div className="flex items-center gap-2 mt-0.5">
        <span
          className="text-[11px]"
          style={{
            color: "var(--rm-text-muted)",
            fontFamily: "var(--rm-font-mono)",
          }}
        >
          {project.genre || "—"}
        </span>
        {project.bpm && (
          <span
            className="text-[11px] flex items-center gap-0.5"
            style={{ color: "#60A5FA", fontFamily: "var(--rm-font-mono)" }}
          >
            <Gauge size={9} />
            {project.bpm}
          </span>
        )}
        {project.musicalKey && (
          <span
            className="text-[11px] flex items-center gap-0.5"
            style={{ color: "#FBBF24", fontFamily: "var(--rm-font-mono)" }}
          >
            <Hash size={9} />
            {project.musicalKey}
          </span>
        )}
      </div>
    </div>
    {project.lookingForCollaborators && (
      <span
        className="text-[10px] px-2 py-0.5 rounded-full flex-shrink-0"
        style={{
          background: "rgba(16,185,129,0.1)",
          color: "#34D399",
          border: "1px solid rgba(16,185,129,0.3)",
        }}
      >
        open
      </span>
    )}
  </div>
);

// ── Trending creator card ─────────────────────────────────────────────────────
const CreatorCard = ({ creator, isPending, onConnect }) => {
  const navigate = useNavigate();
  const [pending, setPending] = useState(isPending);
  const [loading, setLoading] = useState(false);

  const handleConnect = async (e) => {
    e.stopPropagation();
    if (pending || loading) return;
    setLoading(true);
    try {
      await onConnect(creator._id);
      setPending(true);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={() => navigate(`/profile/${creator.username}`)}
      className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all"
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid transparent",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "rgba(249,87,111,0.07)";
        e.currentTarget.style.borderColor = "rgba(249,87,111,0.2)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "rgba(255,255,255,0.02)";
        e.currentTarget.style.borderColor = "transparent";
      }}
    >
      <div className="relative flex-shrink-0">
        <img
          src={
            creator.avatar ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(creator.name || creator.username)}&background=F9576F&color=fff`
          }
          alt=""
          className="w-11 h-11 rounded-xl object-cover"
          style={{ border: "1.5px solid var(--rm-purple-border)" }}
        />
        {creator.availability === "Available" && (
          <span
            className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2"
            style={{ background: "#22C55E", borderColor: "var(--rm-bg)" }}
          />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate">
          {creator.name || creator.username}
        </p>
        <p
          className="text-[11px] truncate"
          style={{
            fontFamily: "var(--rm-font-mono)",
            color: "var(--rm-purple-light)",
          }}
        >
          {creator.role || "Creator"}
        </p>
        {creator._trendingReason && (
          <p
            className="text-[10px] truncate mt-0.5"
            style={{ color: "var(--rm-text-muted)", fontStyle: "italic" }}
          >
            {creator._trendingReason}
          </p>
        )}
      </div>
      <button
        onClick={handleConnect}
        disabled={pending || loading}
        className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all disabled:opacity-50"
        style={
          pending
            ? { background: "rgba(16,185,129,0.15)", color: "#34D399" }
            : {
                background: "var(--rm-purple-dim)",
                border: "1px solid var(--rm-purple-border)",
                color: "var(--rm-purple-light)",
              }
        }
      >
        {loading ? (
          <Loader2 size={11} className="animate-spin" />
        ) : pending ? (
          <Check size={11} />
        ) : (
          <UserPlus size={11} />
        )}
      </button>
    </div>
  );
};

export default function Home() {
  const navigate = useNavigate();
  const { openPanel } = useProjectPanel();
  const { user } = useAuth();

  const [activeGenre, setActiveGenre] = useState("All");
  const [projects, setProjects] = useState([]);
  const [creators, setCreators] = useState([]);
  const [collabPosts, setCollabPosts] = useState([]);
  const [collabLoading, setCollabLoading] = useState(true);
  const [pendingIds, setPendingIds] = useState([]);
  const [stats, setStats] = useState({ projects: 0, connections: 0 });
  const [loading, setLoading] = useState(true);
  const [creatorsLoading, setCreatorsLoading] = useState(true);
  const [genreLoading, setGenreLoading] = useState(false);

  const safe = (p, fb) => p.catch(() => fb);

  // Load stats + trending creators on mount
  useEffect(() => {
    let cancelled = false;

    safe(getProjects(1, 20), { projects: [], total: 0 }).then((res) => {
      if (cancelled) return;
      setProjects(res.projects || []);
      setStats((s) => ({ ...s, projects: res.total || 0 }));
      setLoading(false);
    });

    safe(getCollabPosts({ status: "Open" }), { posts: [] }).then((res) => {
      if (cancelled) return;
      setCollabPosts((res.posts || []).slice(0, 3));
      setCollabLoading(false);
    });

    Promise.all([
      safe(
        fetch(`${API}/api/trending/creators`, { credentials: "include" }).then(
          (r) => (r.ok ? r.json() : []),
        ),
        [],
      ),
      safe(getSentRequests(), []),
    ]).then(([trending, sent]) => {
      if (cancelled) return;
      setCreators(trending);
      setPendingIds((sent || []).map((u) => u._id));
      setCreatorsLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  // Genre filter
  const handleGenre = useCallback(async (genre) => {
    setActiveGenre(genre);
    if (genre === "All") {
      setGenreLoading(true);
      const res = await safe(getProjects(1, 20), { projects: [] });
      setProjects(res.projects || []);
      setGenreLoading(false);
      return;
    }
    setGenreLoading(true);
    const data = await safe(searchProjects({ genre }), []);
    setProjects(Array.isArray(data) ? data : data.projects || []);
    setGenreLoading(false);
  }, []);

  const handleConnect = async (userId) => {
    await sendConnectionRequest(userId);
    setPendingIds((prev) => [...prev, userId]);
  };

  const displayProjects = projects.slice(0, 12);

  return (
    <div className="space-y-6">
      {/* GREETING */}
      <div className="flex items-end justify-between">
        <div>
          <h1
            className="text-4xl text-white"
            style={{ fontFamily: "var(--rm-font-script)" }}
          >
            Good{" "}
            {new Date().getHours() < 12
              ? "morning"
              : new Date().getHours() < 17
                ? "afternoon"
                : "evening"}
            ,{" "}
            <span style={{ color: "var(--rm-purple-light)" }}>
              {user?.name?.split(" ")[0] || user?.username}
            </span>
          </h1>
          <p
            className="mt-1 text-sm"
            style={{
              color: "var(--rm-text-muted)",
              fontFamily: "var(--rm-font-mono)",
            }}
          >
            who are you making something with today?
          </p>
        </div>
        <button
          onClick={() => navigate("/projects")}
          className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all"
          style={{ background: "var(--rm-purple)" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#D63850")}
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "var(--rm-purple)")
          }
        >
          <Zap size={14} /> Post a Project
        </button>
      </div>

      {/* QUICK STATS — subtle, interactive */}
      <div className="flex gap-3 flex-wrap">
        {[
          {
            label: "projects on platform",
            value: stats.projects,
            icon: <Music2 size={13} color="#FF8B93" />,
            onClick: () => navigate("/projects"),
          },
          {
            label: "your syncs",
            value: user?.connections?.length ?? "—",
            icon: <Users size={13} color="#34D399" />,
            onClick: () => navigate("/network"),
          },
        ].map(({ label, value, icon, onClick }) => (
          <button
            key={label}
            onClick={onClick}
            className="flex items-center gap-2 px-4 py-2 rounded-full transition-all"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(249,87,111,0.35)";
              e.currentTarget.style.background = "rgba(249,87,111,0.06)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
              e.currentTarget.style.background = "rgba(255,255,255,0.04)";
            }}
          >
            {icon}
            <span
              className="font-semibold text-white text-sm"
              style={{ fontFamily: "var(--rm-font-mono)" }}
            >
              {value}
            </span>
            <span className="text-xs" style={{ color: "var(--rm-text-muted)" }}>
              {label}
            </span>
          </button>
        ))}
      </div>

      {/* GENRE FILTER PILLS */}
      <div
        className="flex gap-2 overflow-x-auto pb-1 scrollbar-none"
        style={{ scrollbarWidth: "none" }}
      >
        {GENRES.map((genre) => {
          const active = activeGenre === genre;
          const color = GENRE_COLORS[genre] || "#FF8B93";
          return (
            <button
              key={genre}
              onClick={() => handleGenre(genre)}
              className="flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-medium transition-all"
              style={
                active
                  ? {
                      background: genre === "All" ? "#fff" : `${color}22`,
                      border: `1px solid ${genre === "All" ? "#fff" : color}`,
                      color: genre === "All" ? "#000" : color,
                    }
                  : {
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "var(--rm-text-muted)",
                    }
              }
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.borderColor =
                    genre === "All" ? "#fff" : color;
                  e.currentTarget.style.color =
                    genre === "All" ? "#fff" : color;
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                  e.currentTarget.style.color = "var(--rm-text-muted)";
                }
              }}
            >
              {genre}
            </button>
          );
        })}
      </div>

      {/* TWO COLUMN DISCOVERY */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* LEFT — Projects */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: "var(--rm-bg-card)",
            border: "1px solid var(--rm-border)",
          }}
        >
          <div className="flex items-center justify-between px-5 pt-5 pb-3">
            <div className="flex items-center gap-2">
              <Music2 size={15} color="#FF8B93" />
              <h2 className="font-semibold text-white text-sm">
                {activeGenre === "All"
                  ? "Open Projects"
                  : `${activeGenre} Projects`}
              </h2>
            </div>
            <button
              onClick={() => navigate("/projects")}
              className="flex items-center gap-1 text-xs transition-colors"
              style={{
                color: "var(--rm-purple-light)",
                fontFamily: "var(--rm-font-mono)",
              }}
            >
              all <ArrowRight size={11} />
            </button>
          </div>

          <div className="px-3 pb-3">
            {loading || genreLoading ? (
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="h-14 rounded-xl animate-pulse"
                    style={{ background: "rgba(255,255,255,0.03)" }}
                  />
                ))}
              </div>
            ) : displayProjects.length === 0 ? (
              <div className="py-12 text-center">
                <p
                  className="text-sm"
                  style={{ color: "var(--rm-text-muted)" }}
                >
                  No {activeGenre} projects yet
                </p>
                <button
                  onClick={() => navigate("/projects")}
                  className="mt-2 text-xs"
                  style={{ color: "var(--rm-purple-light)" }}
                >
                  start one →
                </button>
              </div>
            ) : (
              <div className="space-y-1">
                {displayProjects.map((p, i) => (
                  <div key={p._id} className="flex items-center gap-2">
                    <span
                      className="text-[10px] w-4 text-right flex-shrink-0"
                      style={{
                        color: "var(--rm-text-muted)",
                        fontFamily: "var(--rm-font-mono)",
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="flex-1">
                      <ProjectRow
                        project={p}
                        onClick={() => openPanel(p._id)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT — Trending Creators */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: "var(--rm-bg-card)",
            border: "1px solid var(--rm-border)",
          }}
        >
          <div className="flex items-center justify-between px-5 pt-5 pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp size={15} color="#F472B6" />
              <h2 className="font-semibold text-white text-sm">
                Trending Creators
              </h2>
              <span
                className="text-[9px] px-2 py-0.5 rounded-full flex items-center gap-1"
                style={{
                  background: "rgba(244,114,182,0.1)",
                  color: "#F472B6",
                  border: "1px solid rgba(244,114,182,0.3)",
                  fontFamily: "var(--rm-font-mono)",
                }}
              >
                AI
              </span>
            </div>
            <button
              onClick={() => navigate("/network")}
              className="flex items-center gap-1 text-xs transition-colors"
              style={{
                color: "var(--rm-purple-light)",
                fontFamily: "var(--rm-font-mono)",
              }}
            >
              all <ArrowRight size={11} />
            </button>
          </div>

          <div className="px-3 pb-3">
            {creatorsLoading ? (
              <div className="space-y-2">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="h-14 rounded-xl animate-pulse"
                    style={{ background: "rgba(255,255,255,0.03)" }}
                  />
                ))}
              </div>
            ) : creators.length === 0 ? (
              <div className="py-12 text-center">
                <p
                  className="text-sm"
                  style={{ color: "var(--rm-text-muted)" }}
                >
                  No trending creators yet
                </p>
                <p
                  className="text-xs mt-1"
                  style={{
                    color: "var(--rm-text-muted)",
                    fontFamily: "var(--rm-font-mono)",
                  }}
                >
                  complete your profile to appear here
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                {creators.map((c, i) => (
                  <div key={c._id} className="flex items-center gap-2">
                    <span
                      className="text-[10px] w-4 text-right flex-shrink-0"
                      style={{
                        color: "var(--rm-text-muted)",
                        fontFamily: "var(--rm-font-mono)",
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="flex-1">
                      <CreatorCard
                        creator={c}
                        isPending={pendingIds.includes(c._id)}
                        onConnect={handleConnect}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* COLLAB TEASER — surfaces open collaboration posts on the home feed */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: "var(--rm-bg-card)",
          border: "1px solid var(--rm-border)",
        }}
      >
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <div className="flex items-center gap-2">
            <Handshake size={15} color="var(--rm-purple-light)" />
            <h2 className="font-semibold text-white text-sm">
              People looking to collaborate
            </h2>
          </div>
          <button
            onClick={() => navigate("/collab")}
            className="flex items-center gap-1 text-xs transition-colors"
            style={{
              color: "var(--rm-purple-light)",
              fontFamily: "var(--rm-font-mono)",
            }}
          >
            all <ArrowRight size={11} />
          </button>
        </div>

        <div className="px-5 pb-5">
          {collabLoading ? (
            <div className="grid md:grid-cols-3 gap-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-48 rounded-xl animate-pulse"
                  style={{ background: "rgba(255,255,255,0.03)" }}
                />
              ))}
            </div>
          ) : collabPosts.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-sm" style={{ color: "var(--rm-text-muted)" }}>
                No open collab posts right now
              </p>
              <button
                onClick={() => navigate("/collab")}
                className="mt-2 text-xs"
                style={{ color: "var(--rm-purple-light)" }}
              >
                post what you're looking for →
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-3">
              {collabPosts.map((post) => (
                <CollabCard
                  key={post._id}
                  post={post}
                  onOpen={(p) => navigate(`/collab/${p._id}`)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
