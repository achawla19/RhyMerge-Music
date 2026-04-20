import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LayoutGrid, Search, Users, Music } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);

  // ✅ SINGLE SOURCE OF TRUTH
  const { user } = useAuth();

  const navItems = [
    { label: "Projects", icon: LayoutGrid, path: "/projects" },
    { label: "Search", icon: Search, path: "/search" },
    { label: "Network", icon: Users, path: "/network" },
  ];

  return (
    <motion.div
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      animate={{ width: isExpanded ? 200 : 80 }}
      transition={{ duration: 0.25 }}
      className="fixed left-0 top-0 h-screen z-40 flex flex-col items-center py-6
      backdrop-blur-xl bg-white/5 border-r border-white/10"
    >
      {/* LOGO */}
      <div className="mb-10 flex items-center justify-center w-full">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 flex items-center justify-center shadow-lg">
          <Music className="w-6 h-6 text-white" />
        </div>
      </div>

      {/* NAV ITEMS */}
      <nav className="flex flex-col gap-4 w-full px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <motion.button
              key={item.path}
              onClick={() => navigate(item.path)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all
                ${
                  isActive
                    ? "bg-white/5 border border-purple-400/30 text-white shadow-[0_0_12px_rgba(168,85,247,0.15)]"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />

              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: isExpanded ? 1 : 0 }}
                transition={{ duration: 0.2 }}
                className="text-sm whitespace-nowrap"
              >
                {item.label}
              </motion.span>
            </motion.button>
          );
        })}
      </nav>

      {/* USER */}
      <div className="mt-auto w-full px-3">
        <motion.div
          onClick={() => user && navigate("/settings?section=profile")}
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-3 p-2 rounded-xl cursor-pointer hover:bg-white/10"
        >
          <img
            src={
              user?.avatar ||
              `https://ui-avatars.com/api/?name=${
                user?.username || "User"
              }&background=7c3aed&color=fff`
            }
            alt="user"
            className="w-10 h-10 rounded-full"
          />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isExpanded ? 1 : 0 }}
            className="flex flex-col"
          >
            <span className="text-sm font-medium text-white">
              {user?.username || "Guest"}
            </span>

            <span className="text-xs text-gray-400">
              {user?.role || "Music Creator"}
            </span>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Sidebar;
