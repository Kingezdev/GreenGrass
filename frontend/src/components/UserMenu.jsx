// pages/UserMenu.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Assuming you have auth context
import { getProfileByUsername } from "../api/accounts";

const UserMenu = () => {
  const { username } = useParams(); // username from URL
  const { accessToken } = useAuth(); // token from auth context
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfileByUsername(username, accessToken);
        setProfile(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username, accessToken]);

  if (loading) return <p>Loading user info...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!profile) return <p>No profile found</p>;

  return (
    <div className="bg-white p-4 rounded-lg shadow-md w-64">
      <h2 className="text-lg font-bold">{profile.full_name || profile.username}</h2>
      <p className="text-sm text-gray-500">{profile.email}</p>
      {/* Add more user info as needed */}
      <div className="mt-4">
        <button className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition">
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default UserMenu;
