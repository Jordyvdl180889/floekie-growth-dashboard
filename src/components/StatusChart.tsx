"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface StatusChartProps {
  statusCounts: {
    planned: number;
    running: number;
    completed: number;
    paused: number;
    stopped: number;
  };
}

const COLORS: Record<string, string> = {
  planned: "#94a3b8",
  running: "#10b981",
  completed: "#3b82f6",
  paused: "#f59e0b",
  stopped: "#ef4444",
};

export function StatusChart({ statusCounts }: StatusChartProps) {
  const data = Object.entries(statusCounts)
    .filter(([, count]) => count > 0)
    .map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
      color: COLORS[name],
    }));

  return (
    <div className="rounded-2xl border bg-card p-6">
      <h3 className="text-lg font-semibold mb-4">Status Verdeling</h3>
      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={3}
              dataKey="value"
              strokeWidth={0}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                fontSize: "13px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-wrap gap-3 mt-2 justify-center">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-1.5 text-xs">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-muted-foreground">
              {item.name} ({item.value})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
