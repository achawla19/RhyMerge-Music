// import { Hero, WhoFor } from "../components";
import Hero from "../components/Hero";
import WhoFor from "../components/WhoFor";

const Home = () => {
  return (
    <div className="min-h-screen bg-[#0B2540]">
      <Hero />
      <WhoFor />
      {/* Footer */}
      <footer className="py-10 px-6 border-t border-gray-800 text-center text-gray-400">
        <p>&copy; 2026 RhyMerge. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
