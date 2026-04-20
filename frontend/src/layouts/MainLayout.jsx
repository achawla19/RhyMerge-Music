import React from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#0a0a12] text-white overflow-x-hidden">
      {/* SIDEBAR (FIXED) */}
      <Sidebar />

      {/* MAIN AREA */}
      <div className="ml-[80px]">
        {/* NAVBAR (TOP) */}
        <Navbar />

        {/* PAGE CONTENT */}
        <main className="pt-20 px-6 min-h-screen">{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;
