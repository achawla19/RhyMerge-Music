import Navbar from "./components/Navbar";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import { useState } from "react";
import AppRouter from "./AppRouter";

function App() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full min-h-screen bg-[#0B2540] text-white relative">
      {/* Logo */}
      <div className="fixed top-4 left-16 z-50 flex items-center gap-2">
        <img src="/assets/logo.svg" alt="RhyMerge Logo" className="h-8" />
      </div>
      <div
        className="fixed top-0 left-0 h-full w-10 z-[1000]"
        onMouseEnter={() => setIsOpen(true)}
      ></div>
      <Navbar isOpen={isOpen} setIsOpen={setIsOpen} />
      <AppRouter />
      <main
        className=" min-h-screen flex-1
       items-center justify-center
      text-center"
      >
        {/* <h1>Welcome to RhyMerge 🚀</h1> */}
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
