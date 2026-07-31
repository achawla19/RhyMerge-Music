import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  Handshake,
  LayoutGrid,
  MessageSquare,
  Radio,
  SlidersHorizontal,
  ShieldCheck,
} from "lucide-react";
import logo from "../assets/logo.png";
import ProductPreview from "../components/landing/ProductPreview";
import TiltCard from "../components/landing/TiltCard";

/* Every feature below maps to a real, shipped part of the product —
   not aspirational marketing copy. Keep this list in sync with what's
   actually in the app; if a feature gets cut, cut it here too. */
const FEATURES = [
  {
    icon: Handshake,
    title: "Collab requests",
    body: "Post what you're working on and what you need — a role, a genre, and terms (paid, revenue split, credit, or just for fun). People who actually make that thing find you, instead of you cold-messaging strangers.",
    accent: "var(--rm-coral)",
  },
  {
    icon: LayoutGrid,
    title: "Project rooms",
    body: "Every collaboration gets a dedicated space: files, version history, and a request queue for who's asking to join, so a track doesn't end up scattered across three apps and a group chat.",
    accent: "var(--rm-accent-teal)",
  },
  {
    icon: MessageSquare,
    title: "Real-time messaging",
    body: "Private, encrypted conversations with the people you're working with — built for exchanging ideas and files quickly, not for building a following.",
    accent: "var(--rm-accent-gold)",
  },
  {
    icon: Radio,
    title: "Signal",
    body: "A live pulse of relevant activity — new collab posts, connection requests, project updates — so you know what's happening without scrolling a feed built to keep you scrolling.",
    accent: "var(--rm-accent-violet)",
  },
  {
    icon: SlidersHorizontal,
    title: "Search by role & genre",
    body: "Filter creators by what they actually do — vocalist, producer, mix engineer — and by genre, so you're browsing people relevant to what you're making, not everyone on the platform.",
    accent: "var(--rm-coral)",
  },
  {
    icon: ShieldCheck,
    title: "Availability status",
    body: "Set yourself Available, Busy, or Not Looking. It's a small thing, but it means you're not sending a request into a profile nobody's checked in weeks.",
    accent: "var(--rm-accent-teal)",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Post or browse",
    body: "Put up a collab request with what you need, or search active ones by role and genre.",
  },
  {
    n: "02",
    title: "Connect",
    body: "Message directly, share reference tracks, and agree on terms before anything's committed.",
  },
  {
    n: "03",
    title: "Build in a project room",
    body: "Move into a shared space for files and versions once you're actually working together.",
  },
];

