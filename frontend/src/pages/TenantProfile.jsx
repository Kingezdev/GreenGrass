import React from 'react';
import { useParams } from 'react-router-dom';

const TenantProfile = () => {
  const { id } = useParams();

  // Mock tenant data - replace with API call
  const tenant = {
    id: 1,
    name: "Tunde Adeyemi",
    email: "tunde@example.com",
    phone: "+234 803 456 7890",
    joinedDate: "March 2023",
    verified: true,
    employmentStatus: "Employed",
    maritalStatus: "Single",
    rentalHistory: [
      {
        id: 1,
        property: "Luxury Apartment",
        location: "Victoria Island, Lagos",
        duration: "Jan 2022 - Dec 2022",
        rent: "₦1,200,000/year",
        status: "Completed",
        landlord: "Adebola Johnson",
        rating: 5,
        review: "Excellent tenant. Always paid rent on time and maintained the property well."
      },
      {
        id: 2,
        property: "Studio Apartment",
        location: "Surulere, Lagos",
        duration: "Jun 2021 - Dec 2021",
        rent: "₦600,000/year",
        status: "Completed",
        landlord: "Chinedu Okoro",
        rating: 4,
        review: "Good tenant. Quiet and respectful of the property."
      }
    ],
    references: [
      {
        id: 1,
        name: "Adebola Johnson",
        relationship: "Previous Landlord",
        phone: "+234 812 345 6789",
        email: "adebola@example.com"
      },
      {
        id: 2,
        name: "Chinedu Okoro",
        relationship: "Previous Landlord",
        phone: "+234 803 123 4567",
        email: "chinedu@example.com"
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
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-gray-400">
              {tenant.name.charAt(0)}
            </span>
          </div>
          
          <div className="flex-1">
            <div className="flex items-center space-x-3">
              <h1 className="text-3xl font-bold">{tenant.name}</h1>
              {tenant.verified && (
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                  Verified Tenant
                </span>
              )}
            </div>
            
            <div className="mt-2 text-gray-600">
              <p>Member since {tenant.joinedDate}</p>
            </div>
            
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-semibold">Employment:</span> {tenant.employmentStatus}
              </div>
              <div>
                <span className="font-semibold">Marital Status:</span> {tenant.maritalStatus}
              </div>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
              Contact
            </button>
            <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50">
              Request Reference
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Rental History */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">Rental History ({tenant.rentalHistory.length})</h2>
          </div>
          <div className="divide-y">
            {tenant.rentalHistory.map((rental) => (
              <div key={rental.id} className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{rental.property}</h3>
                    <p className="text-gray-600 text-sm">{rental.location}</p>
                    <p className="text-green-600 font-semibold mt-1">{rental.rent}</p>
                    <p className="text-sm text-gray-500 mt-1">{rental.duration}</p>
                    <p className="text-sm text-gray-500">Landlord: {rental.landlord}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${
                    rental.status === 'Completed' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {rental.status}
                  </span>
                </div>
                
                {rental.review && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center mb-2">
                      <span className="font-semibold text-sm">Landlord Review:</span>
                      <div className="flex ml-2">
                        {renderStars(rental.rating)}
                      </div>
                    </div>
                    <p className="text-sm text-gray-700">{rental.review}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* References */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">References ({tenant.references.length})</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tenant.references.map((reference) => (
                <div key={reference.id} className="border rounded-lg p-4">
                  <h3 className="font-semibold">{reference.name}</h3>
                  <p className="text-sm text-gray-600">{reference.relationship}</p>
                  <div className="mt-3 space-y-1 text-sm">
                    <p className="text-gray-600">{reference.phone}</p>
                    <p className="text-gray-600">{reference.email}</p>
                  </div>
                  <button className="mt-3 text-green-600 hover:text-green-700 text-sm font-medium">
                    Contact Reference
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Verification Status */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="font-semibold mb-4">Verification Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Email Verification</span>
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                Verified
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Phone Verification</span>
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                Verified
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Identity Verification</span>
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                Verified
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Employment Verification</span>
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                Verified
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantProfile;