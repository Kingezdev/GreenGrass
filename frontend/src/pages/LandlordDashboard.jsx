import React from 'react';
import { Link } from 'react-router-dom';

const LandlordDashboard = ({ user }) => {
  // Mock data
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
      verified: true
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
      verified: false
    }
  ];

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

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-4 0H9m4 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v12m4 0h.01" />
                </svg>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Total Properties</dt>
                <dd className="text-lg font-medium text-gray-900">{mockProperties.length}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Total Views</dt>
                <dd className="text-lg font-medium text-gray-900">
                  {mockProperties.reduce((sum, prop) => sum + prop.views, 0)}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Inquiries</dt>
                <dd className="text-lg font-medium text-gray-900">
                  {mockProperties.reduce((sum, prop) => sum + prop.inquiries, 0)}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Verified</dt>
                <dd className="text-lg font-medium text-gray-900">
                  {mockProperties.filter(prop => prop.verified).length}/{mockProperties.length}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Properties List */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Your Properties</h3>
            <Link
              to="/add-property"
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm font-medium"
            >
              Add New Property
            </Link>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {mockProperties.map((property) => (
            <div key={property.id} className="p-6">
              <div className="flex items-center space-x-4">
                <img
                  src={property.image}
                  alt={property.title}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 truncate">
                    {property.title}
                  </h4>
                  <p className="text-sm text-gray-500 truncate">{property.location}</p>
                  <p className="text-sm font-semibold text-green-600">
                    ₦{property.price.toLocaleString()}/year
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    property.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {property.status}
                  </span>
                  <span className="text-sm text-gray-500">{property.views} views</span>
                  <Link
                    to={`/property/${property.id}`}
                    className="text-green-600 hover:text-green-700 text-sm font-medium"
                  >
                    View
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Messages */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Messages</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {mockMessages.map((message) => (
            <div key={message.id} className="p-6">
              <div className="flex items-start space-x-3">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  message.unread ? 'bg-green-400' : 'bg-gray-300'
                }`}></div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900">
                    {message.sender} - {message.property}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">{message.message}</p>
                  <p className="text-xs text-gray-400 mt-2">{message.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LandlordDashboard;