import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Users,
  FolderOpen,
  MessageSquare,
  Menu,
  X,
  Search,
  Settings,
} from "lucide-react";

const Navbar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();

  const navLinks = [
    { path: "/", label: "Home", icon: Home },
    { path: "/projects", label: "Projects", icon: FolderOpen },
    { path: "/search", label: "Search", icon: Search },
    { path: "/network", label: "Network", icon: Users },
    { path: "/messages", label: "Messages", icon: MessageSquare },
    { path: "/settings", label: "Settings", icon: Settings },
    { path: "/community", label: "Community", icon: Users },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-[1000] p-2 rounded-lg bg-gray-800 text-white"
      >
        {isOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-black/50 z-[998]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Sidebar */}
            <motion.div
              className="fixed top-0 left-0 h-full w-64 bg-[#0f172a] border-r border-gray-800 z-[999]"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
            >
              <div className="p-6">
                <h1 className="text-white text-lg font-bold mb-6">RhyMerge</h1>

                <ul className="space-y-3">
                  {navLinks.map(({ path, label, icon: Icon }) => (
                    <li key={path}>
                      <Link
                        to={path}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
                          isActive(path)
                            ? "bg-purple-600 text-white"
                            : "text-gray-400 hover:bg-gray-800 hover:text-white"
                        }`}
                      >
                        <Icon size={18} />
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
