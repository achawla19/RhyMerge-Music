import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import who1 from "../assets/who1.jpg";
import {
  Home,
  Users,
  FolderOpen,
  MessageSquare,
  User,
  Menu,
  X,
  Search,
  Contact,
  Settings,
} from "lucide-react";

const Navbar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();

  const navLinks = [
    { path: "/", label: "Home", icon: Home },
    { path: "/projects", label: "Projects", icon: FolderOpen },
    { path: "/search", label: "Search", icon: Search },
    { path: "/network", label: "Network", icon: Contact },
    { path: "/messages", label: "Messages", icon: MessageSquare },
    { path: "/settings", label: "Settings", icon: Settings },
    { path: "/community", label: "Community", icon: Users },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-[998] p-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-colors"
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={10} /> : <Menu size={14} />}
      </button>

      {/* Sidebar Navigation */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 z-[998]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsOpen(false)}
            />

            <motion.nav
              className="fixed top-12 left-0 h-screen w-58 bg-[#0f172a]/95 backdrop-blur-lg border-r border-gray-800 shadow-xl z-[999] rounded-2xl"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 260, damping: 28 }}
            >
              <nav
                onMouseEnter={() => setIsOpen(true)}
                onMouseLeave={() => setIsOpen(false)}
                className={`
           fixed top-2 left-0 h-full
  w-56
  bg-[#0f172a]/95 backdrop-blur-lg
  border-r border-gray-800 shadow-xl
  rounded-2xl
  transform transition-transform duration-300 ease-in-out
  group

  ${isOpen ? "translate-x-0" : "-translate-x-full"} 
  z-[999]
        `}
              >
                {/* {isOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setIsOpen(false)}
          />
        )} */}
                <div className="flex flex-col h-full">
                  {/* Logo */}
                  {/* <div className="p-6 border-b border-gray-800"> */}
                  <Link to="/" className="flex items-center">
                    {/* <img src="/assets/logo.svg" alt="RhyMerge Logo" className="h-8" /> */}
                  </Link>
                  {/* </div> */}

                  {/* Navigation Links */}
                  <div className="flex-1 py-6">
                    <ul className="space-y-2 px-3">
                      {navLinks.map(({ path, label, icon: Icon }) => (
                        <li key={path}>
                          <motion.div>
                            <Link
                              to={path}
                              onClick={() => setIsOpen(false)}
                              className={`
                      flex items-center justify-center group-hover: justify-start gap-3 px-4 py-3 rounded-lg
                      transition-all duration-200
                      ${
                        isActive(path)
                          ? "bg-[#7B61FF] text-white shadow-lg shadow-[#7B61FF]/20"
                          : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                      }
                    `}
                            >
                              <div className="flex items-center gap-3">
                                <Icon className="w-5 h-5 shrink-0" />
                                <span
                                  className="opacity-0 w-0 overflow-hidden
    group-hover:opacity-100 group-hover:w-auto
    transition-all duration-300
    whitespace-nowrap"
                                >
                                  {label}
                                </span>
                              </div>
                            </Link>
                          </motion.div>
                        </li>
                      ))}
                    </ul>
                    <div className="border-t border-gray-800 my-4" />
                    <div className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800/50 transition  cursor-pointer">
                      {/* Profile Image */}
                      <img
                        src={who1}
                        alt="User"
                        className="w-12 h-12 rounded-full object-cover"
                      />

                      {/* User Info */}
                      <div className="flex flex-col">
                        <span className="text-white font-semibold text-sm">
                          Chhavi
                        </span>
                        <span className="text-gray-400 text-xs">
                          Singer - Songwriter
                        </span>
                        <span className="text-gray-300 text-xs font-medium hover:text-white"
                        onClick={() => console.log("Go to profile")}>
                          Edit Profile
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </nav>
            </motion.nav>
          </>
        )}
      </AnimatePresence>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-[998]"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Navbar;
