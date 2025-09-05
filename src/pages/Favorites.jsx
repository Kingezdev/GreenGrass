// pages/Favorites.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Favorites = () => {
  // Mock favorites data
  const favorites = []; // Empty for demonstration

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Favorite Properties</h1>
      
      {favorites.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">❤️</div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">No favorites yet</h2>
          <p className="text-gray-500 mb-6">Start saving properties you're interested in!</p>
          <Link
            to="/"
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
          >
            Browse Properties
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Map through favorites */}
          {favorites.map(property => (
            <div key={property.id} className="border rounded-lg overflow-hidden">
              <img src={property.image} alt={property.title} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="font-semibold">{property.title}</h3>
                <p className="text-gray-600 text-sm">{property.location}</p>
                <p className="text-green-600 font-bold">₦{property.price.toLocaleString()}/year</p>
                <Link
                  to={`/property/${property.id}`}
                  className="inline-block mt-2 text-green-600 hover:text-green-700"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;