const Landing = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const heroRef = useRef(null);

  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const heroFade = useTransform(heroProgress, [0, 0.7], [1, 0]);

  return (
    <div
      style={{ background: "var(--rm-bg)", color: "var(--rm-text-primary)" }}
    >
      {/* ── NAV ─────────────────────────────────────────────── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? "rgba(14,11,10,0.85)" : "transparent",
          backdropFilter: scrolled ? "blur(16px)" : "none",
          borderBottom: scrolled
            ? "1px solid var(--rm-border)"
            : "1px solid transparent",
        }}
      >
        <div className="max-w-6xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
          <img src={logo} alt="RhyMerge" className="h-6 md:h-7 w-auto" />
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/login")}
              className="hidden sm:block text-sm font-medium px-4 py-2 rounded-full transition-colors"
              style={{ color: "var(--rm-text-secondary)" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--rm-text-primary)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--rm-text-secondary)")
              }
            >
              Log in
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="rm-btn rm-btn-primary text-sm"
            >
              Join free <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </nav>

      {/* ── HERO — two column: copy left, WebGL vinyl right ──── */}
      <section
        ref={heroRef}
        className="relative min-h-[90svh] flex items-center pt-24 pb-16 md:pt-16 md:pb-0 overflow-hidden"
      >
        <div className="max-w-6xl mx-auto px-6 md:px-10 grid md:grid-cols-2 gap-12 items-center w-full">
          <motion.div style={{ opacity: heroFade }} className="relative z-10">
            <p
              className="text-xs mb-5 tracking-[0.18em]"
              style={{
                fontFamily: "var(--rm-font-mono)",
                color: "var(--rm-coral-light)",
              }}
            >
              A COLLABORATION PLATFORM FOR MUSICIANS
            </p>
            <h1
              className="font-semibold mb-6"
              style={{
                fontFamily: "var(--rm-font-display)",
                fontSize: "clamp(2.4rem, 4.6vw, 3.6rem)",
                lineHeight: 1.08,
                letterSpacing: "-0.015em",
              }}
            >
              Find the people who'll actually
              <span style={{ fontStyle: "italic", fontWeight: 500 }}>
                {" "}
                finish the track
              </span>{" "}
              with you.
            </h1>
            <p
              className="text-base md:text-lg mb-9 max-w-md"
              style={{ color: "var(--rm-text-secondary)" }}
            >
              RhyMerge connects producers, vocalists, and writers through real
              collaboration requests, shared project rooms, and direct messaging
              — not another social feed to manage.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/signup")}
                className="rm-btn rm-btn-primary text-sm px-6 py-3"
                style={{ fontWeight: 600 }}
              >
                Get started <ArrowRight size={15} />
              </button>
              <button
                onClick={() => navigate("/login")}
                className="rm-btn rm-btn-ghost text-sm px-6 py-3"
              >
                I have an account
              </button>
            </div>
          </motion.div>

          <div className="relative flex items-center justify-center md:justify-end">
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(55% 55% at 50% 45%, rgba(249,87,111,0.1), transparent 70%)",
              }}
            />
            <ProductPreview />
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────── */}
      <section
        className="max-w-6xl mx-auto px-6 md:px-10 py-20 md:py-28 border-t"
        style={{ borderColor: "var(--rm-border)" }}
      >
        <div className="mb-14 max-w-xl">
          <p
            className="text-xs mb-3 tracking-[0.18em]"
            style={{
              fontFamily: "var(--rm-font-mono)",
              color: "var(--rm-text-muted)",
            }}
          >
            WHAT'S ACTUALLY IN THE APP
          </p>
          <h2
            className="font-semibold"
            style={{
              fontFamily: "var(--rm-font-display)",
              fontSize: "clamp(1.7rem, 3.2vw, 2.4rem)",
              letterSpacing: "-0.01em",
            }}
          >
            Every part of RhyMerge exists to get a project from idea to finished
            track.
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f, i) => (
            <TiltCard key={f.title} max={5}>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="rm-card h-full p-6 flex flex-col"
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-5"
                  style={{
                    background: `${f.accent}1f`,
                    border: `1px solid ${f.accent}44`,
                  }}
                >
                  <f.icon size={18} color={f.accent} />
                </div>
                <h3 className="text-base font-semibold text-white mb-2">
                  {f.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--rm-text-secondary)" }}
                >
                  {f.body}
                </p>
              </motion.div>
            </TiltCard>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────── */}
      <section
        className="py-20 md:py-28 border-t"
        style={{
          borderColor: "var(--rm-border)",
          background: "var(--rm-bg-card)",
        }}
      >
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <p
            className="text-xs mb-3 tracking-[0.18em]"
            style={{
              fontFamily: "var(--rm-font-mono)",
              color: "var(--rm-text-muted)",
            }}
          >
            HOW IT WORKS
          </p>
          <h2
            className="font-semibold mb-14 max-w-lg"
            style={{
              fontFamily: "var(--rm-font-display)",
              fontSize: "clamp(1.7rem, 3.2vw, 2.4rem)",
              letterSpacing: "-0.01em",
            }}
          >
            Three steps, no algorithm deciding who you meet.
          </h2>

          <div className="grid md:grid-cols-3 gap-10">
            {STEPS.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <p
                  className="text-sm mb-3"
                  style={{
                    fontFamily: "var(--rm-font-mono)",
                    color: "var(--rm-coral-light)",
                  }}
                >
                  {s.n}
                </p>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {s.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--rm-text-secondary)" }}
                >
                  {s.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────── */}
      <section
        className="py-24 md:py-32 px-6 text-center border-t"
        style={{ borderColor: "var(--rm-border)" }}
      >
        <div className="max-w-xl mx-auto">
          <h2
            className="font-semibold mb-8"
            style={{
              fontFamily: "var(--rm-font-display)",
              fontSize: "clamp(1.9rem, 4vw, 2.8rem)",
              letterSpacing: "-0.01em",
              lineHeight: 1.15,
            }}
          >
            Your next collaborator is probably already{" "}
            <span
              style={{
                fontStyle: "italic",
                fontWeight: 500,
                color: "var(--rm-coral-light)",
              }}
            >
              looking
            </span>
            .
          </h2>
          <button
            onClick={() => navigate("/signup")}
            className="rm-btn rm-btn-primary text-sm px-7 py-3"
            style={{ fontWeight: 600 }}
          >
            Join RhyMerge — it's free <ArrowRight size={15} />
          </button>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────── */}
      <footer
        className="border-t py-8 px-6 md:px-10 flex flex-col sm:flex-row items-center justify-between gap-4"
        style={{ borderColor: "var(--rm-border)" }}
      >
        <img src={logo} alt="RhyMerge" className="h-5 w-auto opacity-70" />
        <p className="text-xs" style={{ color: "var(--rm-text-muted)" }}>
          © {new Date().getFullYear()} RhyMerge.
        </p>
      </footer>
    </div>
  );
};

export default Landing;
