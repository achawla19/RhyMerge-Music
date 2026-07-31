import { useEffect, useState } from "react";

const items = [
  "🔥 4 producers match your style",
  "🎸 12 projects are looking for guitarists",
  "🎤 New vocalist joined RhyMerge today",
  "🚀 Indie Rock is trending this week",
  "🤝 You have 3 potential collaborators",
];

export default function GlobalTicker() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % items.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="
        sticky
        top-28

        z-30

        px-6
        py-3

        border-b
        border-white/[0.06]

        bg-[#171211]/80
        backdrop-blur-xl
      "
    >
      <div
        className="
          max-w-7xl
          mx-auto

          flex
          items-center
          gap-4
        "
      >
        <span
          className="
            text-[10px]
            font-bold

            uppercase
            tracking-[0.25em]

            text-[#FF8B93]
          "
        >
          LIVE
        </span>

        <span
          key={index}
          className="
            text-sm

            text-slate-300

            transition-all
          "
        >
          {items[index]}
        </span>
      </div>
    </div>
  );
}
