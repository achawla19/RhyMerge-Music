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
      className="
        rounded-2xl
        border border-white/[0.06]

        bg-white/[0.03]
        backdrop-blur-xl

        p-5
      "
    >
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-white text-sm font-medium">Filters</h3>

        {hasFilters && (
          <button
            onClick={() => {
              onSelectRole(null);
              onSelectGenre(null);
              onSelectTag(null);
            }}
            className="
              flex items-center gap-1

              text-xs
              text-slate-400

              hover:text-white
            "
          >
            <X size={12} />
            Clear
          </button>
        )}
      </div>

      <div className="space-y-5">
        <div>
          <p className="text-xs text-slate-500 mb-3 uppercase tracking-wider">
            Role
          </p>

          <div className="flex flex-wrap gap-2">
            {ROLES.map((role) => {
              const Icon = ROLE_ICONS[role];
              return (
                <button
                  key={role}
                  onClick={() =>
                    onSelectRole(selectedRole === role ? null : role)
                  }
                  className={`
                    flex items-center gap-2

                    px-3
                    py-2

                    rounded-xl

                    text-xs

                    transition-all

                    ${
                      selectedRole === role
                        ? "bg-purple-500/15 border border-purple-500/30 text-purple-300"
                        : "bg-white/[0.03] border border-white/[0.06] text-slate-400"
                    }
                  `}
                >
                  <Icon size={14} />
                  {role}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <p className="text-xs text-slate-500 mb-3 uppercase tracking-wider">
            Genre
          </p>

          <div className="flex flex-wrap gap-2">
            {GENRES.map((genre) => (
              <button
                key={genre}
                onClick={() =>
                  onSelectGenre(selectedGenre === genre ? null : genre)
                }
                className={`
                  px-3
                  py-1.5

                  rounded-xl

                  text-xs

                  transition-all

                  ${
                    selectedGenre === genre
                      ? "bg-purple-500/15 border border-purple-500/30 text-purple-300"
                      : "bg-white/[0.03] border border-white/[0.06] text-slate-400"
                  }
                `}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartFilters;
