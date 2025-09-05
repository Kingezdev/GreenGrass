// pages/PropertyDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PropertyDetailsLandlord from '../components/PropertyDetailsLandlord';
import PropertyDetailsTenant from '../components/PropertyDetailsTenant';

const PropertyDetails = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get user data from localStorage
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);

    // Mock property data - replace with API call
    const mockProperty = {
      id: 1,
      title: "Modern 3-Bedroom Apartment",
      location: "Lekki Phase 1, Lagos",
      price: 1800000,
      images: [
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
      ],
      description: "A beautiful modern apartment with stunning views of the city. Fully furnished with quality amenities including high-speed WiFi, dedicated parking space, 24/7 security, and backup generator. Perfect for professionals and small families.",
      bedrooms: 3,
      bathrooms: 2,
      area: 120,
      yearBuilt: 2020,
      propertyType: "apartment",
      amenities: ["WiFi", "Parking", "Security", "Generator", "Furnished", "Air Conditioning"],
      landlord: {
        id: 101,
        name: "Adebola Johnson",
        verified: true,
        rating: 4.5,
        reviews: 23,
        responseRate: "95%",
        responseTime: "within 2 hours"
      },
      status: "available",
      views: 128,
      inquiries: 15,
      createdAt: "2023-10-15",
      verified: true
    };

    setProperty(mockProperty);
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Property not found</h2>
          <p className="text-gray-600">The property you're looking for doesn't exist.</p>
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