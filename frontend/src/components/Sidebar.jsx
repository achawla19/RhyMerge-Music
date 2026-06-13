import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  LayoutGrid,
  Search,
  Users,
  Music,
  Settings,
  User,
  Bookmark,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Home } from "lucide-react";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

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

  return (
    <aside
      className="
        hidden lg:flex

        fixed
        left-0
        top-0

        w-[260px]
        h-screen

        z-50

        flex-col

        bg-[#0B0C14]/95
        backdrop-blur-2xl

        border-r
        border-white/[0.06]
      "
    >
      {/* LOGO */}

      <div className="px-6 py-8 border-b border-white/[0.06]">
        <button
          onClick={() => navigate("/")}
          className="
      flex
      items-center
      gap-3

      w-full

      transition-all
      hover:opacity-90
    "
        >
          <div
            className="
        w-12 h-12
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
            <Music className="w-6 h-6 text-white" />
          </div>

          <div className="text-left">
            <h2 className="font-bold text-lg text-white">RhyMerge</h2>

            <p className="text-xs text-slate-400">Music Collaboration</p>
          </div>
        </button>
      </div>

      {/* NAVIGATION */}

      <div className="flex-1 px-4 py-6">
        <p className="text-xs uppercase tracking-wider text-slate-500 px-3 mb-4">
          Navigation
        </p>

        <div className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;

            const active = location.pathname === item.path;

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`
                  relative
                  flex
                  items-center
                  gap-3

                  w-full

                  px-4
                  py-3

                  rounded-2xl

                  transition-all
                  duration-300

                  ${
                    active
                      ? "bg-white/[0.08] border border-purple-500/20 text-white"
                      : "text-slate-400 hover:bg-white/[0.04] hover:text-white"
                  }
                `}
              >
                {active && (
                  <div
                    className="
                      absolute
                      left-0
                      top-2
                      bottom-2

                      w-1

                      rounded-full

                      bg-gradient-to-b
                      from-purple-400
                      to-pink-400
                    "
                  />
                )}

                <Icon className="w-5 h-5" />

                <span className="text-sm font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* USER */}

      <div className="p-4 border-t border-white/[0.06]">
        <button
          onClick={() => navigate("/settings")}
          className="
            w-full

            flex
            items-center
            gap-3

            p-3

            rounded-2xl

            bg-white/[0.03]
            hover:bg-white/[0.06]

            transition-all
          "
        >
          <img
            src={
              user?.avatar ||
              `https://ui-avatars.com/api/?name=${
                user?.username || "User"
              }&background=7c3aed&color=fff`
            }
            alt="profile"
            className="
              w-12
              h-12

              rounded-full

              border
              border-purple-500/30
            "
          />

          <div className="text-left">
            <p className="text-sm text-white font-medium">
              {user?.username || "Guest"}
            </p>

            <p className="text-xs text-slate-400">
              {user?.role || "Music Creator"}
            </p>
          </div>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
