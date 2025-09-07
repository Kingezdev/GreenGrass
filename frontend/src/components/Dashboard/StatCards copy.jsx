// components/Dashboard/Landlord/StatCard.jsx
import React from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar,
} from "recharts";
import { FaStar } from "react-icons/fa";

const StatCard = ({ title, value, subtext, icon: Icon, chartType, chartData, colors, action }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 flex flex-col gap-3 w-full hover:shadow-lg transition">
      {/* Header */}
      <div className="flex items-center gap-2">
        {Icon && (
          <div className="p-2 rounded-full bg-black text-white flex items-center justify-center">
            <Icon size={18} />
          </div>
        )}
        <h3 className="text-sm font-medium text-gray-700">{title}</h3>
      </div>

      {/* Value */}
      <p className="text-2xl font-bold">{value}</p>
      {subtext && <p className="text-xs text-gray-500">{subtext}</p>}

      {/* Chart / Visual */}
      <div className="h-24 flex items-center justify-center">
        {chartType === "line" && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis dataKey="month" hide />
              <YAxis hide />
              <Tooltip />
              <Line type="monotone" dataKey="earnings" stroke={colors?.[0]} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        )}

        {chartType === "gauge" && (
          <PieChart width={90} height={90}>
            <Pie
              data={[
                { name: "Occupied", value: chartData.rate },
                { name: "Vacant", value: 100 - chartData.rate },
              ]}
              innerRadius={30}
              outerRadius={40}
              paddingAngle={3}
              dataKey="value"
            >
              <Cell fill={colors?.[0] || "#3b82f6"} />
              <Cell fill="#e5e7eb" />
            </Pie>
            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fontSize="12">
              {chartData.rate}%
            </text>
          </PieChart>
        )}

        {chartType === "bar" && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={[{ name: "Active", value: chartData.length }]}>
              <Bar dataKey="value" fill={colors?.[0] || "#f97316"} />
            </BarChart>
          </ResponsiveContainer>
        )}

        {chartType === "list" && (
          <ul className="text-xs text-gray-600 list-disc list-inside">
            {chartData.slice(0, 3).map((a, idx) => (
              <li key={idx}>{a.tenant} — {a.status}</li>
            ))}
          </ul>
        )}

        {chartType === "calendar" && (
          <ul className="text-xs text-gray-600">
            {chartData.slice(0, 2).map((p, idx) => (
              <li key={idx}>💰 {p.tenant}: ₦{p.amount.toLocaleString()}</li>
            ))}
          </ul>
        )}

        {chartType === "status" && (
          <ul className="text-xs text-gray-600">
            {chartData.slice(0, 2).map((req, idx) => (
              <li key={idx}>
                <span
                  className={`px-2 py-0.5 rounded text-white text-[10px] ${
                    req.status === "Pending" ? "bg-yellow-500" :
                    req.status === "In Progress" ? "bg-blue-500" : "bg-green-600"
                  }`}
                >
                  {req.status}
                </span>{" "}
                {req.issue}
              </li>
            ))}
          </ul>
        )}

        {chartType === "stars" && (
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }, (_, i) => (
              <FaStar
                key={i}
                className={i < Math.round(chartData.average) ? "text-yellow-400" : "text-gray-300"}
              />
            ))}
          </div>
        )}
      </div>

      {/* Quick Action */}
      {action && (
        <button className="mt-auto text-xs text-blue-600 hover:underline self-start">
          {action}
        </button>
      )}
    </div>
  );
};

export default StatCard;
