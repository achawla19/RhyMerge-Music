import {
  Home,
  LayoutGrid,
  Search,
  Users,
  Settings,
  User,
  Music,
  X,
  Bookmark,
} from "lucide-react";

import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const MobileSidebar = ({ open, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  if (!open) return null;

  const navItems = [
    {
      label: "Home",
      icon: Home,
      path: "/",
    },
    {
      label: "Projects",
      icon: LayoutGrid,
      path: "/projects",
    },
    {
      label: "Saved",
      icon: Bookmark,
      path: "/saved-projects",
    },
    {
      label: "Search",
      icon: Search,
      path: "/search",
    },
    {
      label: "Network",
      icon: Users,
      path: "/network",
    },
    {
      label: "Profile",
      icon: User,
      path: `/profile/${user?.username || ""}`,
    },
    {
      label: "Settings",
      icon: Settings,
      path: "/settings",
    },
  ];

  const handleNavigate = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <div className="lg:hidden fixed inset-0 z-[100]">
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* DRAWER */}
      <div
        className="
          absolute
          left-0
          top-0
          h-full
          w-[280px]

          bg-[#0B0C14]
          border-r
          border-white/[0.06]

          flex
          flex-col

          shadow-2xl
        "
      >
        {/* HEADER */}
        <div className="p-6 border-b border-white/[0.06] flex items-center justify-between">
          <button
            onClick={() => handleNavigate("/")}
            className="
              flex
              items-center
              gap-3
              text-left
              hover:opacity-90
              transition-all
            "
          >
            <div
              className="
                w-11 h-11
                rounded-2xl

                bg-gradient-to-br
                from-purple-500
                via-pink-500
                to-cyan-500

                flex
                items-center
                justify-center

                shadow-lg
              "
            >
              <Music className="w-5 h-5 text-white" />
            </div>

            <div>
              <h2 className="text-white font-bold">RhyMerge</h2>

              <p className="text-xs text-slate-400">Music Collaboration</p>
            </div>
          </button>

          <button
            onClick={onClose}
            className="
              w-10 h-10
              rounded-xl

              bg-white/[0.04]
              border border-white/[0.08]

              flex items-center justify-center

              text-slate-300
            "
          >
            <X size={18} />
          </button>
        </div>

        {/* MENU */}
        <div className="flex-1 p-4">
          <div className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;

              const active = location.pathname === item.path;

              return (
                <button
                  key={item.path}
                  onClick={() => handleNavigate(item.path)}
                  className={`
                    flex
                    items-center
                    gap-3

                    w-full

                    px-4
                    py-3

                    rounded-2xl

                    transition-all

                    ${
                      active
                        ? `
                          bg-gradient-to-r
                          from-purple-500/20
                          to-pink-500/20

                          border
                          border-purple-500/20

                          text-white
                        `
                        : `
                          text-slate-400
                          hover:text-white
                          hover:bg-white/[0.04]
                        `
                    }
                  `}
                >
                  <Icon size={20} />

                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* USER */}
        <div className="p-4 border-t border-white/[0.06]">
          <div className="flex items-center gap-3">
            <img
              src={
                user?.avatar ||
                `https://ui-avatars.com/api/?name=${
                  user?.username || "User"
                }&background=7c3aed&color=fff`
              }
              alt="avatar"
              className="
                w-12
                h-12
                rounded-full
                object-cover
              "
            />

            <div>
              <p className="text-white text-sm font-medium">{user?.username}</p>

              <p className="text-xs text-slate-400">{user?.role}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileSidebar;
