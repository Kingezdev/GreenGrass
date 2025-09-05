// pages/LandlordDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardPropertyCard from '../components/DashboardPropertyCard';
import DashboardSearch from '../components/DashboardSearch';
import propertyData from '../data/propertyData';

const LandlordDashboard = ({ user }) => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Use data from propertyData.js
  useEffect(() => {
    // Transform property data to match the expected format
    const landlordProperties = propertyData.map(property => ({
      id: property.id,
      title: property.title,
      location: property.location,
      price: property.price,
      image: property.images[0],
      status: "active", // Default status
      views: Math.floor(Math.random() * 300) + 50, // Random views for demo
      inquiries: Math.floor(Math.random() * 40) + 5, // Random inquiries for demo
      rating: property.landlord.rating,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      area: property.area,
      verified: property.landlord.verified,
      createdAt: property.availableFrom,
      description: property.description,
      amenities: property.amenities,
      landlord: property.landlord
    }));

    setProperties(landlordProperties);
    setFilteredProperties(landlordProperties);
    setLoading(false);
  }, []);

  const handleSearch = (filters) => {
    let results = [...properties];

    // Search term filter
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      results = results.filter(prop =>
        prop.title.toLowerCase().includes(term) ||
        prop.location.toLowerCase().includes(term) ||
        prop.description.toLowerCase().includes(term)
      );
    }

    // Status filter
    if (filters.status && filters.status !== 'all') {
      results = results.filter(prop => prop.status === filters.status);
    }

    // Sorting
    switch (filters.sortBy) {
      case 'newest':
        results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        results.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'price-high':
        results.sort((a, b) => b.price - a.price);
        break;
      case 'price-low':
        results.sort((a, b) => a.price - b.price);
        break;
      case 'views':
        results.sort((a, b) => b.views - a.views);
        break;
      case 'inquiries':
        results.sort((a, b) => b.inquiries - a.inquiries);
        break;
      default:
        // Default sort by newest
        results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }

    setFilteredProperties(results);
  };

  const mockMessages = [
    {
      id: 1,
      property: "Modern 3-Bedroom Apartment",
      sender: "Tunde Adeyemi",
      message: "Hello, I'm interested in your property. Is it still available?",
      time: "2 hours ago",
      unread: true
    }
  ];

  const handleEditProperty = (propertyId, updatedData) => {
    setProperties(prev => prev.map(prop =>
      prop.id === propertyId
        ? { ...prop, ...updatedData }
        : prop
    ));
    
    setFilteredProperties(prev => prev.map(prop =>
      prop.id === propertyId
        ? { ...prop, ...updatedData }
        : prop
    ));

    // Show success message
    alert('Property updated successfully!');
  };
  
  const handleDeleteProperty = (propertyId) => {
    setProperties(prev => prev.filter(prop => prop.id !== propertyId));
    setFilteredProperties(prev => prev.filter(prop => prop.id !== propertyId));
    
    // Show success message
    alert('Property deleted successfully!');
  };

  // Calculate stats based on properties
  const stats = {
    totalProperties: properties.length,
    activeProperties: properties.filter(p => p.status === 'active').length,
    rentedProperties: properties.filter(p => p.status === 'rented').length,
    pendingProperties: properties.filter(p => p.status === 'pending').length,
    totalViews: properties.reduce((sum, prop) => sum + prop.views, 0),
    totalInquiries: properties.reduce((sum, prop) => sum + prop.inquiries, 0),
    averageRating: properties.length > 0 
      ? (properties.reduce((sum, prop) => sum + prop.rating, 0) / properties.length).toFixed(1)
      : 0
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-sm font-bold">{stats.totalProperties}</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Properties</p>
              <p className="text-lg font-semibold text-gray-900">{stats.totalProperties}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-sm font-bold">{stats.activeProperties}</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Listings</p>
              <p className="text-lg font-semibold text-gray-900">{stats.activeProperties}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 text-sm font-bold">{stats.totalViews}</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Views</p>
              <p className="text-lg font-semibold text-gray-900">{stats.totalViews}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-yellow-600 text-sm font-bold">{stats.averageRating}</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg. Rating</p>
              <p className="text-lg font-semibold text-gray-900">{stats.averageRating}</p>
            </div>
          </div>
        </div>
      </div>

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
            // Loading skeleton
            [1, 2, 3].map(n => (
              <div key={n} className="bg-gray-100 rounded-lg p-4 animate-pulse">
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
              <DashboardPropertyCard
                key={property.id}
                property={property}
                onEdit={handleEditProperty}
                onDelete={handleDeleteProperty}
              />
            ))
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-400 text-4xl mb-4">🔍</div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No properties found</h3>
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
                <div key={message.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 font-medium text-sm">
                        {message.sender.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900">{message.sender}</h3>
                      <span className="text-sm text-gray-500">{message.time}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{message.property}</p>
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
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No messages yet</h3>
              <p className="text-gray-500">You'll see incoming messages here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LandlordDashboard;