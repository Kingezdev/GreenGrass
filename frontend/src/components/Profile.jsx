import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getProfile } from "../api/accounts";

const Profile = () => {
  const { accessToken } = useAuth();
  const [profile, setProfile] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (accessToken) {
      getProfile(accessToken).then(setProfile);
    }
  }, [accessToken]);

  if (!profile) return <p>Loading profile...</p>;

  return (
    <div className="p-6 max-w-xl mx-auto bg-white shadow rounded-lg">
      <h1 className="text-xl font-bold mb-4">
        {profile.first_name} {profile.last_name}'s Profile
      </h1>
      <p>Email: {profile.email}</p>
      <p>Phone: {profile.phone_number || "Not provided"}</p>
      <p>User type: {profile.user_type}</p>

      <button
        className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        onClick={() => setShowDetails(!showDetails)}
      >
        {showDetails ? "Hide Details" : "Show Details"}
      </button>

      {showDetails && (
        <div className="mt-4 space-y-2">
          <p>Bio: {profile.bio || "Not provided"}</p>
          <p>Date of Birth: {profile.date_of_birth || "Not provided"}</p>
          {profile.user_type === "landlord" && (
            <>
              <p>Property Name: {profile.property_name || "Not provided"}</p>
              <p>Years Experience: {profile.years_experience || 0}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
