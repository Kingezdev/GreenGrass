// pages/LandlordDashboard.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import LandlordPropertyCard from "../LandlordPropertyCard";
import DashboardSearch from "../../DashboardSearch";
import Stats from "./Stats";
import { FaHome, FaCheckCircle, FaEye, FaStar } from "react-icons/fa";
import landlordData from "../../../data/landlord/landlordData";

const LandlordDashboard = ({ user }) => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Use properties directly from landlordData
    const landlordProperties = landlordData.properties.map((property) => ({
      ...property,
      status: property.status || "active",
      views: property.views || Math.floor(Math.random() * 300) + 50,
      inquiries: property.inquiries || Math.floor(Math.random() * 40) + 5,
      rating: property.rating || 0,
      verified: landlordData?.verified || true,
      landlord: {
        id: landlordData.id,
        name: landlordData.name,
        email: landlordData.email,
      },
    }));

    setProperties(landlordProperties);
    setFilteredProperties(landlordProperties);
    setLoading(false);
  }, []);

  const handleSearch = (filters) => {
    let results = [...properties];

    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      results = results.filter(
        (prop) =>
          prop.title.toLowerCase().includes(term) ||
          prop.location.toLowerCase().includes(term) ||
          (prop.description && prop.description.toLowerCase().includes(term))
      );
    }

    if (filters.status && filters.status !== "all") {
      results = results.filter((prop) => prop.status === filters.status);
    }

    switch (filters.sortBy) {
      case "newest":
        results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "oldest":
        results.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case "price-high":
        results.sort((a, b) => b.price - a.price);
        break;
      case "price-low":
        results.sort((a, b) => a.price - b.price);
        break;
      case "views":
        results.sort((a, b) => b.views - a.views);
        break;
      case "inquiries":
        results.sort((a, b) => b.inquiries - a.inquiries);
        break;
      default:
        results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }

    setFilteredProperties(results);
  };

  const handleEditProperty = (propertyId, updatedData) => {
    setProperties((prev) =>
      prev.map((prop) =>
        prop.id === propertyId ? { ...prop, ...updatedData } : prop
      )
    );

    setFilteredProperties((prev) =>
      prev.map((prop) =>
        prop.id === propertyId ? { ...prop, ...updatedData } : prop
      )
    );

    alert("Property updated successfully!");
  };

  const handleDeleteProperty = (propertyId) => {
    setProperties((prev) => prev.filter((prop) => prop.id !== propertyId));
    setFilteredProperties((prev) =>
      prev.filter((prop) => prop.id !== propertyId)
    );

    alert("Property deleted successfully!");
  };

  const mockMessages = [
    {
      id: 1,
      property: "Modern 3-Bedroom Apartment",
      sender: "Tunde Adeyemi",
      message: "Hello, I'm interested in your property. Is it still available?",
      time: "2 hours ago",
      unread: true,
    },
  ];

  return (
    <div className="space-y-6">
      <Stats />

      
      {/* Search Section */}
      <DashboardSearch
        onSearch={handleSearch}
        placeholder="Search properties by title, location or description..."
        showFilters={true}
      />

      {/* Properties List */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Your Properties</h2>
              <p className="text-sm text-gray-600">
                {filteredProperties.length} of {properties.length} properties
              </p>
            </div>
            <Link
              to="/add-property"
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm font-medium"
            >
              Add New Property
            </Link>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {loading ? (
            [1, 2, 3].map((n) => (
              <div
                key={n}
                className="bg-gray-100 rounded-lg p-4 animate-pulse"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-20 h-20 bg-gray-300 rounded-lg"></div>
                  <div className="flex-1 space-y-3">
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                  </div>
                </div>
              </div>
            ))
          ) : filteredProperties.length > 0 ? (
            filteredProperties.map((property) => (
              <LandlordPropertyCard
                key={property.id}
                property={property}
                onEdit={handleEditProperty}
                onDelete={handleDeleteProperty}
              />
            ))
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-400 text-4xl mb-4">🔍</div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                No properties found
              </h3>
              <p className="text-gray-500">Try adjusting your search criteria</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Messages */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Recent Messages</h2>
        </div>
        <div className="p-6">
          {mockMessages.length > 0 ? (
            <div className="space-y-4">
              {mockMessages.map((message) => (
                <div
                  key={message.id}
                  className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 font-medium text-sm">
                        {message.sender
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900">
                        {message.sender}
                      </h3>
                      <span className="text-sm text-gray-500">
                        {message.time}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {message.property}
                    </p>
                    <p className="text-gray-700 mt-2">{message.message}</p>
                  </div>
                  {message.unread && (
                    <div className="flex-shrink-0">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        New
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-400 text-4xl mb-4">💬</div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                No messages yet
              </h3>
              <p className="text-gray-500">You'll see incoming messages here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LandlordDashboard;
