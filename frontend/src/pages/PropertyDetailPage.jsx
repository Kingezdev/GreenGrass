// src/pages/PropertyDetailsPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPropertyById } from "../api/property";
import { useHandle404Redirect } from "../utils/handleErrors";
import HandleLoading from "../utils/HandleLoading";

const PropertyDetailsPage = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const handle404 = useHandle404Redirect();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getPropertyById(id);
        setProperty(data);
      } catch (err) {
        console.error(err);
        if (err.message.includes("404")) {
          handle404(err);
        } else {
          setError("Server error. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  if (loading) return <HandleLoading loading={true} />;

  if (error)
    return (
      <div className="max-w-3xl mx-auto p-6 text-center text-red-500">
        <p>{error}</p>
        <button
          onClick={() => navigate("/properties")}
          className="mt-4 text-blue-500 hover:underline"
        >
          Back to Properties
        </button>
      </div>
    );

  if (!property) return null;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-blue-500 hover:underline"
      >
        &larr; Back
      </button>

      <div className="border rounded-lg p-6 shadow-lg">
        <h1 className="text-3xl font-bold mb-4">{property.title}</h1>
        <p className="text-gray-700 mb-2">
          <strong>Location:</strong> {property.location}
        </p>
        <p className="text-gray-700 mb-2">
          <strong>Price:</strong> ${property.price}
        </p>
        <p className="text-gray-700 mb-2">
          <strong>Description:</strong> {property.description || "N/A"}
        </p>

        {property.amenities && property.amenities.length > 0 && (
          <div className="mb-4">
            <strong>Amenities:</strong>
            <ul className="list-disc list-inside">
              {property.amenities.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {property.images && property.images.length > 0 && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {property.images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`${property.title} ${index + 1}`}
                className="rounded-lg object-cover w-full h-64"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyDetailsPage;
