import { useLocation, useNavigate } from "react-router-dom";
import { Bell, Menu, MessageSquare, Plus, Search } from "lucide-react";

import { useAuth } from "../context/AuthContext";
import NavbarSearch from "./search/NavbarSearch";
import { getNotifications, markNotificationRead } from "../api/notifications";
import { useState, useEffect } from "react";

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
      title: `Greetings, ${user?.username}`,
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

  const [notifications, setNotifications] = useState([]);
  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const navigate = useNavigate();

  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getNotifications();

        setNotifications(data);
      } catch (err) {
        console.error(err);
      }
    };

    load();

    const interval = setInterval(load, 15000);

    return () => clearInterval(interval);
  }, []);

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
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="
      relative

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

              {unreadCount > 0 && (
                <span
                  className="
          absolute
          -top-1
          -right-1

          w-5 h-5

          rounded-full

          bg-red-500

          text-white
          text-xs

          flex
          items-center
          justify-center
        "
                >
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div
                className="
        absolute
        right-0
        top-14

        w-[360px]

        rounded-3xl

        bg-[#12131D]

        border border-white/[0.08]

        shadow-2xl

        overflow-hidden

        z-50
      "
              >
                <div className="p-4 border-b border-white/[0.06]">
                  <h3 className="text-white font-semibold">Notifications</h3>
                </div>

                {notifications.length === 0 ? (
                  <div className="p-5 text-slate-400 text-sm">
                    No notifications
                  </div>
                ) : (
                  notifications.map((n) => (
                    <button
                      key={n._id}
                      onClick={async () => {
                        await markNotificationRead(n._id);

                        setNotifications((prev) =>
                          prev.map((item) =>
                            item._id === n._id
                              ? {
                                  ...item,
                                  isRead: true,
                                }
                              : item,
                          ),
                        );

                        navigate(`/projects/${notification.project._id}`, {
                          state: {
                            showJoinedBanner: true,
                          },
                        });

                        setShowNotifications(false);
                      }}
                      className={`
              w-full
              text-left

              px-4 py-4

              border-b
              border-white/[0.05]

              hover:bg-white/[0.04]

              transition-all

              ${
                !n.isRead
                  ? n.type === "request_accepted"
                    ? "bg-green-500/10"
                    : n.type === "request_rejected"
                      ? "bg-red-500/10"
                      : "bg-purple-500/10"
                  : ""
              }
            `}
                    >
                      <p className="text-white text-sm">
                        {n.type === "project_request" && (
                          <>
                            <span className="font-semibold">
                              {n.sender?.username}
                            </span>{" "}
                            requested to join your project
                          </>
                        )}

                        {n.type === "request_accepted" && (
                          <>
                            Your request to join{" "}
                            <span className="font-semibold text-green-400">
                              {n.project?.title}
                            </span>{" "}
                            was accepted
                          </>
                        )}

                        {n.type === "request_rejected" && (
                          <>
                            Your request to join{" "}
                            <span className="font-semibold text-red-400">
                              {n.project?.title}
                            </span>{" "}
                            was declined
                          </>
                        )}
                      </p>

                      <p className="text-purple-400 text-xs mt-1">
                        {n.project?.title}
                      </p>

                      <p className="text-slate-500 text-xs mt-1">
                        {new Date(n.createdAt).toLocaleString()}
                      </p>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

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
