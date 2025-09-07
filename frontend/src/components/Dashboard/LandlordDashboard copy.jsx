// pages/LandlordDashboard.jsx
import React from "react";
import StatCard from "../Dashboard/StatCards";
import landlordData from "../../data/landlord/landlordData";

export default function LandlordDashboard() {
  const data = landlordData; // mock data for now

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold mb-6">Landlord Dashboard</h1>

      {/* 🔹 Top row: Earnings | Properties */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard
          title="Earnings This Month"
          value={`₦${(data.earnings?.thisMonth ?? 0).toLocaleString()}`}
          subtext={`Last month ₦${(data.earnings?.lastMonth ?? 0).toLocaleString()}`}
          chartType="line"
          chartData={data.earnings?.monthlyTrend ?? []}
          colors={["#16a34a"]}
        />

        <StatCard
          title="Properties"
          value={`${data.properties?.total ?? 0} Listings`}
          subtext={`${data.properties?.occupied ?? 0} Occupied, ${data.properties?.vacant ?? 0} Vacant`}
          chartType="bar"
          chartData={data.properties?.listings ?? []}
          colors={["#f97316"]}
          action="+ Add Property"
        />
      </div>

      {/* 🔹 Middle row: Applications | Rent Payments | Maintenance */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="New Applications"
          value={`${data.applications?.pending ?? 0} Pending`}
          subtext={`${data.applications?.approved ?? 0} Approved, ${data.applications?.declined ?? 0} Declined`}
          chartType="list"
          chartData={data.applications?.list ?? []}
          colors={["#10b981"]}
          action="Review Applications"
        />
        <StatCard
          title="Due This Week"
          value={`₦${(data.rentPayments?.dueThisWeek ?? 0).toLocaleString()}`}
          subtext={`${data.rentPayments?.schedule?.length ?? 0} tenants scheduled`}
          chartType="calendar"
          chartData={data.rentPayments?.schedule ?? []}
          colors={["#6366f1"]}
        />
        <StatCard
          title="Open Requests"
          value={`${data.maintenanceRequests?.active ?? 0} Active`}
          subtext="Maintenance issues reported"
          chartType="status"
          chartData={data.maintenanceRequests?.requests ?? []}
          colors={["#ef4444"]}
        />
      </div>

      {/* 🔹 Bottom row: Tenant Reviews */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard
          title="Ratings & Reviews"
          value={`${data.reviews?.average ?? 0} / 5`}
          subtext={`${data.reviews?.total ?? 0} reviews this year`}
          chartType="stars"
          chartData={data.reviews ?? {}}
          colors={["#eab308"]}
        />
      </div>
    </div>
  );
}
