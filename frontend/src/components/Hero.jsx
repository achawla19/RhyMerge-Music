import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import heroImage from "../assets/hero.png";

const Hero = () => {
  const [shouldAnimate, setShouldAnimate] = useState(true);

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
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const MotionDiv = shouldAnimate ? motion.div : "div";

  return (
    <div className="relative min-h-screen w-screen flex items-center justify-center overflow-hidden px-4 sm:px-8 lg:px-16">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Music production studio background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B2540]/90 via-[#0B2540]/60 to-transparent" />
      </div>

      {/* Content */}
      <MotionDiv
        className="relative z-10 w-full text-center"
        variants={shouldAnimate ? containerVariants : {}}
        initial={shouldAnimate ? "hidden" : false}
        animate={shouldAnimate ? "visible" : false}
      >
        <MotionDiv variants={shouldAnimate ? itemVariants : {}}>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Collaborate.
            <br />
            Create.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7B61FF] to-[#E36FFF]">
              Merge Your Sound.
            </span>
          </h1>
        </MotionDiv>

        <MotionDiv variants={shouldAnimate ? itemVariants : {}}>
          <p className="text-xl md:text-2xl text-gray-300 mb-10  w-full">
            The platform where producers, vocalists, and sound engineers unite
            to create extraordinary music together.
          </p>
        </MotionDiv>

        <MotionDiv
          variants={shouldAnimate ? itemVariants : {}}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <button className="px-8 py-4 bg-gradient-to-r from-[#E11D48] to-[#E36FFF] text-white font-semibold rounded-full hover:shadow-xl hover:shadow-[#E11D48]/50 transition-all duration-300 transform hover:scale-105">
            Start A Project
          </button>
          <button className="px-8 py-4 bg-gray-800/50 backdrop-blur-sm text-white font-semibold rounded-full border-2 border-gray-700 hover:border-[#7B61FF] hover:bg-gray-800 transition-all duration-300">
            Find Artists
          </button>
        </MotionDiv>
      </MotionDiv>
    </div>
  );
};

export default Hero;
