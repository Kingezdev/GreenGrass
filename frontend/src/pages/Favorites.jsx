import React from "react";
import { users } from "../mock/users";
import { properties } from "../mock/properties";
import PropertyCard from "../components/PropertyCards.jsx";

const Favorites = () => {
  // For demo, pick first tenant
  const tenant = users.find((u) => u.role === "tenant");
  const favoriteProperties = properties.filter((p) => tenant.favorites.includes(p.id));

  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {favoriteProperties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
};

export default Favorites;
