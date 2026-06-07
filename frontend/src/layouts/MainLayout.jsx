import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import MobileSidebar from "../components/MobileSidebar";

const MainLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0B0B12] overflow-x-hidden relative">
      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-250px] left-[-200px] w-[600px] h-[600px] bg-purple-600/10 blur-[220px]" />

        <div className="absolute bottom-[-250px] right-[-200px] w-[600px] h-[600px] bg-pink-500/10 blur-[220px]" />

        <div className="absolute top-[35%] left-[40%] w-[400px] h-[400px] bg-cyan-500/5 blur-[180px]" />
      </div>

      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Sidebar */}
      <MobileSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Content */}
      <div className="relative z-10 lg:ml-[260px]">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="pt-36 lg:pt-36 px-4 sm:px-6 lg:px-8 pb-6 lg:pb-8">
          <div
            className="
              min-h-[calc(100vh-110px)]

              rounded-2xl lg:rounded-[32px]

              bg-white/[0.035]
              backdrop-blur-2xl

              border
              border-white/[0.06]

              shadow-[0_20px_80px_rgba(0,0,0,0.35)]

              p-4 sm:p-6 lg:p-8
            "
          >
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
