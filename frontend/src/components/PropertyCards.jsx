import React from "react";
import RatingStars from "./RatingStars";

const PropertyCard = ({ property }) => {
  return (
    <div className="border rounded-lg p-4 shadow hover:shadow-lg transition">
      <img src={property.images[0]} className="w-full h-48 object-cover rounded" />
      <h3 className="text-lg font-bold mt-2">{property.title}</h3>
      <p className="text-sm text-gray-600">{property.location}</p>
      <p className="text-green-600 font-semibold">₦{property.price.toLocaleString()}</p>
      <p className="text-sm mt-1">{property.rooms} rooms</p>
      <div className="flex justify-between items-center mt-2">
        <RatingStars rating={property.rating || 0} />
        {property.verified && <span className="text-blue-600 text-sm font-semibold">Verified</span>}
      </div>
    </div>
  );
};

export default PropertyCard;
