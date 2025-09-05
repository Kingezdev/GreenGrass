// pages/ViewPropertyDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PropertyDetailsLandlord from '../components/PropertyDetailsLandlord';
import PropertyDetailsTenant from '../components/PropertyDetailsTenant';
import propertyData from '../data/propertyData';

const PropertyDetails = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Get user data from localStorage
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);

    // Find the property in propertyData.js based on the ID from URL params
    const fetchProperty = () => {
      try {
        // Convert id to number since property IDs in propertyData are numbers
        const propertyId = parseInt(id);
        
        // Find the property in the imported propertyData
        const foundProperty = propertyData.find(prop => prop.id === propertyId);
        
        if (foundProperty) {
          // Transform the property data to match the expected format
          const transformedProperty = {
            id: foundProperty.id,
            title: foundProperty.title,
            location: foundProperty.location,
            price: foundProperty.price,
            images: foundProperty.images,
            description: foundProperty.description,
            bedrooms: foundProperty.bedrooms,
            bathrooms: foundProperty.bathrooms,
            area: foundProperty.area,
            yearBuilt: 2020, // Default value, you might want to add this to propertyData
            propertyType: "apartment", // Default value, you might want to add this to propertyData
            amenities: foundProperty.amenities,
            landlord: foundProperty.landlord,
            status: "available", // Default status
            views: Math.floor(Math.random() * 300) + 50, // Random views for demo
            inquiries: Math.floor(Math.random() * 40) + 5, // Random inquiries for demo
            createdAt: foundProperty.availableFrom,
            verified: foundProperty.landlord.verified
          };
          
          setProperty(transformedProperty);
        } else {
          setError("Property not found");
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching property:', err);
        setError('Failed to load property details');
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-sm border">
          <div className="text-6xl mb-4">🏠</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Property Not Found</h2>
          <p className="text-gray-600 mb-4">
            {error || "The property you're looking for doesn't exist or may have been removed."}
          </p>
          <a
            href="/properties"
            className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 font-medium"
          >
            Browse Properties
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {user?.role === 'landlord' ? (
        <PropertyDetailsLandlord property={property} user={user} />
      ) : (
        <PropertyDetailsTenant property={property} user={user} />
      )}
    </div>
  );
};

export default PropertyDetails;