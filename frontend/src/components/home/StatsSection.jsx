import Card from "../ui/Card";

const stats = [
  {
    label: "Projects",
    value: "24",
  },
  {
    label: "Connections",
    value: "156",
  },
  {
    label: "Requests",
    value: "12",
  },
  {
    label: "Messages",
    value: "48",
  },
];

const StatsSection = () => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((item) => (
        <Card
          key={item.label}
          className="
            h-28
            flex
            flex-col
            items-center
            justify-center
          "
        >
          <h3 className="text-3xl font-bold text-white">{item.value}</h3>

          <p className="text-sm text-slate-400 mt-1">{item.label}</p>
        </Card>
      ))}
    </div>
  );
};

export default StatsSection;
