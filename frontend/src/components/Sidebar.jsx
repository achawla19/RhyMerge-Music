import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  LayoutGrid,
  Search,
  Users,
  MessageSquare,
  Settings,
  Zap,
} from "lucide-react";

const NAV_ITEMS = [
  { icon: Home, label: "Home", path: "/" },
  { icon: LayoutGrid, label: "Projects", path: "/projects" },
  { icon: Search, label: "Search", path: "/search" },
  { icon: Users, label: "Network", path: "/network" },
  { icon: MessageSquare, label: "Messages", path: "/messages" },
  { icon: Settings, label: "Settings", path: "/settings" },
  { icon: Zap, label: "Community", path: "/community" },
];

// Hardcoded for now — will come from auth context later
const CURRENT_USER = {
  username: "akshit_dev",
  name: "Akshit",
  role: "Producer",
  avatar: "https://i.pravatar.cc/150?img=12",
};

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="w-64 h-screen fixed top-0 left-0 flex flex-col bg-[#0a0a12]/90 backdrop-blur-xl border-r border-gray-800 z-[999]">
      {/* Logo */}
      <div className="px-6 py-8 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center text-white font-bold">
            ℝ
          </div>
          <span className="text-lg font-semibold text-white">RhyMerge</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-6 space-y-2">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`group relative w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                isActive ? "text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              {isActive && (
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 opacity-90" />
              )}
              <div className="relative flex items-center gap-3">
                <Icon size={18} />
                <span>{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Divider */}
      <div className="px-4">
        <div className="h-px bg-gray-700" />
      </div>

      {/* My Profile — clicking navigates to your own profile */}
      <div className="p-4">
        <div
          onClick={() => navigate(`/profile/${CURRENT_USER.username}`)}
          className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#1a1a24] transition cursor-pointer group"
        >
          <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-purple-500/30 group-hover:border-purple-500 transition">
            <img
              src={CURRENT_USER.avatar}
              alt={CURRENT_USER.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">
              {CURRENT_USER.name}
            </p>
            <p className="text-xs text-gray-400">{CURRENT_USER.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
