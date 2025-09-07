// data/landlordstatsData.js
import { 
  FaMoneyBillWave, 
  FaHome, 
  FaClipboardList, 
  FaEnvelopeOpenText, 
  FaCalendarAlt, 
  FaTools, 
  FaStar 
} from "react-icons/fa";

const landlordStatsData = (stats) => [
  {
    id: 1,
    title: "Earnings This Month",
    value: `₦${stats.earningsThisMonth?.toLocaleString() || "0"}`,
    subtext: `+${stats.earningsGrowth || 0}% vs last month`,
    icon: FaMoneyBillWave,
    chartType: "line", // mini-line showing last 6 months
    chartData: stats.earningsTrend || [],
    colors: ["#16a34a", "#bbf7d0"], // green
  },
  {
    id: 2,
    title: "Occupancy Rate",
    value: `${stats.occupancyRate || 0}%`,
    subtext: `${stats.unitsOccupied || 0}/${stats.totalUnits || 0} units occupied`,
    icon: FaHome,
    chartType: "gauge", // circular progress
    colors: ["#2563eb"], // blue
  },
  {
    id: 3,
    title: "Active Properties",
    value: `${stats.activeListings || 0} Listings`,
    subtext: `${stats.vacantUnits || 0} Vacant, ${stats.occupiedUnits || 0} Occupied`,
    icon: FaClipboardList,
    chartType: "bar", // small horizontal/stacked bar
    quickAction: "+ Add Property",
    colors: ["#f97316"], // orange
  },
  {
    id: 4,
    title: "New Applications",
    value: `${stats.pendingApplications || 0} Pending`,
    subtext: `${stats.approvedApplications || 0} Approved, ${stats.declinedApplications || 0} Declined this week`,
    icon: FaEnvelopeOpenText,
    chartType: "donut", // donut for approval vs decline
    quickAction: "Review Applications",
    colors: ["#8b5cf6", "#ddd"], // purple
  },
  {
    id: 5,
    title: "Due This Week",
    value: `₦${stats.rentDueThisWeek?.toLocaleString() || "0"}`,
    subtext: `${stats.tenantsDue || 0} tenants scheduled to pay`,
    icon: FaCalendarAlt,
    chartType: "list", // mini calendar or list
    colors: ["#e11d48"], // red
  },
  {
    id: 6,
    title: "Open Requests",
    value: `${stats.openRequests || 0} Active`,
    subtext: stats.requestSummary || "No pending issues",
    icon: FaTools,
    chartType: "status", // color-coded statuses
    colors: ["#f59e0b"], // amber
  },
  {
    id: 7,
    title: "Ratings & Reviews",
    value: `${stats.averageRating || 0}/5`,
    subtext: `${stats.totalReviews || 0} reviews this year`,
    icon: FaStar,
    chartType: "donut", // donut + stars
    colors: ["#eab308"], // yellow
  },
];

export default landlordStatsData;
