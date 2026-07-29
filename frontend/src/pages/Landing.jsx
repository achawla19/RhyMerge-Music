import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Handshake,
  Radio,
  LayoutGrid,
  Users,
  Mic2,
  Music2,
  Guitar,
  Headphones,
  ArrowRight,
  ArrowDown,
} from "lucide-react";
import logo from "../assets/logo.png";

/* Constellation network — the thesis rendered as a picture. Nodes drift,
   light a line between themselves when close. "Everyone here is looking
   for someone" isn't a tagline, it's this canvas. */
const ConstellationField = ({ opacity = 0.85 }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let raf;
    let nodes = [];
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      const count = Math.min(60, Math.floor((w * h) / 16000));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        r: Math.random() * 1.6 + 0.8,
      }));
    };

    const LINK_DIST = 125;

    const draw = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);
      for (const n of nodes) {
        if (!reduceMotion) {
          n.x += n.vx;
          n.y += n.vy;
          if (n.x < 0 || n.x > w) n.vx *= -1;
          if (n.y < 0 || n.y > h) n.vy *= -1;
        }
      }
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < LINK_DIST) {
            ctx.strokeStyle = `rgba(249, 87, 111, ${(1 - d / LINK_DIST) * 0.35})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      for (const n of nodes) {
        ctx.fillStyle = "rgba(255, 122, 142, 0.8)";
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ opacity }}
    />
  );
};

const AmbientGlow = ({ style }) => (
  <motion.div
    className="absolute pointer-events-none"
    style={style}
    animate={{ opacity: [0.7, 1, 0.7] }}
    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
  />
);

/* Fixed vertical spine running down the left edge — the one running
   device that ties the whole scroll together, like a magazine's gutter
   marginalia instead of everything living in a dead-centered column. */
const Spine = () => (
  <div className="hidden lg:flex fixed left-7 top-0 h-screen z-40 flex-col items-center justify-between py-10 pointer-events-none">
    <div
      className="w-px h-24"
      style={{
        background:
          "linear-gradient(180deg, transparent, var(--rm-border-subtle))",
      }}
    />
    <p
      className="text-[10px] tracking-[0.3em] uppercase whitespace-nowrap"
      style={{
        writingMode: "vertical-rl",
        fontFamily: "var(--rm-font-mono)",
        color: "var(--rm-text-muted)",
      }}
    >
      find your people
    </p>
    <div
      className="w-px h-24"
      style={{
        background:
          "linear-gradient(0deg, transparent, var(--rm-border-subtle))",
      }}
    />
  </div>
);

const GhostNumber = ({ n, align = "left" }) => (
  <span
    className="absolute select-none pointer-events-none font-semibold"
    style={{
      [align]: "-2vw",
      top: "-6%",
      fontSize: "clamp(8rem, 18vw, 16rem)",
      color: "rgba(139,92,246,0.06)",
      lineHeight: 1,
      letterSpacing: "-0.05em",
    }}
  >
    {n}
  </span>
);

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

const CTAButton = ({ children, onClick, variant = "primary", size = "md" }) => {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all";
  const sizes = {
    sm: "px-5 py-2.5 text-sm",
    md: "px-7 py-3.5 text-sm",
    lg: "px-9 py-4 text-base",
  };
  const styles =
    variant === "primary"
      ? {
          background: "linear-gradient(135deg, #F9576F, #FF7A8E 55%, #FFB84D)",
          color: "#fff",
        }
      : {
          background: "rgba(255,255,255,0.04)",
          color: "var(--rm-text-primary)",
          border: "1px solid rgba(255,255,255,0.14)",
        };
  return (
    <button
      onClick={onClick}
      className={`${base} ${sizes[size]}`}
      style={styles}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow =
          variant === "primary" ? "0 12px 32px rgba(249, 87, 111, 0.4)" : "none";
        if (variant !== "primary")
          e.currentTarget.style.borderColor = "var(--rm-coral-light)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
        if (variant !== "primary")
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.14)";
      }}
    >
      {children}
    </button>
  );
};

const roles = [
  { title: "Producers", icon: Music2, blurb: "beats waiting for a voice" },
  { title: "Singers", icon: Mic2, blurb: "voices waiting for a track" },
  { title: "Guitarists", icon: Guitar, blurb: "riffs waiting for a room" },
  {
    title: "Engineers",
    icon: Headphones,
    blurb: "mixes waiting for a mission",
  },
];

const features = [
  {
    n: "01",
    icon: Radio,
    title: "Signals",
    eyebrow: "the feed",
    body: "Post the clip you're proud of, the loop stuck in your head, the thought at 2am. A feed that runs on what musicians actually make, not what an algorithm thinks will perform.",
  },
  {
    n: "02",
    icon: Handshake,
    title: "Collab",
    eyebrow: "the whole point",
    body: '"Need a vocalist for a lo-fi EP." Post what your project is missing, or answer someone else\'s call. No résumé, no interview — just two people who both want to make the same thing exist.',
  },
  {
    n: "03",
    icon: LayoutGrid,
    title: "Projects",
    eyebrow: "the proof",
    body: "A portfolio that's actually listenable. Stems, credits, the people who built it with you — the work that makes someone stop scrolling and reach out.",
  },
  {
    n: "04",
    icon: Users,
    title: "Syncs",
    eyebrow: "the network",
    body: "Every collaborator you find becomes someone you can find again. Build the list of people you actually want a text from when a new idea shows up.",
  },
];

const Landing = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.25]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 60]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="relative" style={{ background: "var(--rm-bg)" }}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <AmbientGlow
          style={{
            top: "-5%",
            left: "-10%",
            width: 800,
            height: 800,
            background:
              "radial-gradient(circle, rgba(249, 87, 111, 0.18), transparent 65%)",
          }}
        />
        <AmbientGlow
          style={{
            top: "90%",
            right: "-8%",
            width: 650,
            height: 650,
            background:
              "radial-gradient(circle, rgba(255, 122, 142, 0.1), transparent 65%)",
          }}
        />
        <AmbientGlow
          style={{
            top: "155%",
            left: "-5%",
            width: 700,
            height: 700,
            background:
              "radial-gradient(circle, rgba(249, 87, 111, 0.12), transparent 65%)",
          }}
        />
        <AmbientGlow
          style={{
            top: "215%",
            right: "0%",
            width: 750,
            height: 750,
            background:
              "radial-gradient(circle, rgba(255, 122, 142, 0.14), transparent 65%)",
          }}
        />
        <AmbientGlow
          style={{
            top: "280%",
            left: "10%",
            width: 600,
            height: 600,
            background:
              "radial-gradient(circle, rgba(249, 87, 111, 0.1), transparent 65%)",
          }}
        />
      </div>

      <Spine />

      {/* ── Top bar — logo pinned left, not centered ── */}
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? "rgba(11,11,18,0.8)" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: scrolled
            ? "1px solid var(--rm-border-subtle)"
            : "1px solid transparent",
        }}
      >
        <div className="flex items-center justify-between pl-7 lg:pl-20 pr-6 lg:pr-14 py-5">
          <img src={logo} alt="RhyMerge" className="h-8 w-auto" />
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/login")}
              className="hidden sm:block px-4 py-2 text-sm transition-colors"
              style={{ color: "var(--rm-text-secondary)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--rm-text-secondary)")
              }
            >
              Log in
            </button>
            <CTAButton onClick={() => navigate("/signup")} size="sm">
              Join free <ArrowRight size={14} />
            </CTAButton>
          </div>
        </div>
      </header>

      {/* ── HERO — split screen, headline pinned left, canvas owns the right ── */}
      <section
        ref={heroRef}
        className="relative min-h-screen w-full flex items-center overflow-hidden"
      >
        <div className="absolute inset-y-0 right-0 w-full lg:w-[58%]">
          <ConstellationField />
        </div>
        <div
          className="absolute inset-0 lg:bg-none"
          style={{
            background:
              "linear-gradient(90deg, var(--rm-bg) 0%, var(--rm-bg) 15%, transparent 55%)",
          }}
        />

        <motion.div
          style={{ opacity: heroOpacity, y: heroY }}
          className="relative z-10 w-full pl-7 lg:pl-20 pr-6 pt-24"
        >
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
            className="max-w-xl"
          >
            <motion.p
              variants={fadeUp}
              className="text-[12px] tracking-[0.2em] uppercase mb-7"
              style={{
                fontFamily: "var(--rm-font-mono)",
                color: "var(--rm-amber)",
              }}
            >
              a producer, a lyricist, a singer — a room away
            </motion.p>

            <motion.h1
              variants={fadeUp}
              className="font-semibold text-white leading-[1.04] mb-8"
              style={{
                fontSize: "clamp(2.6rem, 5.8vw, 4.75rem)",
                letterSpacing: "-0.015em",
              }}
            >
              Somebody out there
              <br />
              is missing{" "}
              <span
                style={{
                  fontFamily: "var(--rm-font-script)",
                  fontSize: "1.3em",
                  background:
                    "linear-gradient(135deg, #F9576F, #FF7A8E 45%, #FFB84D)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                what you make.
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-lg max-w-md mb-10"
              style={{ color: "var(--rm-text-secondary)", lineHeight: 1.75 }}
            >
              RhyMerge is where musicians post the work, find the missing piece,
              and build something neither of you could've made alone.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="flex flex-col sm:flex-row gap-4 mb-6"
            >
              <CTAButton onClick={() => navigate("/signup")} size="lg">
                Find your collaborator <ArrowRight size={17} />
              </CTAButton>
              <CTAButton
                onClick={() => navigate("/login")}
                variant="ghost"
                size="lg"
              >
                I already have an account
              </CTAButton>
            </motion.div>

            <motion.p
              variants={fadeUp}
              className="text-xs"
              style={{
                fontFamily: "var(--rm-font-mono)",
                color: "var(--rm-text-muted)",
              }}
            >
              free to join · takes about a minute · not a hiring board, just
              people
            </motion.p>
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute bottom-8 left-7 lg:left-20 z-10"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown size={18} color="var(--rm-text-muted)" />
        </motion.div>
      </section>

      {/* ── FEATURES — asymmetric split, alternating ratio + alignment, ghost numerals ── */}
      <div className="relative w-full">
        {features.map((f, i) => {
          const Icon = f.icon;
          const reverse = i % 2 === 1;
          return (
            <motion.section
              key={f.title}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="relative w-full py-24 lg:py-32 pl-7 lg:pl-20 pr-6 lg:pr-14 overflow-hidden"
            >
              <GhostNumber n={f.n} align={reverse ? "left" : "right"} />
              <div
                className={`relative flex flex-col ${reverse ? "lg:flex-row-reverse" : "lg:flex-row"} items-center gap-14 lg:gap-24`}
              >
                <motion.div
                  initial={{ opacity: 0, x: reverse ? 24 : -24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  style={{ flex: "1 1 52%" }}
                >
                  <h3
                    className="font-semibold text-white mb-3"
                    style={{
                      fontSize: "clamp(1.9rem, 3.6vw, 2.75rem)",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {f.title}
                  </h3>
                  <p
                    className="text-[11px] tracking-[0.18em] uppercase mb-5"
                    style={{
                      fontFamily: "var(--rm-font-mono)",
                      color: "var(--rm-amber)",
                    }}
                  >
                    {f.eyebrow}
                  </p>
                  <p
                    className="text-base max-w-md"
                    style={{
                      color: "var(--rm-text-secondary)",
                      lineHeight: 1.8,
                    }}
                  >
                    {f.body}
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.94 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="flex justify-center w-full"
                  style={{ flex: "1 1 42%" }}
                >
                  <div
                    className="relative w-full max-w-[280px] aspect-square rounded-[2.5rem] flex items-center justify-center"
                    style={{
                      background:
                        "radial-gradient(circle at 30% 30%, rgba(139,92,246,0.2), transparent 60%)",
                      border: "1px solid var(--rm-border)",
                      transform: reverse ? "rotate(-2deg)" : "rotate(2deg)",
                    }}
                  >
                    <div
                      className="w-28 h-28 rounded-[1.75rem] flex items-center justify-center"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(139,92,246,0.22), rgba(240,180,41,0.12))",
                        border: "1px solid var(--rm-purple-border)",
                      }}
                    >
                      <Icon
                        size={44}
                        color="var(--rm-purple-light)"
                        strokeWidth={1.5}
                      />
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.section>
          );
        })}
      </div>

      {/* ── Quiet positioning line — margin-aligned, not centered ── */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6 }}
        className="relative w-full pl-7 lg:pl-20 pr-6 py-6"
      >
        <p
          className="text-sm"
          style={{
            color: "var(--rm-text-muted)",
            fontFamily: "var(--rm-font-mono)",
          }}
        >
          not a hiring board, not another DAW — just the people
        </p>
      </motion.div>

      {/* ── ROLE DISCOVERY — staggered offsets instead of a flat symmetric grid ── */}
      <section className="relative w-full py-24 lg:py-32 pl-7 lg:pl-20 pr-6 lg:pr-14">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2
            className="font-semibold text-white mb-14 max-w-lg"
            style={{
              fontSize: "clamp(1.7rem, 3.2vw, 2.5rem)",
              letterSpacing: "-0.01em",
              lineHeight: 1.3,
            }}
          >
            Whoever your project is missing, they're probably already here.
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {roles.map((role, i) => {
              const Icon = role.icon;
              return (
                <motion.div
                  key={role.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  whileHover={{ y: -4 }}
                  onClick={() => navigate("/signup")}
                  className="cursor-pointer p-7 rounded-2xl transition-colors"
                  style={{
                    background: "rgba(255,255,255,0.025)",
                    border: "1px solid var(--rm-border-subtle)",
                    marginTop: i % 2 === 1 ? 28 : 0,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(139,92,246,0.06)";
                    e.currentTarget.style.borderColor =
                      "var(--rm-purple-border)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background =
                      "rgba(255,255,255,0.025)";
                    e.currentTarget.style.borderColor =
                      "var(--rm-border-subtle)";
                  }}
                >
                  <Icon
                    size={26}
                    color="var(--rm-purple-light)"
                    strokeWidth={1.5}
                    className="mb-5"
                  />
                  <h3 className="text-white font-medium text-lg mb-1.5">
                    {role.title}
                  </h3>
                  <p
                    className="text-sm"
                    style={{ color: "var(--rm-text-muted)" }}
                  >
                    {role.blurb}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* ── SOCIAL PROOF — animated counter stats ── */}
      <section className="relative w-full py-24 lg:py-32 pl-7 lg:pl-20 pr-6 lg:pr-14 border-t border-b" style={{ borderColor: "var(--rm-border-subtle)" }}>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12"
        >
          {[
            { label: "Active Musicians", value: "2.4K" },
            { label: "Collabs This Month", value: "842" },
            { label: "Countries Represented", value: "67" },
            { label: "Tracks Released", value: "3.1K" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <p style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700, color: "var(--rm-coral)", lineHeight: 1 }}>
                {stat.value}
              </p>
              <p style={{ color: "var(--rm-text-muted)", fontSize: "0.875rem", marginTop: 8, fontFamily: "var(--rm-font-mono)" }}>
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── WHY RHYMERGE — Comparison ── */}
      <section className="relative w-full py-24 lg:py-32 pl-7 lg:pl-20 pr-6 lg:pr-14">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2
            className="font-semibold text-white"
            style={{
              fontSize: "clamp(1.8rem, 3.4vw, 2.6rem)",
              letterSpacing: "-0.01em",
              maxWidth: 600,
            }}
          >
            Built for creators, by creators
          </h2>
          <p style={{ color: "var(--rm-text-secondary)", marginTop: 12, maxWidth: 500 }}>
            Unlike hiring boards or generic platforms, RhyMerge speaks music.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {[
            {
              title: "Share real work",
              desc: "Post stems, full tracks, snippets. Let your actual output do the talking.",
              icon: "♪",
            },
            {
              title: "Find your sound",
              desc: "Search by genre, mood, role. Or browse what's playing right now.",
              icon: "▶",
            },
            {
              title: "Build public portfolios",
              desc: "Every collab becomes proof. Credits, dates, playable links.",
              icon: "⚡",
            },
            {
              title: "Keep your network",
              desc: "One collab doesn't end the conversation. Build for life.",
              icon: "🔗",
            },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, x: i % 2 === 0 ? -12 : 12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="p-6 rounded-xl"
              style={{
                background: "rgba(249, 87, 111, 0.04)",
                border: "1px solid var(--rm-border)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--rm-coral)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--rm-border)";
              }}
            >
              <p style={{ fontSize: "1.5rem", marginBottom: 10 }}>{item.icon}</p>
              <h3 style={{ fontWeight: 600, color: "var(--rm-text-primary)", marginBottom: 6 }}>
                {item.title}
              </h3>
              <p style={{ color: "var(--rm-text-secondary)", fontSize: "0.95rem", lineHeight: 1.6 }}>
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS — Masonry-style layout ── */}
      <section className="relative w-full py-24 lg:py-32 pl-7 lg:pl-20 pr-6 lg:pr-14">
        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="font-semibold text-white mb-12"
          style={{
            fontSize: "clamp(1.8rem, 3.4vw, 2.6rem)",
            letterSpacing: "-0.01em",
          }}
        >
          Real collabs. Real stories.
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              quote: "I posted a 4-bar loop at 2am. Got 3 DMs by morning. Two became real collabs.",
              author: "Alex P., Producer",
              role: "Lo-fi · Brooklyn",
            },
            {
              quote: "Found my vocalist 20 minutes after posting. We finished the track in a week.",
              author: "Jordan M., Beatmaker",
              role: "Trap · Los Angeles",
            },
            {
              quote: "The credits on every track are actual collaborations. Feels different here.",
              author: "Casey T., Singer",
              role: "R&B · Austin",
            },
            {
              quote: "Built a three-person production group from RhyMerge collabs. None of us knew each other before.",
              author: "Morgan K., Engineer",
              role: "Electronic · Berlin",
            },
            {
              quote: "Posted my stems. Got mixed by someone I'd never have found anywhere else.",
              author: "Riley S., Vocalist",
              role: "Indie · Toronto",
            },
            {
              quote: "One collab led to five more. These are my people now.",
              author: "Sam R., Multi-instrumentalist",
              role: "Jazz Fusion · Tokyo",
            },
          ].map((testimonial, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="p-7 rounded-xl"
              style={{
                background: "var(--rm-bg-card)",
                border: "1px solid var(--rm-border)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--rm-coral)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--rm-border)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <p
                style={{
                  color: "var(--rm-text-secondary)",
                  fontSize: "0.95rem",
                  lineHeight: 1.7,
                  marginBottom: 14,
                  fontStyle: "italic",
                }}
              >
                "{testimonial.quote}"
              </p>
              <p style={{ fontWeight: 600, color: "var(--rm-text-primary)", fontSize: "0.9rem" }}>
                {testimonial.author}
              </p>
              <p
                style={{
                  fontSize: "0.8rem",
                  color: "var(--rm-text-muted)",
                  fontFamily: "var(--rm-font-mono)",
                  marginTop: 4,
                }}
              >
                {testimonial.role}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FINAL CTA — split, not centered ── */}
      <section className="relative w-full py-28 lg:py-36 pl-7 lg:pl-20 pr-6 lg:pr-14 overflow-hidden">
        <div className="relative flex flex-col lg:flex-row lg:items-end justify-between gap-10">
          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="text-white"
            style={{
              fontFamily: "var(--rm-font-script)",
              fontSize: "clamp(3rem, 6.5vw, 5rem)",
              lineHeight: 1.1,
              maxWidth: 520,
            }}
          >
            Stop making it alone.
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="flex flex-col items-start lg:items-end gap-5"
          >
            <p
              className="text-base max-w-xs lg:text-right"
              style={{ color: "var(--rm-text-secondary)" }}
            >
              Your profile takes a minute. Finding the right person might take
              less.
            </p>
            <CTAButton onClick={() => navigate("/signup")} size="lg">
              Create your profile <ArrowRight size={17} />
            </CTAButton>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer
        className="relative w-full pl-7 lg:pl-20 pr-6 lg:pr-14 py-10"
        style={{ borderTop: "1px solid var(--rm-border-subtle)" }}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p
            className="text-xs"
            style={{
              fontFamily: "var(--rm-font-mono)",
              color: "var(--rm-text-muted)",
            }}
          >
            © {new Date().getFullYear()} RhyMerge — where rhythms collide
          </p>
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate("/login")}
              className="text-xs"
              style={{ color: "var(--rm-text-muted)" }}
            >
              Log in
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="text-xs"
              style={{ color: "var(--rm-purple-light)" }}
            >
              Sign up
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
