// components/PropertyCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const PropertyCard = ({ property }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
      <img
        src={property.image}
        alt={property.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-gray-900 line-clamp-1">{property.title}</h3>
          {property.verified && (
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
              Verified
            </span>
          )}
        </div>
        <p className="text-gray-600 text-sm mb-3">{property.location}</p>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-lg font-bold text-green-600">
            ₦{property.price.toLocaleString()}/year
          </span>
          <div className="text-sm text-gray-500">
            {property.bedrooms} bed • {property.bathrooms} bath
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
          {property.amenities.slice(0, 3).map(amenity => (
            <span
              key={amenity}
              className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded"
            >
              {amenity}
            </span>
          ))}
          {property.amenities.length > 3 && (
            <span className="text-gray-400 text-xs">+{property.amenities.length - 3} more</span>
          )}
        </div>

        <Link
          to={`/property/${property.id}`}
          className="block w-full bg-green-600 text-white text-center py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default PropertyCard;