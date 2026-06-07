import Card from "../ui/Card";
import Avatar from "../Avatar";
import { ArrowRight } from "lucide-react";

const creators = [
  {
    id: 1,
    name: "Sarah Blake",
    role: "Vocalist",
    avatar: "https://i.pravatar.cc/150?img=32",
    genre: "R&B",
  },
  {
    id: 2,
    name: "Alex Carter",
    role: "Producer",
    avatar: "https://i.pravatar.cc/150?img=15",
    genre: "Lo-Fi",
  },
  {
    id: 3,
    name: "David Lee",
    role: "Guitarist",
    avatar: "https://i.pravatar.cc/150?img=12",
    genre: "Rock",
  },
];

export default function TrendingCreators() {
  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Trending Creators</h2>

        <button className="text-purple-400 flex items-center gap-1 text-sm hover:text-purple-300">
          View All
          <ArrowRight size={15} />
        </button>
      </div>

      <div className="space-y-4">
        {creators.map((creator) => (
          <div
            key={creator.id}
            className="
              flex
              items-center
              justify-between
              p-4
              rounded-2xl
              bg-white/[0.03]
              border
              border-white/5
              hover:border-purple-500/20
              transition-all
            "
          >
            <div className="flex items-center gap-4">
              <Avatar src={creator.avatar} alt={creator.name} size="lg" />

              <div>
                <h3 className="text-white font-medium">{creator.name}</h3>

                <p className="text-gray-400 text-sm">{creator.role}</p>
              </div>
            </div>

            <span
              className="
                px-3
                py-1
                rounded-full
                bg-purple-500/10
                border
                border-purple-500/20
                text-purple-300
                text-xs
              "
            >
              {creator.genre}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
