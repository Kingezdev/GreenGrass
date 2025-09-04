// pages/PropertyDetails.jsx
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const PropertyDetails = () => {
  const { id } = useParams();
  const [activeImage, setActiveImage] = useState(0);
  
  // Mock data - replace with API call
  const property = {
    id: 1,
    title: "Modern 3-Bedroom Apartment",
    location: "Lekki Phase 1, Lagos",
    price: 1800000,
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
    ],
    description: "A beautiful modern apartment with stunning views of the city...",
    bedrooms: 3,
    bathrooms: 2,
    amenities: ["WiFi", "Parking", "Security", "Generator"],
    landlord: {
      name: "Adebola Johnson",
      verified: true,
      rating: 4.5
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Image Gallery */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <img src={property.images[activeImage]} alt={property.title} className="w-full h-96 object-cover rounded-lg" />
          <div className="grid grid-cols-4 gap-2 mt-2">
            {property.images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt=""
                className={`w-full h-20 object-cover cursor-pointer rounded ${
                  activeImage === index ? 'ring-2 ring-green-500' : ''
                }`}
                onClick={() => setActiveImage(index)}
              />
            ))}
          </div>
        </div>
        
        {/* Property Info */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">{property.title}</h1>
          <p className="text-gray-600">{property.location}</p>
          <p className="text-2xl font-bold text-green-600">₦{property.price.toLocaleString()}/year</p>
          
          <div className="flex space-x-4">
            <span>{property.bedrooms} beds</span>
            <span>{property.bathrooms} baths</span>
          </div>
          
          <button className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700">
            Contact Landlord
          </button>
          
          <button className="w-full border border-green-600 text-green-600 py-3 rounded-lg hover:bg-green-50">
            Add to Favorites
          </button>
        </div>
      </div>
      
      {/* Details Section */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold mb-4">Description</h2>
          <p className="text-gray-700">{property.description}</p>
          
          <h3 className="text-xl font-bold mt-6 mb-4">Amenities</h3>
          <div className="grid grid-cols-2 gap-2">
            {property.amenities.map((amenity, index) => (
              <div key={index} className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                {amenity}
              </div>
            ))}
          </div>
        </div>
        
        {/* Landlord Info */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-4">Landlord Information</h3>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
            <div>
              <p className="font-semibold">{property.landlord.name}</p>
              <div className="flex items-center">
                <span className="text-yellow-400">★★★★★</span>
                <span className="text-gray-600 ml-2">({property.landlord.rating})</span>
              </div>
            </div>
          </div>
          {property.landlord.verified && (
            <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded mt-2">
              Verified Landlord
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;