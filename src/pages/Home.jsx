// pages/Home.jsx
import React, { useState, useEffect } from 'react';
import AdvancedSearch from '../components/AdvancedSearch';
import PropertyCard from '../components/PropertyCard';

const Home = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Mock data - replace with API call
  useEffect(() => {
    const mockProperties = [
      {
        id: 1,
        title: "Modern 3-Bedroom Apartment",
        location: "Lekki Phase 1, Lagos",
        price: 1800000,
        image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
        bedrooms: 3,
        bathrooms: 2,
        propertyType: "apartment",
        amenities: ["wifi", "parking", "security", "generator"],
        verified: true,
        area: 120,
        available: true
      },
      {
        id: 2,
        title: "Cozy 2-Bedroom Flat",
        location: "GRA, Ibadan",
        price: 850000,
        image: "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=784&q=80",
        bedrooms: 2,
        bathrooms: 1,
        propertyType: "apartment",
        amenities: ["wifi", "parking"],
        verified: false,
        area: 80,
        available: true
      },
      {
        id: 3,
        title: "Luxury 4-Bedroom Duplex",
        location: "Victoria Island, Lagos",
        price: 3500000,
        image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
        bedrooms: 4,
        bathrooms: 3,
        propertyType: "duplex",
        amenities: ["wifi", "parking", "security", "generator", "ac", "pool"],
        verified: true,
        area: 250,
        available: false
      }
    ];

    setProperties(mockProperties);
    setFilteredProperties(mockProperties);
    setIsLoading(false);
  }, []);

  const handleSearch = (filters) => {
    let results = [...properties];

    // Apply filters
    if (filters.location) {
      results = results.filter(prop =>
        prop.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.minPrice) {
      results = results.filter(prop => prop.price >= parseInt(filters.minPrice));
    }

    if (filters.maxPrice) {
      results = results.filter(prop => prop.price <= parseInt(filters.maxPrice));
    }

    if (filters.propertyType) {
      results = results.filter(prop => prop.propertyType === filters.propertyType);
    }

    if (filters.bedrooms) {
      results = results.filter(prop => prop.bedrooms >= parseInt(filters.bedrooms));
    }

    if (filters.bathrooms) {
      results = results.filter(prop => prop.bathrooms >= parseInt(filters.bathrooms));
    }

    if (filters.minArea) {
      results = results.filter(prop => prop.area >= parseInt(filters.minArea));
    }

    if (filters.maxArea) {
      results = results.filter(prop => prop.area <= parseInt(filters.maxArea));
    }

    if (filters.amenities.length > 0) {
      results = results.filter(prop =>
        filters.amenities.every(amenity => prop.amenities.includes(amenity))
      );
    }

    if (filters.verifiedOnly) {
      results = results.filter(prop => prop.verified);
    }

    if (filters.availableNow) {
      results = results.filter(prop => prop.available);
    }

    setFilteredProperties(results);
  };

  const handleReset = () => {
    setFilteredProperties(properties);
  };

  const handleQuickSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    
    if (query) {
      const results = properties.filter(prop =>
        prop.title.toLowerCase().includes(query) ||
        prop.location.toLowerCase().includes(query) ||
        prop.propertyType.toLowerCase().includes(query)
      );
      setFilteredProperties(results);
    } else {
      setFilteredProperties(properties);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Search */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Find Your Perfect Home</h1>
          <p className="text-lg mb-8">Discover verified properties across Nigeria with secure transactions</p>
          
          {/* Quick Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by location, property type, or keywords..."
                value={searchQuery}
                onChange={handleQuickSearch}
                className="w-full px-6 py-4 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <svg
                className="absolute right-3 top-3.5 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Advanced Search */}
        <AdvancedSearch onSearch={handleSearch} onReset={handleReset} />

        {/* Results Count */}
        <div className="my-6 flex justify-between items-center">
          <p className="text-gray-600">
            Showing {filteredProperties.length} of {properties.length} properties
          </p>
          <select className="border border-gray-300 rounded-lg px-3 py-2">
            <option value="newest">Newest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="verified">Verified First</option>
          </select>
        </div>

        {/* Properties Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(n => (
              <div key={n} className="bg-white rounded-lg shadow-sm border p-4 animate-pulse">
                <div className="bg-gray-300 h-48 rounded-lg mb-4"></div>
                <div className="space-y-3">
                  <div className="bg-gray-300 h-4 rounded"></div>
                  <div className="bg-gray-300 h-4 rounded w-2/3"></div>
                  <div className="bg-gray-300 h-6 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map(property => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No properties found</h3>
            <p className="text-gray-500">Try adjusting your search criteria or browse all properties</p>
            <button
              onClick={handleReset}
              className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
            >
              Show All Properties
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;