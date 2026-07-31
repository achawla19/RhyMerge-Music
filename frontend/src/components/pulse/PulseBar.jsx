import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import { notificationVisuals } from "../../utils/notificationStyles";

export default function PulseBar({ notifications = [] }) {
  const navigate = useNavigate();

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const pulseItems = notifications.filter((n) => n.priority <= 2).slice(0, 10);

  const fallbackItems = [
    {
      id: "welcome",
      type: "system",
      title: "Create your first project and start collaborating",
      link: "/projects",
    },

    {
      id: "network",
      type: "system",
      title: "Discover creators that match your style",
      link: "/network",
    },

    {
      id: "projects",
      type: "system",
      title: "Browse active music projects looking for talent",
      link: "/projects",
    },
  ];

  const feed = pulseItems.length > 0 ? pulseItems : fallbackItems;

  // Keep index valid whenever feed changes
  useEffect(() => {
    if (index >= feed.length) {
      setIndex(0);
    }
  }, [feed.length, index]);

  // Rotation
  useEffect(() => {
    if (paused || feed.length <= 1) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % feed.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [feed.length, paused]);

  const current = feed[index];

  const visual =
    notificationVisuals[current?.type] || notificationVisuals.system;

  const Icon = visual.icon;

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onClick={() => current?.link && navigate(current.link)}
      className="
        relative

        cursor-pointer

        border-b
        border-white/[0.06]

        bg-gradient-to-r
        from-[#F9576F]/[0.06]
        via-transparent
        to-cyan-500/[0.05]

        backdrop-blur-xl

        px-6
        py-2

        hover:bg-white/[0.02]

        transition-all

        overflow-hidden
      "
    >
      {/* Progress Bar */}
      {!paused && (
        <motion.div
          key={index}
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{
            duration: 4.5,
            ease: "linear",
          }}
          className="
            absolute
            bottom-0
            left-0

            h-[2px]

            bg-gradient-to-r
            from-[#F9576F]
            to-cyan-500
          "
        />
      )}

      <div
        className="
          max-w-7xl
          mx-auto

          flex
          items-center
          gap-4
        "
      >
        {/* Icon */}
        <div className="flex items-center gap-3 shrink-0">
          <div
            className={`
              w-8
              h-8

              rounded-xl

              flex
              items-center
              justify-center

              border

              ${visual.bg}
              ${visual.border}
            `}
          >
            <Icon size={16} className={visual.color} />
          </div>

          <span
            className="
              text-[10px]
              uppercase

              tracking-[0.25em]

              text-[#FF8B93]

              font-semibold
            "
          >
            Pulse
          </span>
        </div>

        {/* Notification */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current._id || current.id}
            initial={{
              opacity: 0,
              y: 8,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -8,
            }}
            transition={{
              duration: 0.25,
            }}
            className="
              flex
              items-center
              justify-between

              w-full

              text-sm
              text-slate-300
            "
          >
            <span className="truncate">{current.title}</span>

            <span
              className="
                ml-4

                text-xs

                text-[#FF8B93]

                hidden
                md:block
              "
            >
              View →
            </span>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
