import React from 'react';
import { useParams, Link } from 'react-router-dom';

const LandlordProfile = () => {
  const { id } = useParams();

  // Mock landlord data - replace with API call
  const landlord = {
    id: 1,
    name: "Adebola Johnson",
    email: "adebola@example.com",
    phone: "+234 812 345 6789",
    joinedDate: "January 2023",
    verified: true,
    rating: 4.5,
    totalReviews: 23,
    responseRate: "95%",
    responseTime: "within 2 hours",
    properties: [
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
        status: "active",
        views: 96,
        inquiries: 11,
        verified: false
      }
    ],
    reviews: [
      {
        id: 1,
        tenantName: "Chinedu Okoro",
        tenantImage: "",
        rating: 5,
        comment: "Excellent landlord! Very responsive and the property was exactly as described. Maintenance issues were handled promptly.",
        date: "2 weeks ago",
        property: "Modern 3-Bedroom Apartment"
      },
      {
        id: 2,
        tenantName: "Funke Adebayo",
        tenantImage: "",
        rating: 4,
        comment: "Good experience overall. The apartment is well-maintained and the location is perfect. Would recommend.",
        date: "1 month ago",
        property: "Cozy 2-Bedroom Flat"
      },
      {
        id: 3,
        tenantName: "Tunde Ojo",
        tenantImage: "",
        rating: 5,
        comment: "Best landlord I've ever had. Very understanding and professional. The property exceeded my expectations.",
        date: "2 months ago",
        property: "Modern 3-Bedroom Apartment"
      }
    ]
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={index < rating ? 'text-yellow-400' : 'text-gray-300'}
      >
        ★
      </span>
    ));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-gray-400">
              {landlord.name.charAt(0)}
            </span>
          </div>
          
          <div className="flex-1">
            <div className="flex items-center space-x-3">
              <h1 className="text-3xl font-bold">{landlord.name}</h1>
              {landlord.verified && (
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                  Verified Landlord
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-4 mt-2">
              <div className="flex items-center">
                {renderStars(landlord.rating)}
                <span className="ml-2 text-gray-600">
                  {landlord.rating} ({landlord.totalReviews} reviews)
                </span>
              </div>
              
              <span className="text-gray-400">•</span>
              <span className="text-gray-600">Member since {landlord.joinedDate}</span>
            </div>
            
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center">
                <span className="text-green-600 font-semibold">Response rate: {landlord.responseRate}</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-600 font-semibold">Response time: {landlord.responseTime}</span>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
              Contact
            </button>
            <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50">
              Message
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Properties Section */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Properties ({landlord.properties.length})</h2>
            </div>
            <div className="divide-y">
              {landlord.properties.map((property) => (
                <div key={property.id} className="p-6">
                  <div className="flex items-center space-x-4">
                    <img
                      src={property.image}
                      alt={property.title}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold">{property.title}</h3>
                      <p className="text-gray-600 text-sm">{property.location}</p>
                      <p className="text-green-600 font-bold">
                        ₦{property.price.toLocaleString()}/year
                      </p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                        <span>{property.views} views</span>
                        <span>{property.inquiries} inquiries</span>
                        {property.verified && (
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                            Verified
                          </span>
                        )}
                      </div>
                    </div>
                    <Link
                      to={`/property/${property.id}`}
                      className="text-green-600 hover:text-green-700 text-sm font-medium"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews Section */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Reviews ({landlord.reviews.length})</h2>
                <div className="flex items-center">
                  <span className="text-2xl font-bold text-gray-900">{landlord.rating}</span>
                  <div className="ml-2">
                    <div className="flex">{renderStars(landlord.rating)}</div>
                    <p className="text-sm text-gray-600">{landlord.totalReviews} reviews</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="divide-y">
              {landlord.reviews.map((review) => (
                <div key={review.id} className="p-6">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-400">
                        {review.tenantName.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">{review.tenantName}</h4>
                        <span className="text-sm text-gray-400">{review.date}</span>
                      </div>
                      <div className="flex items-center mt-1">
                        {renderStars(review.rating)}
                      </div>
                      <p className="text-gray-600 text-sm mt-2">{review.property}</p>
                      <p className="text-gray-700 mt-2">{review.comment}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="font-semibold mb-4">Contact Information</h3>
            <div className="space-y-2 text-sm">
              <p className="text-gray-600">{landlord.email}</p>
              <p className="text-gray-600">{landlord.phone}</p>
            </div>
          </div>

          {/* Verification Status */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="font-semibold mb-4">Verification Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Email</span>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                  Verified
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Phone</span>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                  Verified
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Identity</span>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                  Verified
                </span>
              </div>
            </div>
          </div>

          {/* Response Stats */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="font-semibold mb-4">Response Stats</h3>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-600">Response rate</span>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: landlord.responseRate }}
                  ></div>
                </div>
                <p className="text-sm text-green-600 mt-1">{landlord.responseRate}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Response time</span>
                <p className="text-sm text-green-600 mt-1">{landlord.responseTime}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandlordProfile;