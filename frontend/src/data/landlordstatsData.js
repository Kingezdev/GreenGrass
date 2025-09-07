// data/landlordstatsData.js
import { FaBuilding, FaHome, FaEye, FaStar } from "react-icons/fa";

const statsData = (stats) => [
  {
    id: 1,
    title: "Total Properties",
    value: stats.totalProperties,
    icon: FaBuilding,
    chartType: "pie",
    colors: ["#16a34a", "#bbf7d0"], // shades of green
  },
  {
    id: 2,
    title: "Active Listings",
    value: stats.activeProperties,
    icon: FaHome,
    chartType: "bar",
    colors: ["#f97316"], // orange
  },
  {
    id: 3,
    title: "Total Views",
    value: stats.totalViews,
    icon: FaEye,
    chartType: "wave",
    colors: ["#3b82f6", "#bfdbfe"], // blue
  },
  {
    id: 4,
    title: "Avg. Rating",
    value: stats.averageRating,
    icon: FaStar,
    chartType: "radar",
    colors: ["#eab308"], // yellow
  },
];

export default statsData;
