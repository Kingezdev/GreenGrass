// components/Properties/PropertyList.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllProperties } from "../../api/property";

const PropertyList = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const data = await getAllProperties();
        setProperties(data);
      } catch (err) {
        setError(err.message || "Failed to fetch properties");
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  if (loading) return <p>Loading properties...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {properties.length === 0 ? (
        <p>No propertiesPLIST available.</p>
      ) : (
        properties.map((property) => (
          <div
            key={property.id}
            className="border rounded-lg p-4 shadow hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold mb-2">{property.name}</h2>
            <p className="text-gray-600 mb-1">LocationPLIST: {property.location}</p>
            <p className="text-gray-600 mb-1">PricePLIST: ${property.price}</p>
            <p className="text-gray-500 text-sm">PLIST{property.description}</p>
            <Link
              to={`/rooms/${property.id}`} // link to rooms page from plist
              className="mt-auto inline-block bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
            >
              View Rooms
            </Link>
          </div>
        ))
      )}
    </div>
  );
};

export default PropertyList;
