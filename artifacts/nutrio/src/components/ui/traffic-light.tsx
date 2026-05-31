interface TrafficLightProps {
  level: string; // "low" | "medium" | "high"
  label: string;
  value: number | null;
  unit?: string;
}

export function TrafficLight({ level, label, value, unit = "g" }: TrafficLightProps) {
  const colors = {
    low: "bg-green-500",
    medium: "bg-amber-500",
    high: "bg-red-500",
  };
  
  const bgClass = colors[level as keyof typeof colors] || "bg-gray-300";

  return (
    <div className="flex items-center justify-between p-3 rounded-lg border bg-card">
      <div className="flex items-center gap-3">
        <div className={`w-4 h-4 rounded-full shadow-sm ${bgClass}`} />
        <span className="font-medium text-sm capitalize">{label}</span>
      </div>
      <div className="text-sm text-muted-foreground font-mono">
        {value !== null && value !== undefined ? `${value}${unit}` : "-"}
      </div>
    </div>
  );
}