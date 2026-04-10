import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useLocation } from "react-router-dom";

const MainLayout = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const location = useLocation();
  const isMessagesPage = location.pathname.startsWith("/messages");

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024); // tablet breakpoint
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex bg-[#0a0a12] text-white">
      {/* SIDEBAR (DESKTOP ONLY, NOT ON MESSAGES) */}
      {!isMobile && !isMessagesPage && <Sidebar />}

      {/* NAVBAR (MOBILE + MESSAGES PAGE) */}
      {(isMobile || isMessagesPage) && (
        <Navbar isOpen={isOpen} setIsOpen={setIsOpen} />
      )}

      {/* MAIN CONTENT */}
      <div
        className={`
          flex-1 min-h-screen transition-all duration-300
          ${!isMobile && !isMessagesPage ? "ml-64" : ""}
        `}
      >
        {children}
      </div>
    </div>
  );
};

export default MainLayout;
