// src/pages/UserProfile.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getProfileByUsername } from "../api/accounts";
import { useHandle404Redirect } from "../utils/handleErrors";
import HandleLoading from "../utils/HandleLoading";

const UserProfile = () => {
  const { username } = useParams();
  const { accessToken } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const handle404 = useHandle404Redirect();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await getProfileByUsername(username, accessToken);
        setProfile(data);
      } catch (err) {
        handle404(err);
      } finally {
        setLoading(false);
      }
    };

    if (accessToken) fetchProfile();
  }, [username, accessToken, handle404]);

  return (
    <HandleLoading loading={loading}>
      {profile && (
        <div className="max-w-2xl mx-auto p-4 bg-white shadow-md rounded-md">
          <h1 className="text-2xl font-bold mb-4">
            {profile.full_name || profile.username}
          </h1>
          <p>
            <strong>Username:</strong> {profile.username}
          </p>
          <p>
            <strong>Email:</strong> {profile.email}
          </p>
          {profile.phone && (
            <p>
              <strong>Phone:</strong> {profile.phone}
            </p>
          )}
          {profile.bio && (
            <p>
              <strong>Bio:</strong> {profile.bio}
            </p>
          )}
        </div>
      )}
    </HandleLoading>
  );
};

export default UserProfile;
