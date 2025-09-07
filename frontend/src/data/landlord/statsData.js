// data/landlord/statsData.js
import { FaMoneyBillWave, FaChartPie, FaHome, FaEnvelope, FaCalendarAlt, FaTools, FaStar } from "react-icons/fa";

import earnings from "./earnings";
import properties from "./properties";
import applications from "./applications";
import rentPayments from "./rentPayments";
import maintenanceRequests from "./maintenance";
import reviews from "./reviews";

// Helper functions
const getOccupancyRate = () => {
  const occupied = properties.filter((p) => p.occupied).length;
  return {
    rate: Math.round((occupied / properties.length) * 100),
    occupied,
    total: properties.length,
  };
};

const getApplicationsSummary = () => {
  const pending = applications.filter((a) => a.status === "Pending").length;
  const approved = applications.filter((a) => a.status === "Approved").length;
  const declined = applications.filter((a) => a.status === "Declined").length;
  return { pending, approved, declined };
};

const getRentPaymentsSummary = () => {
  const totalDue = rentPayments.reduce((sum, p) => sum + p.amount, 0);
  return { totalDue, count: rentPayments.length };
};

const statsData = [
  {
    id: 1,
    title: "Earnings This Month",
    value: `₦${earnings.thisMonth.toLocaleString()}`,
    subtext: `+${(((earnings.thisMonth - earnings.lastMonth) / earnings.lastMonth) * 100).toFixed(1)}% vs last month`,
    icon: FaMoneyBillWave,
    chartType: "line",
    chartData: earnings.monthlyTrend,
    colors: ["#16a34a"],
  },
  {
    id: 2,
    title: "Occupancy Rate",
    value: `${getOccupancyRate().rate}%`,
    subtext: `${getOccupancyRate().occupied}/${getOccupancyRate().total} units occupied`,
    icon: FaChartPie,
    chartType: "gauge",
    chartData: getOccupancyRate(),
    colors: ["#3b82f6"],
  },
  {
    id: 3,
    title: "Active Properties",
    value: `${properties.length} Listings`,
    subtext: `${properties.filter((p) => !p.occupied).length} Vacant, ${properties.filter((p) => p.occupied).length} Occupied`,
    icon: FaHome,
    action: "+ Add Property",
    chartType: "bar",
    chartData: properties,
    colors: ["#f97316"],
  },
  {
    id: 4,
    title: "New Applications",
    value: `${getApplicationsSummary().pending} Pending`,
    subtext: `${getApplicationsSummary().approved} Approved, ${getApplicationsSummary().declined} Declined this week`,
    icon: FaEnvelope,
    action: "Review Applications",
    chartType: "list",
    chartData: applications,
    colors: ["#eab308"],
  },
  {
    id: 5,
    title: "Due This Week",
    value: `₦${getRentPaymentsSummary().totalDue.toLocaleString()}`,
    subtext: `${getRentPaymentsSummary().count} tenants scheduled to pay`,
    icon: FaCalendarAlt,
    chartType: "calendar",
    chartData: rentPayments,
    colors: ["#8b5cf6"],
  },
  {
    id: 6,
    title: "Open Requests",
    value: `${maintenanceRequests.length} Active`,
    subtext: maintenanceRequests.map((r) => `${r.issue} (${r.property})`).join(", "),
    icon: FaTools,
    chartType: "status",
    chartData: maintenanceRequests,
    colors: ["#ef4444"],
  },
  {
    id: 7,
    title: "Ratings & Reviews",
    value: `${reviews.average} / 5`,
    subtext: `${reviews.count} reviews this year`,
    icon: FaStar,
    chartType: "stars",
    chartData: reviews.details,
    colors: ["#facc15"],
  },
];

export default statsData;
