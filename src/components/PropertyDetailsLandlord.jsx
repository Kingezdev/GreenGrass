// components/PropertyDetailsLandlord.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const PropertyDetailsLandlord = ({ property, user }) => {
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  const formatNumber = (num) => {
    return num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || '0';
  };

  const handleEdit = () => {
    navigate(`/edit-property/${property.id}`);
  };

  const handleStatusChange = (newStatus) => {
    // In real app, this would update the property status via API
    alert(`Property status changed to ${newStatus}`);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header with Actions */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link to="/dashboard" className="text-green-600 hover:text-green-700 text-sm font-medium">
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-2">{property.title}</h1>
          <p className="text-gray-600">{property.location}</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleEdit}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            Edit Property
          </button>
          <select
            value={property.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="inactive">Inactive</option>
            <option value="rented">Rented</option>
          </select>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <img
              src={property.images[activeImage]}
              alt={property.title}
              className="w-full h-80 object-cover rounded-lg"
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

          {/* Quick Stats */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600">₦{formatNumber(property.price)}</div>
                <div className="text-sm text-gray-600">Annual Rent</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">{property.views}</div>
                <div className="text-sm text-gray-600">Total Views</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">{property.inquiries}</div>
                <div className="text-sm text-gray-600">Inquiries</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">{property.landlord.rating}</div>
                <div className="text-sm text-gray-600">Rating</div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Property Status</h3>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                property.status === 'active' ? 'bg-green-100 text-green-800' :
                property.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                property.status === 'rented' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {property.status?.charAt(0).toUpperCase() + property.status?.slice(1)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm border mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {['overview', 'performance', 'inquiries'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <h2 className="text-xl font-semibold mb-4">Description</h2>
                <p className="text-gray-700 leading-relaxed">{property.description}</p>

                <h3 className="text-xl font-semibold mt-8 mb-4">Property Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-600">Property Type:</span>
                    <p className="font-medium">{property.propertyType}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Bedrooms:</span>
                    <p className="font-medium">{property.bedrooms}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Bathrooms:</span>
                    <p className="font-medium">{property.bathrooms}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Area:</span>
                    <p className="font-medium">{property.area} sqm</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Year Built:</span>
                    <p className="font-medium">{property.yearBuilt}</p>
                  </div>
                </div>

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

              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
                      View Messages
                    </button>
                    <button className="w-full border border-green-600 text-green-600 py-2 px-4 rounded-lg hover:bg-green-50">
                      Share Property
                    </button>
                    <button className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50">
                      Download Report
                    </button>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Verification Status</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Property Verified</span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        property.verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {property.verified ? 'Verified' : 'Pending'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Documents</span>
                      <span className="text-blue-600 text-sm font-medium cursor-pointer">
                        Upload
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'performance' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Performance Analytics</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{property.views}</div>
                  <div className="text-sm text-gray-600">Total Views</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{property.inquiries}</div>
                  <div className="text-sm text-gray-600">Total Inquiries</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{(property.inquiries / property.views * 100).toFixed(1)}%</div>
                  <div className="text-sm text-gray-600">Conversion Rate</div>
                </div>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg text-center">
                <p className="text-gray-600">Analytics charts would be displayed here</p>
              </div>
            </div>
          )}

          {activeTab === 'inquiries' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Recent Inquiries</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Tunde Adeyemi</h4>
                    <p className="text-sm text-gray-600">Interested in viewing the property</p>
                    <p className="text-xs text-gray-400">2 hours ago</p>
                  </div>
                  <button className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700">
                    Respond
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Funke Adebayo</h4>
                    <p className="text-sm text-gray-600">Asked about availability</p>
                    <p className="text-xs text-gray-400">1 day ago</p>
                  </div>
                  <button className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700">
                    Respond
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailsLandlord;