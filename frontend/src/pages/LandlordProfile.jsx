import React from "react";
import { useParams } from "react-router-dom";
import { users } from "../mock/users.js";
import { properties } from "../mock/properties";
import PropertyCard from "../components/PropertyCards.jsx";
import RatingStars from "../components/RatingStars.jsx";

const LandlordProfile = () => {
  const { id } = useParams();
  const landlord = users.find((u) => u.id === parseInt(id) && u.role === "landlord");

  if (!landlord) return <p className="p-6">Landlord not found!</p>;

  // Filter properties by landlord id (for demo assume properties have landlordId)
  const landlordProperties = properties.filter((p) => p.landlordId === landlord.id || true); // For demo, show all

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row gap-6 mb-6">
        <img
          src={landlord.profilePic}
          alt={landlord.name}
          className="w-32 h-32 rounded-full object-cover border-2 border-green-600"
        />
        <div>
          <h2 className="text-2xl font-bold">{landlord.name}</h2>
          <div className="flex items-center gap-2 mt-1">
            <RatingStars rating={landlord.rating} />
            <span className="text-sm text-gray-600">{landlord.rating} stars</span>
          </div>
          <p className="mt-2 text-gray-600">{landlord.listings} active listings</p>
          <p className="mt-1 text-gray-500">Verified Landlord ✅</p>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Listings</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {landlordProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">Reviews from Tenants</h3>
        {/* Mock reviews */}
        <div className="space-y-4">
          <div className="border p-3 rounded">
            <p className="font-semibold">Chioma Eze</p>
            <RatingStars rating={5} />
            <p className="text-gray-600 mt-1">Very responsive and helpful landlord!</p>
          </div>
          <div className="border p-3 rounded">
            <p className="font-semibold">John Doe</p>
            <RatingStars rating={4} />
            <p className="text-gray-600 mt-1">Property was exactly as described.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandlordProfile;
