import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import heroImage from "../assets/hero.png";

// ─── Live counter — ambient, ticks gently ─────────────────────
const useLiveCounter = (base) => {
  const [count, setCount] = useState(base);
  useEffect(() => {
    const id = setInterval(() => {
      setCount((c) => c + Math.round((Math.random() - 0.3) * 4));
    }, 2400);
    return () => clearInterval(id);
  }, []);
  return count;
};

// ─── Canvas waveform background ───────────────────────────────
const HeroWaveCanvas = () => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let t = 0;
    let raf;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const waves = [
      {
        amp: 16,
        freq: 0.012,
        speed: 0.022,
        yRatio: 0.5,
        col: "rgba(192,132,252,0.16)",
        lw: 1.5,
      },
      {
        amp: 10,
        freq: 0.018,
        speed: 0.035,
        yRatio: 0.65,
        col: "rgba(124,58,237,0.10)",
        lw: 1,
      },
      {
        amp: 20,
        freq: 0.008,
        speed: 0.014,
        yRatio: 0.8,
        col: "rgba(124,58,237,0.08)",
        lw: 1,
      },
    ];

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      waves.forEach((w) => {
        ctx.beginPath();
        ctx.strokeStyle = w.col;
        ctx.lineWidth = w.lw;
        const y0 = canvas.height * w.yRatio;
        for (let x = 0; x <= canvas.width; x += 3) {
          const y = y0 + Math.sin(x * w.freq + t * w.speed * 40) * w.amp;
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
      });
      t++;
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
};

const Hero = () => {
  const navigate = useNavigate();
  const [shouldAnimate, setShouldAnimate] = useState(true);
  const liveCount = useLiveCounter(1284);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    setShouldAnimate(!prefersReducedMotion);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.05 },
    },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };
  const MotionDiv = shouldAnimate ? motion.div : "div";

  return (
    <div
      className="relative overflow-hidden rounded-3xl"
      style={{ border: "1px solid var(--rm-border)" }}
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt=""
          className="w-full h-full object-cover"
          style={{ opacity: 0.55 }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(11,8,20,0.55) 0%, rgba(11,8,20,0.92) 100%)",
          }}
        />
      </div>

      {/* Animated waveform overlay */}
      <HeroWaveCanvas />

      {/* Content */}
      <MotionDiv
        className="relative z-10 px-6 sm:px-10 lg:px-14 py-12 lg:py-16"
        variants={shouldAnimate ? containerVariants : {}}
        initial={shouldAnimate ? "hidden" : false}
        animate={shouldAnimate ? "visible" : false}
      >
        {/* Live pill */}
        <MotionDiv variants={shouldAnimate ? itemVariants : {}}>
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-5"
            style={{
              background: "rgba(124,58,237,0.14)",
              border: "1px solid var(--rm-purple-border)",
            }}
          >
            <span className="rm-pulse" />
            <span
              className="text-[11px]"
              style={{
                fontFamily: "var(--rm-font-mono)",
                color: "var(--rm-purple-light)",
              }}
            >
              {liveCount.toLocaleString()} musicians live right now
            </span>
          </div>
        </MotionDiv>

        <MotionDiv variants={shouldAnimate ? itemVariants : {}}>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
            Drop a stem.
            <br />
            <span style={{ color: "var(--rm-purple-light)" }}>
              Start a movement.
            </span>
          </h1>
        </MotionDiv>

        <MotionDiv variants={shouldAnimate ? itemVariants : {}}>
          <p
            className="text-sm sm:text-base mb-8 max-w-md"
            style={{ color: "#C4B5FD", lineHeight: 1.7 }}
          >
            RhyMerge is where producers, vocalists, and engineers broadcast raw
            ideas, sync with the right people, and merge sound into something
            real.
          </p>
        </MotionDiv>

        <MotionDiv
          variants={shouldAnimate ? itemVariants : {}}
          className="flex flex-col sm:flex-row gap-3"
        >
          <button
            onClick={() => navigate("/projects")}
            className="px-7 py-3 rounded-full text-sm font-semibold text-white transition-all"
            style={{ background: "var(--rm-purple)" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#6D28D9")}
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "var(--rm-purple)")
            }
          >
            Start a Mix
          </button>
          <button
            onClick={() => navigate("/search")}
            className="px-7 py-3 rounded-full text-sm font-semibold transition-all"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid var(--rm-purple-border)",
              color: "var(--rm-text-primary)",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.borderColor = "var(--rm-purple)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.borderColor = "var(--rm-purple-border)")
            }
          >
            Find Stems
          </button>
        </MotionDiv>
      </MotionDiv>
    </div>
  );
};

export default Hero;
