import { useState, useEffect, useRef } from "react";
import { Search, User, Music2, ArrowLeft } from "lucide-react";

import { useNavigate } from "react-router-dom";
import { globalSearch } from "../../api/search";

export default function NavbarSearch({ width = "lg:w-[360px]" }) {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");

  const [mobileOpen, setMobileOpen] = useState(false);

  const [open, setOpen] = useState(false);

  const [results, setResults] = useState({
    users: [],
    projects: [],
  });

  const containerRef = useRef();

  useEffect(() => {
    const handleOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutside);

    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!query.trim()) {
        setResults({
          users: [],
          projects: [],
        });

        return;
      }

      try {
        const data = await globalSearch(query);

        setResults(data);

        setOpen(true);
      } catch (err) {
        console.error(err);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const closeEverything = () => {
    setOpen(false);
    setMobileOpen(false);
    setQuery("");
  };

  return (
    <>
      {/* MOBILE BUTTON */}
      <button
        onClick={() => setMobileOpen(true)}
        className="
          flex md:hidden

          w-10 h-10

          rounded-xl

          bg-white/[0.04]
          border border-white/[0.08]

          items-center
          justify-center

          text-slate-400
        "
      >
        <Search size={18} />
      </button>

      {/* DESKTOP / TABLET */}
      <div
        ref={containerRef}
        className="
          hidden md:block
          relative 
        "
      >
        <div
          className={`
            flex
            items-center
            gap-3

            h-11

            ${width}

            px-4

            rounded-2xl
          `}
        >
          <Search size={18} className="text-slate-500" />

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search creators, projects..."
            className="
              flex-1
              bg-transparent
              outline-none

              text-white
              text-sm

              placeholder:text-slate-500
            "
          />
        </div>

        {/* DESKTOP DROPDOWN */}
        {open && (
          <SearchDropdown
            results={results}
            navigate={navigate}
            closeEverything={closeEverything}
          />
        )}
      </div>

      {/* MOBILE SEARCH MODAL */}
      {mobileOpen && (
        <div
          className="
            fixed
            inset-0
            z-[200]

            bg-[#0B0B12]
          "
        >
          {/* HEADER */}
          <div
            className="
              flex
              items-center
              gap-3

              p-4

              border-b
              border-white/[0.06]
            "
          >
            <button onClick={() => setMobileOpen(false)}>
              <ArrowLeft size={22} className="text-white" />
            </button>

            <div
              className="
                flex-1

                flex
                items-center
                gap-3

                h-11

                px-4

                rounded-2xl

                bg-white/[0.04]
                border border-white/[0.08]
              "
            >
              <Search size={18} className="text-slate-500" />

              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search creators, projects..."
                className="
                  flex-1
                  bg-transparent
                  outline-none

                  text-white
                "
              />
            </div>
          </div>

          {/* RESULTS */}
          <div className="p-3px">
            <SearchDropdown
              mobile
              results={results}
              navigate={navigate}
              closeEverything={closeEverything}
            />
          </div>
          {results.users?.length === 0 && results.projects?.length === 0 && (
            <div className=" text-center">
              <p className="text-sm text-slate-400">
                No creators or projects found
              </p>
            </div>
          )}
        </div>
      )}
    </>
  );
}

function SearchDropdown({
  results,
  navigate,
  closeEverything,
  mobile = false,
}) {
  return (
    <div
      className={
        mobile
          ? ""
          : `
            absolute
            top-14
            left-0

            w-full

            rounded-2xl

            bg-[#12131D]
            border border-white/[0.06]

            overflow-hidden

            shadow-2xl
          `
      }
    >
      {/* USERS */}
      {results.users?.length > 0 && (
        <>
          <div
            className="
              px-4 py-2

              text-xs
              uppercase

              text-slate-500
            "
          >
            Creators
          </div>

          {results.users.map((user) => (
            <button
              key={user._id}
              onClick={() => {
                navigate(`/profile/${user.username}`);

                closeEverything();
              }}
              className="
                w-full

                flex
                items-center
                gap-3

                px-4 py-3

                hover:bg-white/[0.04]
              "
            >
              <img
                src={
                  user.avatar ||
                  `https://ui-avatars.com/api/?name=${user.username}`
                }
                alt=""
                className="
                  w-10 h-10
                  rounded-full
                "
              />

              <div className="text-left">
                <p className="text-white text-sm">{user.username}</p>

                <p className="text-xs text-slate-400">{user.role}</p>
              </div>
            </button>
          ))}
        </>
      )}

      {/* PROJECTS */}
      {results.projects?.length > 0 && (
        <>
          <div
            className="
              px-4 py-2

              text-xs
              uppercase

              text-slate-500

              border-t
              border-white/[0.06]
            "
          >
            Projects
          </div>

          {results.projects.map((project) => (
            <button
              key={project._id}
              onClick={() => {
                navigate(`/projects/${project._id}`);
                closeEverything();
              }}
              className="
                  w-full

                  flex
                  items-center
                  gap-3

                  px-4 py-3

                  hover:bg-white/[0.04]
                "
            >
              <div
                className="
                    w-10 h-10

                    rounded-xl

                    bg-purple-500/20

                    flex
                    items-center
                    justify-center
                  "
              >
                <Music2 size={16} className="text-purple-400" />
              </div>

              <div className="text-left">
                <p className="text-white text-sm font-medium">
                  {project.title}
                </p>

                <p className="text-xs text-slate-400">{project.genre}</p>

                <p className="text-xs text-slate-500">
                  by {project.owner?.username}
                </p>
              </div>
            </button>
          ))}
        </>
      )}
    </div>
  );
}
