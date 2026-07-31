import { useState } from "react";
import Sidebar from "../components/Sidebar";
import TopBar from "../layouts/TopBar";
import MobileSidebar from "../components/MobileSidebar";
import PlayerBar from "../layouts/PlayerBar";
import { PlayerProvider, usePlayer } from "../layouts/PlayerContext";
import ProjectRightPanel from "../components/projects/ProjectRightPanel";
import { useProjectPanel } from "../context/ProjectPanelContext";
import useNotifications from "../hooks/useNotifications";

const AmbientMesh = () => (
  <div
    className="fixed inset-0 pointer-events-none overflow-hidden"
    style={{ zIndex: 0 }}
  >
    <style>{`
      @keyframes rmDrift1{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(60px,40px) scale(1.08)}66%{transform:translate(-30px,70px) scale(0.96)}}
      @keyframes rmDrift2{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(-70px,-50px) scale(1.1)}}
      @keyframes rmDrift3{0%,100%{transform:translate(0,0) scale(1);opacity:0.6}50%{transform:translate(40px,-60px) scale(1.15);opacity:0.9}}
    `}</style>
    <div
      className="absolute"
      style={{
        top: -280,
        left: -220,
        width: 700,
        height: 700,
        borderRadius: "50%",
        background: "rgba(249,87,111,0.22)",
        filter: "blur(180px)",
        animation: "rmDrift1 28s ease-in-out infinite",
      }}
    />
    <div
      className="absolute"
      style={{
        bottom: -240,
        right: -200,
        width: 620,
        height: 620,
        borderRadius: "50%",
        background: "rgba(192,132,252,0.18)",
        filter: "blur(170px)",
        animation: "rmDrift2 34s ease-in-out infinite",
      }}
    />
    <div
      className="absolute"
      style={{
        top: "38%",
        left: "42%",
        width: 420,
        height: 420,
        borderRadius: "50%",
        background: "rgba(244,114,182,0.12)",
        filter: "blur(160px)",
        animation: "rmDrift3 40s ease-in-out infinite",
      }}
    />
    <div
      className="absolute"
      style={{
        top: "68%",
        left: "8%",
        width: 500,
        height: 500,
        borderRadius: "50%",
        background: "rgba(240,180,41,0.09)",
        filter: "blur(170px)",
        animation: "rmDrift2 32s ease-in-out infinite reverse",
      }}
    />
  </div>
);

const LayoutInner = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { track } = usePlayer();
  const { openProjectId, closePanel } = useProjectPanel();
  useNotifications();

  return (
    <div
      className="h-screen overflow-hidden relative flex flex-col"
      style={{ background: "var(--rm-bg)" }}
    >
      <AmbientMesh />

      {/* TOP BAR */}
      <div className="relative z-30 flex-shrink-0">
        <TopBar onMenuClick={() => setSidebarOpen(true)} />
      </div>

      {/* BODY — sidebar | main | right panel */}
      <div className="flex flex-1 overflow-hidden relative z-10 gap-2 p-2 pt-0">
        {/* Sidebar */}
        <div className="hidden lg:block flex-shrink-0 h-full">
          <Sidebar />
        </div>

        <MobileSidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main content */}
        <main
          className="flex-1 overflow-y-auto rounded-[18px]"
          style={{
            background: "rgba(255,255,255,0.025)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.05)",
            paddingBottom: track ? 80 : 0,
            transition: "all 0.35s cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          <div className="p-4 sm:p-6 lg:p-8 min-h-full">{children}</div>
        </main>

        {/* Right panel — slides in when project opened */}
        {openProjectId && (
          <div
            className="hidden lg:block flex-shrink-0 h-full overflow-hidden rounded-[18px]"
            style={{
              width: 380,
              background: "rgba(11,8,20,0.97)",
              border: "1px solid rgba(249,87,111,0.2)",
              backdropFilter: "blur(24px)",
              animation: "rmSlideFromRight 0.32s cubic-bezier(0.22,1,0.36,1)",
            }}
          >
            <style>{`@keyframes rmSlideFromRight{from{opacity:0;transform:translateX(24px)}to{opacity:1;transform:translateX(0)}}`}</style>
            <ProjectRightPanel projectId={openProjectId} onClose={closePanel} />
          </div>
        )}
      </div>

      <PlayerBar />
    </div>
  );
};

const MainLayout = ({ children }) => (
  <PlayerProvider>
    <LayoutInner>{children}</LayoutInner>
  </PlayerProvider>
);

export default MainLayout;
