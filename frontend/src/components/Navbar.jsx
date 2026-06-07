import { useLocation } from "react-router-dom";
import { Bell, Menu, MessageSquare, Plus, Search } from "lucide-react";

import { useAuth } from "../context/AuthContext";
import NavbarSearch from "./search/NavbarSearch";

const Navbar = ({ onMenuClick }) => {
  const location = useLocation();
  const { user } = useAuth();
  const path = location.pathname.split("/")[1] || "";
  const searchWidth =
    path === ""
      ? "lg:w-[460px]"
      : path === "messages"
        ? "lg:w-[260px]"
        : "lg:w-[360px]";

  const pageContent = {
    "": {
      title: `Good evening, ${user?.username}`,
      subtitle: "Discover creators, projects and opportunities.",
    },

    projects: {
      title: "Projects",
      subtitle: "Build and manage your collaborations.",
    },

    search: {
      title: "Discover Creators",
      subtitle: "Explore talent across genres and roles.",
    },

    network: {
      title: "Your Network",
      subtitle: "Grow meaningful creative connections.",
    },

    community: {
      title: "Community",
      subtitle: "Share ideas, feedback and inspiration.",
    },

    messages: {
      title: "Messages",
      subtitle: "Stay connected with collaborators.",
    },

    settings: {
      title: "Settings",
      subtitle: "Manage your account and preferences.",
    },
  };

  const currentPage =
    pageContent[location.pathname.split("/")[1]] || pageContent[""];

  return (
    <header
      className="
        fixed
        top-0
        left-0
        lg:left-[260px]
        right-0

        h-28

        z-40

        bg-[#0B0B12]/75
        backdrop-blur-2xl

        border-b
        border-white/[0.06]
      "
    >
      <div className="h-full px-4 lg:px-8 flex items-center justify-between gap-4">
        {/* LEFT */}
        <div className="flex items-center gap-4 min-w-0">
          {/* MOBILE MENU */}
          <button
            onClick={onMenuClick}
            className="
              lg:hidden

              w-11
              h-11

              rounded-2xl

              bg-white/[0.04]
              border border-white/[0.08]

              flex
              items-center
              justify-center

              flex-shrink-0
            "
          >
            <Menu size={20} />
          </button>

          <div className="min-w-0">
            <h1 className="m-0 text-lg md:text-2xl lg:text-3xl font-bold text-white">
              {currentPage.title}
            </h1>

            <p className="m-0 mt-1 text-sm text-slate-400">
              {currentPage.subtitle}
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* DESKTOP SEARCH */}
          <NavbarSearch width={searchWidth} />

          {/* MESSAGES */}
          <button
            className="
              w-10 h-10
              lg:w-11 lg:h-11

              rounded-xl
              lg:rounded-2xl

              bg-white/[0.04]
              border border-white/[0.08]

              flex
              items-center
              justify-center

              text-slate-400

              hover:text-white
              hover:border-purple-500/30

              transition-all
            "
          >
            <MessageSquare size={18} />
          </button>

          {/* NOTIFICATIONS */}
          <button
            className="
              w-10 h-10
              lg:w-11 lg:h-11

              rounded-xl
              lg:rounded-2xl

              bg-white/[0.04]
              border border-white/[0.08]

              flex
              items-center
              justify-center

              text-slate-400

              hover:text-white
              hover:border-purple-500/30

              transition-all
            "
          >
            <Bell size={18} />
          </button>

          {/* CREATE PROJECT */}
          <button
            className="
              flex

              items-center
              justify-center

              w-10 h-10
              lg:w-auto lg:h-11

              lg:px-5

              rounded-xl
              lg:rounded-2xl

              bg-gradient-to-r
              from-purple-600
              to-pink-500

              text-white

              hover:scale-[1.03]

              transition-all
            "
          >
            <Plus size={18} />

            <span className="hidden xl:block ml-2 font-medium">
              Create Project
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
