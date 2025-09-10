import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getMyProfile } from "../api/accounts";
import { useHandle404Redirect } from "../utils/handleErrors";
import HandleLoading from "../utils/HandleLoading";

const ProfilePage = () => {
  const { accessToken, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const handle404 = useHandle404Redirect();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getMyProfile(accessToken);
        setProfile(data);
      } catch (err) {
        handle404(err);
      } finally {
        setLoading(false);
      }
    };

    if (accessToken) fetchProfile();
  }, [accessToken, handle404]);

  return (
    <HandleLoading loading={loading}>
      <div className="p-4 border rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-2">My Profile</h2>

        {profile ? (
          <>
            <p>Email: {profile.email}</p>
            <p>
              Name: {profile.first_name} {profile.last_name}
            </p>
            <p>Phone: {profile.phone_number}</p>
            <p>Bio: {profile.bio}</p>
          </>
        ) : (
          <p>No profile found.</p>
        )}

        <button
          className="px-4 py-2 bg-green-500 text-white rounded mb-6"
          onClick={logout}
        >
          Logout
        </button>
      </div>
    </HandleLoading>
  );
};

export default ProfilePage;
