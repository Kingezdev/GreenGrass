import React from "react";
import { useParams } from "react-router-dom";
import { users } from "../mock/users";
import RatingStars from "../components/RatingStars";

const TenantProfile = () => {
  const { id } = useParams();
  const tenant = users.find((u) => u.id === parseInt(id) && u.role === "tenant");

  if (!tenant) return <p className="p-6">Tenant not found!</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row gap-6 mb-6">
        <img
          src={tenant.profilePic}
          alt={tenant.name}
          className="w-32 h-32 rounded-full object-cover border-2 border-green-600"
        />
        <div>
          <h2 className="text-2xl font-bold">{tenant.name}</h2>
          <div className="flex items-center gap-2 mt-1">
            <RatingStars rating={tenant.rating} />
            <span className="text-sm text-gray-600">{tenant.rating} stars</span>
          </div>
          <p className="mt-2 text-gray-600">{tenant.favorites.length} favorite listings</p>
          <p className="mt-1 text-gray-500">Verified Tenant ✅</p>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">Reviews from Landlords</h3>
        {/* Mock reviews */}
        <div className="space-y-4">
          <div className="border p-3 rounded">
            <p className="font-semibold">Tunde Ade</p>
            <RatingStars rating={5} />
            <p className="text-gray-600 mt-1">Tenant was punctual and took care of the property.</p>
          </div>
          <div className="border p-3 rounded">
            <p className="font-semibold">Jane Smith</p>
            <RatingStars rating={4} />
            <p className="text-gray-600 mt-1">Good tenant, no issues during stay.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantProfile;
