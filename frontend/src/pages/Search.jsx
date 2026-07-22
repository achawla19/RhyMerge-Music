import { useEffect, useState, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Search as SearchIcon,
  X,
  SlidersHorizontal,
  UserPlus,
  Check,
  Compass,
} from "lucide-react";
import { searchProjects, getProjects } from "../api/projects";
import { searchUsers } from "../api/user";
import { sendConnectionRequest, getSentRequests } from "../api/connection";
import ProjectCard from "../components/projects/ProjectCard";

const ROLES = [
  "Vocalist",
  "Producer",
  "Mix Engineer",
  "Lyricist",
  "Guitarist",
  "Drummer",
  "Keyboardist",
  "Sound Designer",
  "Mastering Engineer",
  "Beatmaker",
];
const GENRES = [
  "Hip-Hop",
  "R&B",
  "Pop",
  "Electronic",
  "Rock",
  "Jazz",
  "Classical",
  "Afrobeats",
  "Lo-Fi",
  "Trap",
  "Soul",
  "Reggae",
];
const AVAIL = ["Available", "Busy", "Not Looking"];

const GENRE_COLORS = {
  "Hip-Hop": "#C084FC",
  "R&B": "#F472B6",
  Pop: "#60A5FA",
  Electronic: "#34D399",
  Rock: "#FBBF24",
  Jazz: "#FB923C",
  Classical: "#A78BFA",
  Afrobeats: "#4ADE80",
  "Lo-Fi": "#67E8F9",
  Trap: "#F87171",
  Soul: "#FCD34D",
  Reggae: "#6EE7B7",
};

