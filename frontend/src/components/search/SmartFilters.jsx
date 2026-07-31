import { Mic, Headphones, Music2, Disc3, Guitar, X } from "lucide-react";
import { ROLES, GENRES } from "../../constants/profileOptions";

const ROLE_ICONS = {
  Singer: Mic,
  Producer: Headphones,
  Songwriter: Music2,
  DJ: Disc3,
  Musician: Guitar,
  "Sound Engineer": Headphones,
};

const SmartFilters = ({
  selectedRole,
  selectedGenre,
  onSelectRole,
  onSelectGenre,
  onSelectTag,
}) => {
  const hasFilters = selectedRole || selectedGenre;

  return (
    <div
      className="rounded-2xl p-5"
      style={{
        background: "var(--rm-bg-card)",
        border: "1px solid var(--rm-border)",
      }}
    >
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-white text-sm font-medium">Filters</h3>
        {hasFilters && (
          <button
            onClick={() => {
              onSelectRole(null);
              onSelectGenre(null);
              // onSelectTag is optional — Search.jsx doesn't currently
              // implement tag filtering, so guard against it being undefined.
              onSelectTag?.(null);
            }}
            className="flex items-center gap-1 text-xs transition-colors"
            style={{ color: "var(--rm-text-muted)" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "var(--rm-coral-light)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "var(--rm-text-muted)")
            }
          >
            <X size={12} /> Clear
          </button>
        )}
      </div>

      <div className="space-y-5">
        <div>
          <p
            className="text-[10px] mb-3 uppercase tracking-wider"
            style={{
              fontFamily: "var(--rm-font-mono)",
              color: "var(--rm-text-muted)",
            }}
          >
            role
          </p>
          <div className="flex flex-wrap gap-2">
            {ROLES.map((role) => {
              const Icon = ROLE_ICONS[role];
              const active = selectedRole === role;
              return (
                <button
                  key={role}
                  onClick={() => onSelectRole(active ? null : role)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition-all"
                  style={
                    active
                      ? {
                          background: "var(--rm-accent-teal-dim)",
                          border: "1px solid rgba(92,138,122,0.35)",
                          color: "var(--rm-accent-teal)",
                        }
                      : {
                          background: "rgba(255,255,255,0.03)",
                          border: "1px solid rgba(255,255,255,0.07)",
                          color: "var(--rm-text-muted)",
                        }
                  }
                >
                  {Icon && <Icon size={13} />}
                  {role}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <p
            className="text-[10px] mb-3 uppercase tracking-wider"
            style={{
              fontFamily: "var(--rm-font-mono)",
              color: "var(--rm-text-muted)",
            }}
          >
            genre
          </p>
          <div className="flex flex-wrap gap-2">
            {GENRES.map((genre) => {
              const active = selectedGenre === genre;
              return (
                <button
                  key={genre}
                  onClick={() => onSelectGenre(active ? null : genre)}
                  className="px-3 py-1.5 rounded-xl text-xs transition-all"
                  style={
                    active
                      ? {
                          background: "var(--rm-accent-violet-dim)",
                          border: "1px solid rgba(140,123,168,0.35)",
                          color: "var(--rm-accent-violet)",
                        }
                      : {
                          background: "rgba(255,255,255,0.03)",
                          border: "1px solid rgba(255,255,255,0.07)",
                          color: "var(--rm-text-muted)",
                        }
                  }
                >
                  {genre}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartFilters;
