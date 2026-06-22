import { Music, Mic, Sparkles } from "lucide-react";

const BioSection = ({ bio, genre, instruments = [] }) => {
  return (
    <div
      className="rounded-2xl p-6"
      style={{
        background: "var(--rm-bg-card)",
        border: "1px solid var(--rm-border)",
      }}
    >
      <div className="flex items-center gap-2 mb-5">
        <Sparkles size={18} color="#C084FC" />
        <h2 className="text-lg font-semibold text-white">About</h2>
      </div>

      <p className="text-sm leading-relaxed mb-6" style={{ color: "#D1D5DB" }}>
        {bio || "No bio available yet."}
      </p>

      <div className="mb-5">
        <div
          className="flex items-center gap-2 mb-2"
          style={{ color: "var(--rm-text-muted)" }}
        >
          <Music size={14} />
          <span
            className="text-xs"
            style={{ fontFamily: "var(--rm-font-mono)" }}
          >
            genres
          </span>
        </div>
        <p className="text-sm text-white">{genre || "Not specified"}</p>
      </div>

      <div>
        <div
          className="flex items-center gap-2 mb-3"
          style={{ color: "var(--rm-text-muted)" }}
        >
          <Mic size={14} />
          <span
            className="text-xs"
            style={{ fontFamily: "var(--rm-font-mono)" }}
          >
            skills & instruments
          </span>
        </div>

        {instruments.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {instruments.map((inst) => (
              <span
                key={inst}
                className="px-3 py-1 rounded-full text-xs"
                style={{
                  background: "var(--rm-purple-dim)",
                  border: "1px solid var(--rm-purple-border)",
                  color: "var(--rm-purple-light)",
                }}
              >
                {inst}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm" style={{ color: "var(--rm-text-muted)" }}>
            no instruments listed
          </p>
        )}
      </div>
    </div>
  );
};

export default BioSection;
