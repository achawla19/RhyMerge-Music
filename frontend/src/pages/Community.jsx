import Feed from "../components/community/Feed";
import RightPanel from "../components/community/RightPanel";

const roles = [
  "Producer",
  "Vocalist",
  "DJ",
  "Songwriter",
  "Beatmaker",
  "Guitarist",
  "Rapper",
];

const contents = [
  "Looking to collaborate on a chill lo-fi track 🎧",
  "Need a vocalist for my upcoming EP!",
  "Anyone into trap beats? Let’s build something 🔥",
  "Working on a jazz fusion project, collaborators welcome 🎷",
  "Just dropped a new beat pack, feedback needed!",
  "Searching for mixing/mastering experts 🎚️",
  "Let’s create something unique together 🚀",
];

const tagOptions = [
  ["LoFi", "Chill"],
  ["RnB", "Soul"],
  ["Trap", "HipHop"],
  ["Jazz", "Fusion"],
  ["Beats"],
  ["Mixing", "Mastering"],
  ["Collab"],
];

const posts = Array.from({ length: 7 }, (_, i) => ({
  id: i + 1,
  avatar: `https://i.pravatar.cc/150?img=${i + 10}`,
  username: `User ${i + 1}`,
  role: roles[i % roles.length],
  timestamp: `${(i + 1) * 2}h ago`,
  content: contents[i % contents.length],
  tags: tagOptions[i % tagOptions.length],
  likes: Math.floor(Math.random() * 200),
  comments: Math.floor(Math.random() * 80),
}));

const Community = () => {
  return (
  <div className="min-h-screen bg-[#0B2540] text-white">
    <div className="max-w-7xl mx-auto px-6 py-6">

      <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
        Meet the Musicians
      </h1>

      <input
        placeholder="Search musicians..."
        className="w-full px-4 py-3 rounded-full bg-gray-900 border border-gray-700 mb-6"
      />

      <div className="grid lg:grid-cols-[1fr_450px] gap-6">
        <Feed posts={posts} />
        <RightPanel />
      </div>

    </div>
  </div>
);
};

export default Community;
