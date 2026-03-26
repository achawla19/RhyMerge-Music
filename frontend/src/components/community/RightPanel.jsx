import Trending from "./Trending";
import SuggestedUsers from "./SuggestedUsers";

const RightPanel = () => {
  return (
    <div className="w-full top-6 h-fit sticky space-y-6">
      <Trending />
      <SuggestedUsers />
      {/* PROMO */}
      <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 p-5 rounded-xl border border-purple-500/20">
        <h3 className="font-semibold mb-2">Upgrade</h3>
        <p className="text-sm text-gray-400 mb-3">Unlock premium features</p>

        <button className="w-full bg-purple-600 py-2 rounded">
          Get Started
        </button>
      </div>
    </div>
  );
};

export default RightPanel;
