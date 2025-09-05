// components/PropertyDetailsTenant.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const PropertyDetailsTenant = ({ property, user }) => {
  const [activeImage, setActiveImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const formatNumber = (num) => {
    return num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || '0';
  };

  const handleAddToFavorites = () => {
    setIsFavorite(!isFavorite);
    alert(isFavorite ? 'Removed from favorites' : 'Added to favorites!');
  };

  const handleSendMessage = () => {
    if (!user) {
      alert('Please login to send messages');
      return;
    }
    alert('Message sent to landlord!');
    setShowContactForm(false);
    setMessage('');
  };

  const handleRentNow = () => {
    if (!user) {
      alert('Please login to proceed with payment');
      return;
    }
    navigate(`/payment/${property.id}`);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <Link to="/" className="text-green-600 hover:text-green-700 text-sm font-medium">
          ← Back to Browse
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mt-2">{property.title}</h1>
        <p className="text-gray-600">{property.location}</p>
      </div>

      {/* Image Gallery */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div>
          <img
            src={property.images[activeImage]}
            alt={property.title}
            className="w-full h-96 object-cover rounded-lg"
          />
          <div className="grid grid-cols-4 gap-2 mt-2">
            {property.images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt=""
                className={`w-full h-20 object-cover cursor-pointer rounded ${
                  activeImage === index ? 'ring-2 ring-green-500' : 'border border-gray-200'
                }`}
                onClick={() => setActiveImage(index)}
              />
            ))}
          </div>
        </div>

        {/* Property Info & Actions */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl font-bold text-green-600">
                ₦{formatNumber(property.price)}/year
              </div>
              {property.verified && (
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                  Verified Property
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{property.bedrooms}</div>
                <div className="text-sm text-gray-600">Bedrooms</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{property.bathrooms}</div>
                <div className="text-sm text-gray-600">Bathrooms</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{property.area}</div>
                <div className="text-sm text-gray-600">Sq Meters</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{property.yearBuilt}</div>
                <div className="text-sm text-gray-600">Year Built</div>
              </div>
            </div>

            <div className="space-y-3">
              {/* Rent Now Button - Primary CTA */}
              <button
                onClick={handleRentNow}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-medium flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Rent Now - Secure Payment
              </button>

              <button
                onClick={() => setShowContactForm(true)}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium"
              >
                Contact Landlord
              </button>
              
              <button
                onClick={handleAddToFavorites}
                className={`w-full border py-3 rounded-lg font-medium ${
                  isFavorite
                    ? 'border-red-600 text-red-600 hover:bg-red-50'
                    : 'border-green-600 text-green-600 hover:bg-green-50'
                }`}
              >
                {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
              </button>

              <button className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 font-medium">
                Schedule Viewing
              </button>
            </div>

            {/* Security Badge */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-center text-sm text-green-600">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>Secure Escrow Payment Protection</span>
              </div>
            </div>
          </div>

          {/* Landlord Info */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold mb-4">Landlord Information</h3>
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-lg font-semibold text-gray-400">
                  {property.landlord.name.charAt(0)}
                </span>
              </div>
              <div>
                <p className="font-semibold">{property.landlord.name}</p>
                <div className="flex items-center">
                  <span className="text-yellow-400">★★★★★</span>
                  <span className="text-gray-600 ml-2">({property.landlord.rating})</span>
                </div>
              </div>
            </div>
            
            {property.landlord.verified && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center">
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded mr-2">
                    Verified
                  </span>
                  <span className="text-sm text-green-800">Identity confirmed</span>
                </div>
                <p className="text-xs text-green-600 mt-1">
                  Response rate: {property.landlord.responseRate} • 
                  Response time: {property.landlord.responseTime}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Contact Landlord</h3>
              <button
                onClick={() => setShowContactForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Message
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Tell the landlord why you're interested in this property..."
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowContactForm(false)}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendMessage}
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Property Details */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">Property Details</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">Description</h3>
            <p className="text-gray-700 leading-relaxed">{property.description}</p>

            <h3 className="text-xl font-semibold mt-8 mb-4">Amenities</h3>
            <div className="grid grid-cols-2 gap-2">
              {property.amenities.map((amenity, index) => (
                <div key={index} className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Property Features</h3>
            <div className="space-y-4">
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Property Type</span>
                <span className="font-medium">{property.propertyType}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Bedrooms</span>
                <span className="font-medium">{property.bedrooms}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Bathrooms</span>
                <span className="font-medium">{property.bathrooms}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Area</span>
                <span className="font-medium">{property.area} sqm</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Year Built</span>
                <span className="font-medium">{property.yearBuilt}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Status</span>
                <span className="font-medium text-green-600">{property.status}</span>
              </div>
            </div>

            <h3 className="text-xl font-semibold mt-8 mb-4">Property Insights</h3>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 text-blue-800">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium">This property has been viewed {property.views} times</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Location Map (placeholder) */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-2xl font-bold mb-4">Location</h2>
        <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center">
          <div className="text-center text-gray-600">
            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p>Map would be displayed here</p>
            <p className="text-sm">{property.location}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailsTenant;