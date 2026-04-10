import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Community from "./pages/Community";
import Network from "./pages/Network";
import Profile from "./pages/Profile";
import Search from "./pages/Search";
import Settings from "./pages/Settings";
import Messages from "./pages/Messages";
import Projects from "./pages/Projects";

const Placeholder = ({ title }) => (
  <div className="min-h-screen bg-[#0B2540] flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-5xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl text-gray-400">Coming soon...</p>
    </div>
  </div>
);

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/community" element={<Community />} />
      <Route path="/network" element={<Network />} />
      <Route path="/profile/:username" element={<Profile />} />
      <Route path="/search" element={<Search />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/messages" element={<Messages />} />
      <Route path="*" element={<Placeholder title="Page Not Found" />} />
    </Routes>
  );
};

export default AppRouter;
