// pages/TenantDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardSearch from '../components/DashboardSearch';

const TenantDashboard = ({ user }) => {
  const [favorites, setFavorites] = useState([]);
  const [filteredFavorites, setFilteredFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data
  useEffect(() => {
    const mockFavorites = [
      {
        id: 1,
        title: "Luxury Villa",
        location: "Victoria Island, Lagos",
        price: 3500000,
        image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
        verified: true,
        addedDate: "2023-11-15",
        status: "available"
      },
      {
        id: 2,
        title: "Modern Apartment",
        location: "Lekki Phase 1, Lagos",
        price: 1800000,
        image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
        verified: true,
        addedDate: "2023-11-10",
        status: "applied"
      }
    ];

    setFavorites(mockFavorites);
    setFilteredFavorites(mockFavorites);
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
    if (filters.status) {
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
        break;
    }

    setFilteredFavorites(results);
  };

  const mockMessages = [
    {
      id: 1,
      property: "Modern Apartment",
      sender: "Adebola Johnson",
      message: "Thank you for your interest! When would you like to schedule a viewing?",
      time: "1 hour ago",
      unread: false
    }
  ];

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* ... existing stats code ... */}
      </div>

      {/* Search Section */}
      <DashboardSearch 
        onSearch={handleSearch}
        placeholder="Search favorites by title or location..."
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
                <div key={favorite.id} className="border rounded-lg p-4">
                  <img
                    src={favorite.image}
                    alt={favorite.title}
                    className="w-full h-32 object-cover rounded-lg mb-3"
                  />
                  <h3 className="font-semibold text-gray-900">{favorite.title}</h3>
                  <p className="text-sm text-gray-600">{favorite.location}</p>
                  <p className="text-sm font-semibold text-green-600 mt-1">
                    ₦{favorite.price.toLocaleString()}/year
                  </p>
                  <div className="mt-3">
                    <Link
                      to={`/property/${favorite.id}`}
                      className="text-green-600 hover:text-green-700 text-sm font-medium"
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
              <p className="text-gray-500">Try adjusting your search criteria</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border">
        {/* ... existing activity code ... */}
      </div>
    </div>
  );
};

export default TenantDashboard;