// ── Artist card ───────────────────────────────────────────────────────────────
const ArtistCard = ({ artist, isPending, onConnect }) => {
  const navigate = useNavigate();
  const [pending, setPending] = useState(isPending);
  const [loading, setLoading] = useState(false);

  const handleConnect = async (e) => {
    e.stopPropagation();
    if (pending || loading) return;
    setLoading(true);
    try {
      await onConnect(artist._id);
      setPending(true);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={() => navigate(`/profile/${artist.username}`)}
      className="rounded-2xl p-4 cursor-pointer transition-all"
      style={{
        background: "var(--rm-bg-card)",
        border: "1px solid var(--rm-border)",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.borderColor = "rgba(124,58,237,0.45)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.borderColor = "var(--rm-border)")
      }
    >
      <div className="flex items-start gap-3">
        <img
          src={
            artist.avatar ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(artist.name || artist.username)}&background=7c3aed&color=fff`
          }
          alt=""
          className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
          style={{ border: "1px solid var(--rm-purple-border)" }}
        />
        <div className="flex-1 min-w-0">
          <p className="font-medium text-white truncate">
            {artist.name || artist.username}
          </p>
          <p
            className="text-xs truncate"
            style={{
              fontFamily: "var(--rm-font-mono)",
              color: "var(--rm-purple-light)",
            }}
          >
            {artist.role || "Creator"}
          </p>
          {artist.location && (
            <p
              className="text-xs mt-0.5"
              style={{ color: "var(--rm-text-muted)" }}
            >
              {artist.location}
            </p>
          )}
        </div>
        <span
          className="text-[10px] px-2 py-0.5 rounded-full flex-shrink-0"
          style={{
            background:
              artist.availability === "Available"
                ? "rgba(16,185,129,0.1)"
                : "rgba(107,114,128,0.1)",
            color: artist.availability === "Available" ? "#34D399" : "#9CA3AF",
            border: `1px solid ${artist.availability === "Available" ? "rgba(16,185,129,0.3)" : "rgba(107,114,128,0.2)"}`,
          }}
        >
          {artist.availability || "—"}
        </span>
      </div>

      {artist.genres?.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-3">
          {artist.genres.slice(0, 3).map((g) => (
            <span
              key={g}
              className="text-[10px] px-2 py-0.5 rounded-full"
              style={{
                background: "var(--rm-purple-dim)",
                color: "var(--rm-purple-light)",
                border: "1px solid var(--rm-purple-border)",
              }}
            >
              {g}
            </span>
          ))}
        </div>
      )}

      <div className="mt-3 flex justify-end">
        <button
          onClick={handleConnect}
          disabled={pending || loading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all disabled:opacity-50"
          style={
            pending
              ? {
                  background: "rgba(16,185,129,0.1)",
                  border: "1px solid rgba(16,185,129,0.3)",
                  color: "#34D399",
                }
              : {
                  background: "var(--rm-purple-dim)",
                  border: "1px solid var(--rm-purple-border)",
                  color: "var(--rm-purple-light)",
                }
          }
        >
          {pending ? (
            <>
              <Check size={11} /> Synced
            </>
          ) : (
            <>
              <UserPlus size={11} /> Sync
            </>
          )}
        </button>
      </div>
    </div>
  );
};

// ── Section header ────────────────────────────────────────────────────────────
const SectionHead = ({ title, count }) => (
  <div className="flex items-center justify-between mb-3">
    <h2 className="font-semibold text-white text-sm">{title}</h2>
    {count !== undefined && (
      <span
        className="text-xs"
        style={{
          fontFamily: "var(--rm-font-mono)",
          color: "var(--rm-text-muted)",
        }}
      >
        {count} found
      </span>
    )}
  </div>
);

export default function Search() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [tab, setTab] = useState("Creators");
  const [role, setRole] = useState(searchParams.get("role") || "");
  const [genre, setGenre] = useState(searchParams.get("genre") || "");
  const [avail, setAvail] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Search results
  const [artists, setArtists] = useState([]);
  const [projects, setProjects] = useState([]);
  const [pending, setPending] = useState([]);
  const [searching, setSearching] = useState(false);

  // Explore data (shown when no query)
  const [featured, setFeatured] = useState([]);
  const [openCollabs, setOpenCollabs] = useState([]);
  const [suggested, setSuggested] = useState([]);
  const [exploreLoading, setExploreLoading] = useState(true);
  const [activeGenre, setActiveGenre] = useState(null);
  const [genreProjects, setGenreProjects] = useState([]);
  const [genreLoading, setGenreLoading] = useState(false);

  const isSearching = query.trim() || role || genre || avail;

  // Load explore data once
  useEffect(() => {
    Promise.all([
      getProjects(1, 8),
      searchUsers({ availability: "Available" }).catch(() => []),
      getSentRequests().catch(() => []),
    ])
      .then(([projRes, users, sent]) => {
        const projs = projRes.projects || [];
        const featuredProjs = projs.slice(0, 4);
        const featuredIds = new Set(featuredProjs.map((p) => p._id));
        setFeatured(featuredProjs);
        setOpenCollabs(
          projs
            .filter((p) => p.lookingForCollaborators && !featuredIds.has(p._id))
            .slice(0, 4),
        );
        setSuggested(users.slice(0, 6));
        setPending(sent.map((u) => u._id));
      })
      .finally(() => setExploreLoading(false));
  }, []);

  // Search on query/filter change
  const doSearch = useCallback(async () => {
    if (!isSearching) return;
    setSearching(true);
    try {
      const [arts, projs] = await Promise.all([
        searchUsers({ q: query, role, genre, availability: avail }),
        searchProjects({ q: query, genre }),
      ]);
      setArtists(arts);
      setProjects(Array.isArray(projs) ? projs : projs.projects || []);
    } catch {
    } finally {
      setSearching(false);
    }
  }, [query, role, genre, avail, isSearching]);

  useEffect(() => {
    const t = setTimeout(doSearch, 300);
    return () => clearTimeout(t);
  }, [doSearch]);

  const handleGenreClick = async (g) => {
    if (activeGenre === g) {
      setActiveGenre(null);
      setGenreProjects([]);
      return;
    }
    setActiveGenre(g);
    setGenreLoading(true);
    try {
      const data = await searchProjects({ genre: g });
      setGenreProjects(Array.isArray(data) ? data.slice(0, 4) : []);
    } catch {
      setGenreProjects([]);
    } finally {
      setGenreLoading(false);
    }
  };

  const handleConnect = async (userId) => {
    await sendConnectionRequest(userId);
    setPending((prev) => [...prev, userId]);
  };

  const clearAll = () => {
    setQuery("");
    setRole("");
    setGenre("");
    setAvail("");
  };
  const hasFilters = role || genre || avail;

  return (
    <div className="space-y-6">
      {/* ── SEARCH BAR ── */}
      <div className="flex gap-3">
        <div className="relative flex-1 max-w-2xl">
          <SearchIcon
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2"
            style={{ color: "var(--rm-text-muted)" }}
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="search creators, projects, genres..."
            className="w-full pl-11 pr-10 py-3 rounded-2xl outline-none"
            style={{
              background: "var(--rm-bg-card)",
              border: "1px solid var(--rm-purple-border)",
              color: "var(--rm-text-primary)",
              fontFamily: "var(--rm-font-mono)",
              fontSize: 13,
            }}
            onFocus={(e) =>
              (e.currentTarget.style.borderColor = "var(--rm-purple)")
            }
            onBlur={(e) =>
              (e.currentTarget.style.borderColor = "var(--rm-purple-border)")
            }
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2"
              style={{ color: "var(--rm-text-muted)" }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        <button
          onClick={() => setShowFilters((v) => !v)}
          className="px-4 rounded-2xl flex items-center gap-2 text-sm transition-all"
          style={{
            background:
              showFilters || hasFilters
                ? "var(--rm-purple-dim)"
                : "var(--rm-bg-card)",
            border: `1px solid ${showFilters || hasFilters ? "var(--rm-purple-border)" : "var(--rm-border)"}`,
            color:
              showFilters || hasFilters
                ? "var(--rm-purple-light)"
                : "var(--rm-text-muted)",
          }}
        >
          <SlidersHorizontal size={15} />
          {hasFilters && (
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: "var(--rm-purple)" }}
            />
          )}
        </button>

        {(query || hasFilters) && (
          <button
            onClick={clearAll}
            className="px-3 rounded-2xl text-xs flex items-center gap-1"
            style={{
              background: "rgba(248,113,113,0.08)",
              border: "1px solid rgba(248,113,113,0.2)",
              color: "#F87171",
            }}
          >
            <X size={13} /> Clear
          </button>
        )}
      </div>

      {/* ── FILTERS PANEL ── */}
      {showFilters && (
        <div
          className="rounded-2xl p-5 space-y-4"
          style={{
            background: "var(--rm-bg-card)",
            border: "1px solid var(--rm-border)",
          }}
        >
          <div>
            <p
              className="text-xs mb-2"
              style={{
                fontFamily: "var(--rm-font-mono)",
                color: "var(--rm-text-muted)",
              }}
            >
              role
            </p>
            <div className="flex flex-wrap gap-2">
              {ROLES.map((r) => (
                <button
                  key={r}
                  onClick={() => setRole(role === r ? "" : r)}
                  className="px-3 py-1.5 rounded-xl text-xs transition-all"
                  style={
                    role === r
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
                  {r}
                </button>
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
                <button
                  key={g}
                  onClick={() => setGenre(genre === g ? "" : g)}
                  className="px-3 py-1.5 rounded-xl text-xs transition-all"
                  style={
                    genre === g
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
                  {g}
                </button>
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
              availability
            </p>
            <div className="flex gap-2">
              {AVAIL.map((a) => (
                <button
                  key={a}
                  onClick={() => setAvail(avail === a ? "" : a)}
                  className="px-3 py-1.5 rounded-xl text-xs transition-all"
                  style={
                    avail === a
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
                  {a}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          SEARCH MODE — query or filters active
      ══════════════════════════════════════════════════════════════ */}
      {isSearching ? (
        <div className="space-y-8">
          {/* Tab switcher */}
          <div
            className="flex gap-1 p-1 rounded-2xl w-fit"
            style={{
              background: "var(--rm-bg-card)",
              border: "1px solid var(--rm-border)",
            }}
          >
            {["Creators", "Projects"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="px-5 py-2 rounded-xl text-sm font-medium transition-all"
                style={
                  tab === t
                    ? {
                        background: "var(--rm-purple-dim)",
                        color: "var(--rm-text-primary)",
                        border: "1px solid var(--rm-purple-border)",
                      }
                    : {
                        color: "var(--rm-text-muted)",
                        border: "1px solid transparent",
                      }
                }
              >
                {t}
              </button>
            ))}
          </div>

          {searching ? (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="h-44 rounded-2xl animate-pulse"
                  style={{ background: "var(--rm-bg-card)" }}
                />
              ))}
            </div>
          ) : tab === "Creators" ? (
            <>
              <SectionHead title="Creators" count={artists.length} />
              {artists.length === 0 ? (
                <p
                  className="text-sm py-12 text-center"
                  style={{
                    color: "var(--rm-text-muted)",
                    fontFamily: "var(--rm-font-mono)",
                  }}
                >
                  no creators found
                </p>
              ) : (
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {artists.map((a) => (
                    <ArtistCard
                      key={a._id}
                      artist={a}
                      isPending={pending.includes(a._id)}
                      onConnect={handleConnect}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              <SectionHead title="Projects" count={projects.length} />
              {projects.length === 0 ? (
                <p
                  className="text-sm py-12 text-center"
                  style={{
                    color: "var(--rm-text-muted)",
                    fontFamily: "var(--rm-font-mono)",
                  }}
                >
                  no projects found
                </p>
              ) : (
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {projects.map((p) => (
                    <ProjectCard key={p._id} project={p} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        /* ══════════════════════════════════════════════════════════════
         EXPLORE MODE — no query, show discovery content
      ══════════════════════════════════════════════════════════════ */
        <div className="space-y-10">
          {/* Browse by genre */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Compass size={16} color="#C084FC" />
              <h2 className="font-semibold text-white">Browse by Genre</h2>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {GENRES.map((g) => {
                const color = GENRE_COLORS[g] || "#C084FC";
                const active = activeGenre === g;
                return (
                  <button
                    key={g}
                    onClick={() => handleGenreClick(g)}
                    className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
                    style={
                      active
                        ? {
                            background: `${color}22`,
                            border: `1px solid ${color}66`,
                            color,
                          }
                        : {
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.08)",
                            color: "var(--rm-text-muted)",
                          }
                    }
                    onMouseEnter={(e) => {
                      if (!active) {
                        e.currentTarget.style.color = color;
                        e.currentTarget.style.borderColor = `${color}44`;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!active) {
                        e.currentTarget.style.color = "var(--rm-text-muted)";
                        e.currentTarget.style.borderColor =
                          "rgba(255,255,255,0.08)";
                      }
                    }}
                  >
                    {g}
                  </button>
                );
              })}
            </div>

            {activeGenre &&
              (genreLoading ? (
                <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-48 rounded-2xl animate-pulse"
                      style={{ background: "var(--rm-bg-card)" }}
                    />
                  ))}
                </div>
              ) : genreProjects.length === 0 ? (
                <p
                  className="text-sm py-6 text-center"
                  style={{
                    color: "var(--rm-text-muted)",
                    fontFamily: "var(--rm-font-mono)",
                  }}
                >
                  no {activeGenre} projects yet
                </p>
              ) : (
                <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
                  {genreProjects.map((p) => (
                    <ProjectCard key={p._id} project={p} />
                  ))}
                </div>
              ))}
          </div>

          {/* Featured projects */}
          {!exploreLoading && featured.length > 0 && (
            <div>
              <SectionHead title="Featured Projects" />
              <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
                {featured.map((p) => (
                  <ProjectCard key={p._id} project={p} />
                ))}
              </div>
            </div>
          )}

          {/* Open collabs */}
          {!exploreLoading && openCollabs.length > 0 && (
            <div>
              <SectionHead title="Open for Collab" />
              <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
                {openCollabs.map((p) => (
                  <ProjectCard key={p._id} project={p} />
                ))}
              </div>
            </div>
          )}

          {/* Available creators */}
          {!exploreLoading && suggested.length > 0 && (
            <div>
              <SectionHead title="Available Creators" />
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                {suggested.map((c) => (
                  <ArtistCard
                    key={c._id}
                    artist={c}
                    isPending={pending.includes(c._id)}
                    onConnect={handleConnect}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Browse by role */}
          <div>
            <SectionHead title="Find by Role" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {ROLES.slice(0, 8).map((r) => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className="p-4 rounded-2xl text-left transition-all"
                  style={{
                    background: "var(--rm-bg-card)",
                    border: "1px solid var(--rm-border)",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.borderColor =
                      "rgba(124,58,237,0.45)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.borderColor = "var(--rm-border)")
                  }
                >
                  <p className="text-sm font-medium text-white">{r}</p>
                  <p
                    className="text-xs mt-0.5"
                    style={{
                      color: "var(--rm-text-muted)",
                      fontFamily: "var(--rm-font-mono)",
                    }}
                  >
                    find one →
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
