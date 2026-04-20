import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, MessageSquare, Users, Settings } from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/messages", label: "Messages", icon: MessageSquare },
    { path: "/community", label: "Community", icon: Users },
    { path: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="fixed top-0 left-[80px] right-0 h-20 z-30 backdrop-blur-xl bg-white/5 border-b border-white/10 flex items-center px-8">
      <nav className="flex items-center gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <motion.button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                isActive ? "text-white" : "text-gray-400 hover:text-white"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.label}</span>

              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 -z-10 rounded-full bg-white/5 border border-purple-400/30 border-rounded opacity-80 blur-sm"
                  transition={{ duration: 0.3 }}
                />
              )}
            </motion.button>
          );
        })}
      </nav>
    </div>
  );
};

export default Navbar;
