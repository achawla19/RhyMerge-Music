import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Community from "./pages/Community";
import Network from "./pages/Network";

// Placeholder (for pages not built yet)
const Placeholder = ({ title }) => (
  <div className="min-h-scree bg-[#0B2540] flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-5xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl text-gray-400">Coming soon...</p>
    </div>
  </div>
);

const AppRouter = () => {
  return (
    <Routes>
      {/* Main Pages */}
      <Route path="/" element={<Home />} />
      <Route path="/community" element={<Community />} />
      <Route path="/network" element={<Network />} />

      {/* Upcoming pages */}
      <Route path="/projects" element={<Placeholder title="Projects" />} />
      <Route path="/messages" element={<Placeholder title="Messages" />} />
      <Route path="/profile" element={<Placeholder title="Profile" />} />

      {/* Fallback Route */}
      <Route path="*" element={<Placeholder title="Page Not Found" />} />
    </Routes>
  );
};

export default AppRouter;
