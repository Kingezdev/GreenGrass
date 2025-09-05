// pages/LandlordDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardPropertyCard from '../components/DashboardPropertyCard';
import DashboardSearch from '../components/DashboardSearch';

const LandlordDashboard = ({ user }) => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data
  useEffect(() => {
    const mockProperties = [
      {
        id: 1,
        title: "Modern 3-Bedroom Apartment",
        location: "Lekki Phase 1, Lagos",
        price: 1800000,
        image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
        status: "active",
        views: 128,
        inquiries: 15,
        rating: 4.5,
        bedrooms: 3,
        bathrooms: 2,
        area: 120,
        verified: true,
        createdAt: "2023-10-15"
      },
      {
        id: 2,
        title: "Cozy 2-Bedroom Flat",
        location: "GRA, Ibadan",
        price: 850000,
        image: "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=784&q=80",
        status: "pending",
        views: 45,
        inquiries: 8,
        rating: 4.0,
        bedrooms: 2,
        bathrooms: 1,
        area: 80,
        verified: false,
        createdAt: "2023-11-20"
      },
      {
        id: 3,
        title: "Luxury Villa VI",
        location: "Victoria Island, Lagos",
        price: 3500000,
        image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
        status: "rented",
        views: 256,
        inquiries: 32,
        rating: 4.8,
        bedrooms: 4,
        bathrooms: 3,
        area: 250,
        verified: true,
        createdAt: "2023-09-05"
      }
    ];

    setProperties(mockProperties);
    setFilteredProperties(mockProperties);
    setLoading(false);
  }, []);

  const handleSearch = (filters) => {
    let results = [...properties];

    // Search term filter
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      results = results.filter(prop =>
        prop.title.toLowerCase().includes(term) ||
        prop.location.toLowerCase().includes(term)
      );
    }

    // Status filter
    if (filters.status) {
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


  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* ... existing stats code ... */}
      </div>

      {/* Search Section */}
      <DashboardSearch 
        onSearch={handleSearch}
        placeholder="Search properties by title or location..."
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
        {/* ... existing messages code ... */}
      </div>
    </div>
  );
};

export default LandlordDashboard;