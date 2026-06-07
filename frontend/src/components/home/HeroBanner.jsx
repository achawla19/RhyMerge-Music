import { Music2 } from "lucide-react";
import { motion } from "framer-motion";

export default function HeroBanner() {
  return (
    <div className="relative overflow-hidden rounded-[32px] p-10 border border-white/10 bg-white/[0.03] backdrop-blur-xl">
      <div className="absolute top-0 left-0 w-72 h-72 bg-purple-500/20 blur-[120px]" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-cyan-500/20 blur-[120px]" />

      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <Music2 className="text-purple-400" />
            <span className="text-purple-300">
              Music Collaboration Platform
            </span>
          </div>

          <h1 className="text-5xl font-bold text-white leading-tight">
            Create.
            <br />
            Collaborate.
            <br />
            Merge Your Sound.
          </h1>

          <p className="text-gray-400 mt-5 max-w-2xl">
            Connect with producers, singers, guitarists, DJs and sound engineers
            from around the world.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
