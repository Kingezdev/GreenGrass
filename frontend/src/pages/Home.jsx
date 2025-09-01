import React from "react";
import { properties } from "../mock/properties";
import PropertyCard from "../components/PropertyCards.jsx";

const Home = () => {
  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
};

export default Home;
