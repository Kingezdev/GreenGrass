// pages/TenantDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardSearch from '../components/DashboardSearch';
import propertyData from '../data/propertyData';

const TenantDashboard = ({ user }) => {
  const [favorites, setFavorites] = useState([]);
  const [filteredFavorites, setFilteredFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  // Use data from propertyData.js
  useEffect(() => {
    // Get favorites from localStorage or use first 3 properties as mock favorites
    const storedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    
    let favoriteProperties = [];
    
    if (storedFavorites.length > 0) {
      // Use actual favorites from localStorage
      favoriteProperties = storedFavorites.map(favId => {
        const property = propertyData.find(p => p.id === favId);
        return property ? {
          id: property.id,
          title: property.title,
          location: property.location,
          price: property.price,
          image: property.images[0],
          verified: property.landlord.verified,
          addedDate: new Date().toISOString().split('T')[0], // Today's date
          status: "available",
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          area: property.area,
          landlord: property.landlord
        } : null;
      }).filter(Boolean);
    } else {
      // Use first 3 properties as mock favorites
      favoriteProperties = propertyData.slice(0, 3).map(property => ({
        id: property.id,
        title: property.title,
        location: property.location,
        price: property.price,
        image: property.images[0],
        verified: property.landlord.verified,
        addedDate: new Date().toISOString().split('T')[0], // Today's date
        status: Math.random() > 0.5 ? "available" : "applied", // Random status for demo
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        area: property.area,
        landlord: property.landlord
      }));
    }

    setFavorites(favoriteProperties);
    setFilteredFavorites(favoriteProperties);
    setLoading(false);
  }, []);

  const handleSearch = (filters) => {
    let results = [...favorites];

    // Search term filter
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      results = results.filter(fav =>
        fav.title.toLowerCase().includes(term) ||
        fav.location.toLowerCase().includes(term)
      );
    }

    // Status filter
    if (filters.status && filters.status !== 'all') {
      results = results.filter(fav => fav.status === filters.status);
    }

    // Sorting
    switch (filters.sortBy) {
      case 'newest':
        results.sort((a, b) => new Date(b.addedDate) - new Date(a.addedDate));
        break;
      case 'oldest':
        results.sort((a, b) => new Date(a.addedDate) - new Date(b.addedDate));
        break;
      case 'price-high':
        results.sort((a, b) => b.price - a.price);
        break;
      case 'price-low':
        results.sort((a, b) => a.price - b.price);
        break;
      default:
        // Default sort by newest
        results.sort((a, b) => new Date(b.addedDate) - new Date(a.addedDate));
        break;
    }

    setFilteredFavorites(results);
  };

  const mockMessages = [
    {
      id: 1,
      property: "Modern 3-Bedroom Apartment",
      sender: "Adebola Johnson",
      message: "Thank you for your interest! When would you like to schedule a viewing?",
      time: "1 hour ago",
      unread: false
    }
  ];

  // Calculate stats based on favorites
  const stats = {
    totalFavorites: favorites.length,
    availableProperties: favorites.filter(fav => fav.status === 'available').length,
    appliedProperties: favorites.filter(fav => fav.status === 'applied').length,
    averagePrice: favorites.length > 0 
      ? Math.round(favorites.reduce((sum, fav) => sum + fav.price, 0) / favorites.length)
      : 0
  };

  const formatNumber = (num) => {
    return num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-sm font-bold">{stats.totalFavorites}</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Favorites</p>
              <p className="text-lg font-semibold text-gray-900">{stats.totalFavorites}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-sm font-bold">{stats.availableProperties}</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Available</p>
              <p className="text-lg font-semibold text-gray-900">{stats.availableProperties}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 text-sm font-bold">₦{formatNumber(stats.averagePrice)}</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg. Price</p>
              <p className="text-lg font-semibold text-gray-900">₦{formatNumber(stats.averagePrice)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <DashboardSearch 
        onSearch={handleSearch}
        placeholder="Search favorites by title or location..."
        showFilters={true}
      />

      {/* Favorites Section */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Favorite Properties</h2>
              <p className="text-sm text-gray-600">
                {filteredFavorites.length} of {favorites.length} favorites
              </p>
            </div>
            <Link
              to="/favorites"
              className="text-green-600 hover:text-green-700 text-sm font-medium"
            >
              View all
            </Link>
          </div>
        </div>
        
        <div className="p-6">
          {loading ? (
            // Loading skeleton
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2].map(n => (
                <div key={n} className="border rounded-lg p-4 animate-pulse">
                  <div className="bg-gray-300 h-32 rounded-lg mb-3"></div>
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : filteredFavorites.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredFavorites.map((favorite) => (
                <div key={favorite.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <img
                    src={favorite.image}
                    alt={favorite.title}
                    className="w-full h-32 object-cover rounded-lg mb-3"
                  />
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900">{favorite.title}</h3>
                    {favorite.verified && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Verified
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{favorite.location}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                    <span>{favorite.bedrooms} {favorite.bedrooms === 1 ? 'Bed' : 'Beds'}</span>
                    <span>{favorite.bathrooms} {favorite.bathrooms === 1 ? 'Bath' : 'Baths'}</span>
                    <span>{favorite.area} m²</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-green-600">
                      ₦{formatNumber(favorite.price)}/year
                    </p>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      favorite.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {favorite.status}
                    </span>
                  </div>
                  <div className="mt-3">
                    <Link
                      to={`/property/${favorite.id}`}
                      className="inline-block bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm font-medium"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-400 text-4xl mb-4">❤️</div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No favorites found</h3>
              <p className="text-gray-500">Try adjusting your search criteria or add some properties to your favorites</p>
              <Link
                to="/properties"
                className="inline-block mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 font-medium"
              >
                Browse Properties
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
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

export default TenantDashboard;