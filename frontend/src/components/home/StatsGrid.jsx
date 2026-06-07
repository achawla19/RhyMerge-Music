import Card from "../ui/Card";

const stats = [
  { label: "Projects", value: "24" },
  { label: "Connections", value: "156" },
  { label: "Requests", value: "12" },
  { label: "Messages", value: "48" },
];

export default function StatsGrid() {
  return (
    <div
      className="grid md:grid-cols-4 gap-5 h-24
flex
flex-col
justify-center
items-center"
    >
      {stats.map((item) => (
        <Card key={item.label}>
          <div className="text-3xl font-bold text-white">{item.value}</div>

          <div className="text-gray-400 mt-2">{item.label}</div>
        </Card>
      ))}
    </div>
  );
}
