// components/Properties/PropertyDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPropertyById } from "../api/property";

const PropertyDetails = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getPropertyById(id);
        setProperty(data);
      } catch (err) {
        setError(err.message || "Failed to fetch property details");
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  if (loading) return <p>Loading property details...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!property) return <p>Property not found</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-4">{property.name}</h1>
      <p className="text-gray-700 mb-2"><strong>LocationPDETAIL:</strong> {property.location}</p>
      <p className="text-gray-700 mb-2"><strong>Pricedeta:</strong> ${property.price}</p>
      <p className="text-gray-600 mb-4">descrDETAIL{property.description}</p>
      {/* Add more fields if your API returns them, like images or amenities */}
    </div>
  );
};

export default PropertyDetails;
