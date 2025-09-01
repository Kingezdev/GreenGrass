import React from "react";
import { useParams } from "react-router-dom";
import { properties } from "../mock/properties";
import RatingStars from "../components/RatingStars.jsx";

const PropertyDetails = () => {
  const { id } = useParams();
  const property = properties.find((p) => p.id === parseInt(id));

  if (!property) return <p className="p-6">Property not found!</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <img
            src={property.images[0]}
            alt={property.title}
            className="w-full h-72 object-cover rounded"
          />
        </div>
        <div>
          <h2 className="text-2xl font-bold">{property.title}</h2>
          <p className="text-gray-600 mt-2">{property.location}</p>
          <p className="text-green-600 font-semibold mt-2">₦{property.price.toLocaleString()}</p>
          <p className="mt-2">{property.rooms} rooms</p>
          <RatingStars rating={property.rating || 0} />
          <p className="mt-4">{property.description}</p>
          <div className="mt-4">
            <span className="font-semibold">Preferred Tenants:</span> {property.preferredTenants.join(", ")}
          </div>
          <div className="mt-2 flex gap-2">
            {property.amenities.map((amenity, i) => (
              <span key={i} className="bg-gray-200 px-2 py-1 rounded text-sm">{amenity}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
