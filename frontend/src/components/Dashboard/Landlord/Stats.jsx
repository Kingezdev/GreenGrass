// components/Stats.jsx
import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import {
  FaDollarSign,
  FaHome,
  FaBuilding,
  FaClipboardList,
  FaMoneyBillWave,
  FaTools,
  FaStar,
} from 'react-icons/fa';

import landlordData from '../../../data/landlord/landlordData';

const StatCard = ({ title, value, subtext, Icon, children }) => (
  <div className="bg-white shadow rounded-xl p-6 relative">
    <div className="flex justify-between items-start mb-4">
      <div>
        <h3 className="text-gray-500 font-medium">{title}</h3>
        <p className="text-2xl font-bold">{value}</p>
        {subtext && <p className="text-gray-400 text-sm">{subtext}</p>}
      </div>
      <Icon className="text-gray-300 text-3xl" />
    </div>
    <div style={{ minHeight: '150px' }}>{children}</div>
  </div>
);

const Stats = () => {
  const { earnings, occupancies, properties, applications, rentPayments, maintenanceRequests, reviews } = landlordData;

  // Calculate average rating
  const averageRating = (
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
  ).toFixed(1);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
      {/* Earnings */}
      <StatCard
        title="Earnings"
        value={`$${earnings[earnings.length - 1].amount.toLocaleString()}`}
        subtext="This year"
        Icon={FaDollarSign}
      >
        <ResponsiveContainer width="100%" height={120}>
          <BarChart data={earnings}>
            <XAxis dataKey="year" hide />
            <YAxis hide />
            <Tooltip />
            <Bar dataKey="amount" radius={[5, 5, 5, 5]} barSize={30}>
              {earnings.map((entry, index) => (
                <Cell
                  key={index}
                  fill={entry.color === 'blue-500' ? '#3b82f6' : '#bfdbfe'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </StatCard>

      {/* Occupancies */}
      <StatCard
        title="Occupancies"
        value={`${occupancies[occupancies.length - 1].occupiedUnits}/${occupancies[occupancies.length - 1].totalUnits}`}
        subtext="This year"
        Icon={FaHome}
      >
        <ResponsiveContainer width="100%" height={120}>
          <BarChart data={occupancies}>
            <XAxis dataKey="year" hide/>
            <YAxis hide/>
            <Tooltip />
            <Bar dataKey="occupiedUnits" radius={[5, 5, 5, 5]}>
              {occupancies.map((entry, index) => (
                <Cell key={index} fill={entry.color === 'yellow-500' ? '#facc15' : '#fef08a'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </StatCard>

      {/* Properties */}
      <StatCard
        title="Properties"
        value={properties[properties.length - 1].totalProperties}
        subtext="This year"
        Icon={FaBuilding}
      >
        <ResponsiveContainer width="100%" height={120}>
          <BarChart data={properties}>
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="totalProperties">
              {properties.map((entry, index) => (
                <Cell key={index} fill={entry.color === 'green-500' ? '#22c55e' : '#bbf7d0'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </StatCard>

      {/* Applications */}
      <StatCard
        title="Applications"
        value={applications.reduce((sum, a) => sum + a.count, 0)}
        subtext="Total applications"
        Icon={FaClipboardList}
      >
        <ResponsiveContainer width="100%" height={150}>
          <PieChart>
            <Pie
              data={applications}
              dataKey="count"
              nameKey="status"
              innerRadius={40}
              outerRadius={60}
              paddingAngle={5}
            >
              {applications.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="flex justify-around mt-2">
          {applications.map((a) => (
            <div key={a.status} className="text-center">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                {a.count}
              </div>
              <span className="text-xs">{a.status}</span>
            </div>
          ))}
        </div>
      </StatCard>

      {/* Rent Payments */}
      <StatCard
        title="Rent Payments"
        value={rentPayments.reduce((sum, r) => sum + r.count, 0)}
        subtext="Total payments"
        Icon={FaMoneyBillWave}
      >
        <ResponsiveContainer width="100%" height={150}>
          <PieChart>
            <Pie
              data={rentPayments}
              dataKey="count"
              nameKey="status"
              innerRadius={40}
              outerRadius={60}
              paddingAngle={5}
            >
              {rentPayments.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="flex justify-around mt-2">
          {rentPayments.map((r) => (
            <div key={r.status} className="text-center">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                {r.count}
              </div>
              <span className="text-xs">{r.status}</span>
            </div>
          ))}
        </div>
      </StatCard>

      {/* Maintenance */}
      <StatCard
        title="Maintenance"
        value={maintenanceRequests.reduce((sum, m) => sum + m.count, 0)}
        subtext="Total requests"
        Icon={FaTools}
      >
        <ResponsiveContainer width="100%" height={150}>
          <PieChart>
            <Pie
              data={maintenanceRequests}
              dataKey="count"
              nameKey="status"
              innerRadius={40}
              outerRadius={60}
              paddingAngle={5}
            >
              {maintenanceRequests.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="flex justify-around mt-2">
          {maintenanceRequests.map((m) => (
            <div key={m.status} className="text-center">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                {m.count}
              </div>
              <span className="text-xs">{m.status}</span>
            </div>
          ))}
        </div>
      </StatCard>

      {/* Reviews */}
      <StatCard
        title="Reviews"
        value={averageRating}
        subtext="Average rating"
        Icon={FaStar}
      >
        <div className="text-gray-500 text-sm mt-2 space-y-1">
          {reviews.map((r, i) => (
            <p key={i}>
              <strong>{r.reviewer}:</strong> {r.rating}⭐ - {r.comment}
            </p>
          ))}
        </div>
      </StatCard>
    </div>
  );
};

export default Stats;
