import Hero from "../components/Hero";

import TrendingCreators from "../components/home/TrendingCreators";
import RecentProjects from "../components/home/RecentProjects";
import StatsSection from "../components/home/StatsSection";
import DiscoverByRole from "../components/home/DiscoverByRole";

const Home = () => {
  return (
    <div className="space-y-6">
      <Hero />
      <StatsSection />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <TrendingCreators />
        <RecentProjects />
      </div>

      <DiscoverByRole />
    </div>
  );
};

export default Home;
