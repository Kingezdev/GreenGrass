// components/StatCard.jsx
import React from "react";
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  AreaChart,
  Area,
} from "recharts";

const StatCard = ({ title, value, icon: Icon, chartType, colors }) => {
  const chartData = [
    { name: "value", value: value || 0 },
    { name: "remaining", value: Math.max(100 - (value || 0), 0) },
  ];

  const waveData = Array.from({ length: 6 }).map((_, i) => ({
    name: `P${i + 1}`,
    value: Math.floor(Math.random() * (value || 100)),
  }));

  return (
    <div className="relative bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-md p-6 flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-transform duration-300">
      {/* Floating Icon */}
      <div className="absolute top-4 right-4 bg-gray-900 text-white p-2 rounded-lg shadow">
        {Icon && <Icon className="text-xl" />}
      </div>

      {/* Title & Value */}
      <div className="mb-4">
        <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
        <p className="text-3xl font-extrabold text-gray-900">{value ?? 0}</p>
      </div>

      {/* Chart Section */}
      <div className="flex justify-center items-center">
        {chartType === "pie" && (
          <PieChart width={130} height={130}>
            <Pie
              data={chartData}
              dataKey="value"
              cx="50%"
              cy="50%"
              innerRadius={30}
              outerRadius={50}
              fill={colors?.[0] || "#16a34a"}
              stroke="none"
            />
          </PieChart>
        )}

        {chartType === "bar" && (
          <BarChart
            width={150}
            height={120}
            data={[{ name: "stat", value: value || 0 }]}
          >
            <XAxis dataKey="name" hide />
            <YAxis hide />
            <Tooltip />
            <Bar
              dataKey="value"
              fill={colors?.[0] || "#f97316"}
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        )}

        {chartType === "radar" && (
          <RadarChart
            outerRadius={50}
            width={150}
            height={130}
            data={[{ subject: "Rating", value: value || 0 }]}
          >
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" />
            <Radar
              name="Rating"
              dataKey="value"
              stroke={colors?.[0] || "#eab308"}
              fill={colors?.[0] || "#eab308"}
              fillOpacity={0.6}
            />
          </RadarChart>
        )}

        {chartType === "wave" && (
          <AreaChart
            width={150}
            height={120}
            data={waveData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="waveGradient" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={colors?.[0] || "#2563eb"}
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor={colors?.[1] || "#93c5fd"}
                  stopOpacity={0.2}
                />
              </linearGradient>
            </defs>
            <XAxis dataKey="name" hide />
            <YAxis hide />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="value"
              stroke={colors?.[0] || "#2563eb"}
              fill="url(#waveGradient)"
            />
          </AreaChart>
        )}
      </div>
    </div>
  );
};

export default StatCard;
