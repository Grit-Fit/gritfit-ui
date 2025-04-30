// src/components/SwipeChart.jsx
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function SwipeChart({ data }) {
  if (!data) return null;             

  const chartData = [
    { name: "Right (Completed)",  value: data.Completed        ?? 0, fill: "#4ade80" }, // green
    { name: "Left (Not Completed)", value: data["Not Completed"] ?? 0, fill: "#f87171" }, // red
    { name: "Up (Help)",           value: data.Help            ?? 0, fill: "#60a5fa" }, // blue
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={chartData}
        margin={{ top: 10, right: 20, left: 0, bottom: 30 }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 12 }}
          interval={0}
          angle={-15}
          dy={10}
        />
        <YAxis allowDecimals={false} />
        <Tooltip />
        {/* render each bar with its own colour */}
        {chartData.map((e, idx) => (
          <Bar key={idx} dataKey="value" data={[e]} fill={e.fill} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
