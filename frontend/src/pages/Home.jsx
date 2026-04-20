import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Play } from "lucide-react";
import WhoFor from "../components/WhoFor";

const Home = () => {
  const navigate = useNavigate();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 40 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  };

  return (
    <div className="w-full bg-[#0a0a12] text-white overflow-hidden">
      {/* ================= HERO ================= */}
      <section className="relative h-screen w-full flex items-center justify-center">
        {/* BACKGROUND IMAGE */}
        <img
          src="/src/assets/hero.jpg"
          alt="studio"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* DARK OVERLAY */}
        <div className="absolute inset-0 bg-black/60" />

        {/* NEON GRADIENT OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/40 via-transparent to-cyan-900/40" />

        {/* LIGHT STREAK EFFECT */}
        <div className="absolute inset-0 backdrop-blur-[1px]" />

        {/* CONTENT */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="relative z-10 text-center px-6 max-w-5xl"
        >
          <div className="absolute inset-0 blur-[120px] opacity-30 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500" />
          {/* HEADING */}
          <motion.h1
            variants={item}
            className=" text-6xl md:text-7xl leading-tight text-center text-5xl md:text-7xl font-extrabold leading-tight tracking-tight"
          >
            {/* <h1 className="text-6xl md:text-7xl leading-tight text-center"> */}
            {/* LINE 1 */}
            <span className="glass-heading block">
              <span className="base">Collaborate. Create.</span>
              <span className="overlay">Collaborate. Create.</span>
            </span>

            {/* LINE 2 */}
            <span className="glass-heading block mt-2">
              <span className="base">Merge Your Sound.</span>
              <span className="overlay">Merge Your Sound.</span>
            </span>
            {/* </h1> */}
          </motion.h1>

          {/* SUBTEXT */}
          <motion.p
            variants={item}
            className="mt-6 text-lg md:text-xl text-gray-300 max-w-2xl mx-auto"
          >
            The ultimate platform for producers, vocalists, and sound engineers
            to unite and create extraordinary music together.
          </motion.p>

          {/* BUTTONS */}
          <motion.div
            variants={item}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
          >
            {/* PRIMARY */}
            <motion.button
              onClick={() => navigate("/projects")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="group relative px-8 py-4 rounded-full text-white font-semibold 
  bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 
  flex items-center gap-2 overflow-hidden"
            >
              <Play size={18} />
              Start A Project
              {/* GLOW LAYER */}
              <span
                className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 
  blur-xl bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 
  transition duration-300 pointer-events-none"
              ></span>
            </motion.button>

            {/* SECONDARY */}
            <motion.button
              onClick={() => navigate("/search")}
              initial={{ scale: 1, boxShadow: "0 0 0 rgba(0,0,0,0)" }}
              animate={{ scale: 1, boxShadow: "0 0 0 rgba(0,0,0,0)" }}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 40px rgba(168, 85, 247, 0.6)",
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="px-8 py-4 rounded-full border border-white/20 backdrop-blur-md bg-white/5 text-white"
            >
              Find Artists
            </motion.button>
          </motion.div>
        </motion.div>
      </section>

      {/* ================= WHO FOR ================= */}
      <div className="relative z-10">
        <WhoFor />
      </div>

      {/* ================= FOOTER ================= */}
      <footer className="py-10 text-center text-gray-400 border-t border-white/10">
        © 2026 RhyMerge. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;
