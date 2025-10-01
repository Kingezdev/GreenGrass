// components/Home/Listings.jsx
import React, { useState, useEffect } from 'react';
import propertyData from '../../data/propertyData';

const Listings = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const transformedProperties = propertyData.map(property => ({
      id: property.id,
      title: property.title,
      location: property.location,
      price: property.price,
      image: property.images[0], 
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      propertyType: "apartment", 
      amenities: property.amenities,
      verified: property.landlord.verified,
      area: property.area,
      available: true, 
      landlord: property.landlord,
      description: property.description,
      images: property.images
    }));

    setProperties(transformedProperties);
    setFilteredProperties(transformedProperties);
    setIsLoading(false);
  }, []);

 
  const handleReset = () => {
    setFilteredProperties(properties);
  };

  const handleSortChange = (e) => {
    const sortBy = e.target.value;
    let sortedProperties = [...filteredProperties];
    
    switch (sortBy) {
      case 'newest':
        sortedProperties.sort((a, b) => b.id - a.id);
        break;
      case 'price-low':
        sortedProperties.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        sortedProperties.sort((a, b) => b.price - a.price);
        break;
      case 'verified':
        sortedProperties.sort((a, b) => b.verified - a.verified);
        break;
      default:
        break;
    }
    
    setFilteredProperties(sortedProperties);
  };

  return (
    <section className="relative z-30 py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800">Featured Properties</h2>
          <p className="text-gray-600 mt-4">Discover our curated selection of premium properties</p>
        </div>

    

        <div className="my-6 flex justify-between items-center">
          <p className="text-gray-600">
            Showing {filteredProperties.length} of {properties.length} properties
          </p>
          <select
            onChange={handleSortChange}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="newest">Newest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="verified">Verified First</option>
          </select>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(n => (
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

        <div className="text-center mt-12">
          <button className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors">
            View All Properties
          </button>
        </div>
      </div>

    </section>
  );
};

export default Listings;