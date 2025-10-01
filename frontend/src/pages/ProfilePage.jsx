import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getMyProfile } from "../api/accounts";
import { useHandle404Redirect } from "../utils/handleErrors";
import HandleLoading from "../utils/HandleLoading";
import { HiMail, HiPhone } from "react-icons/hi";
import BioSection from "../components/Profile/BioSection";
import { useNavigate } from "react-router-dom"; // <-- import useNavigate

const ProfilePage = () => {
  const { accessToken, profile, setProfile } = useAuth();
  const [loading, setLoading] = useState(!profile);
  const handle404 = useHandle404Redirect();
  const navigate = useNavigate(); // <-- initialize navigate

  useEffect(() => {
    // Redirect immediately if not logged in
    if (!accessToken) {
      navigate("/login");
      return;
    }

    if (!profile && accessToken) {
      const fetchProfile = async () => {
        try {
          const data = await getMyProfile(accessToken);
          setProfile(data);
          localStorage.setItem("profile", JSON.stringify(data));
        } catch (err) {
          handle404(err);
        } finally {
          setLoading(false);
        }
      };
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [accessToken, handle404, navigate, profile, setProfile]);

  if (!profile && !loading) {
    return (
      <div className="p-6 text-center text-gray-500">
        No profile found. Please make sure you are logged in.
      </div>
    );
  }

  return (
    <HandleLoading loading={loading}>
      <div className="og-bg og-p h-full flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Profile pic and name */}
          <div className="col-span-1 bg-white p-4 rounded-xl shadow flex flex-col justify-around items-center gap-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-900 font-semibold text-3xl">
                {profile?.first_name || "N/A"} {profile?.last_name || ""}
              </span>
            </div>
            <div className="w-35 h-35 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-xl font-bold border-3 border-gray-300">
              {profile?.first_name?.[0] || "?"}
              {profile?.last_name?.[0] || "?"}
            </div>
          </div>

          {/* Profile details */}
          <div className="space-y-4 md:space-y-0 col-span-1 lg:col-span-2 bg-white p-6 rounded-xl shadow flex flex-col justify-between items-center">
            <div className="flex items-center w-full">
              <h2 className="text-xl font-bold text-gray-800">Profile</h2>
            </div>

            {profile ? (
              <div className="space-y-4 w-full">
                <div className="flex gap-2 py-0.5 items-center">
                  <span className="flex items-center gap-3 text-gray-400 shrink-0">
                    <HiMail className="text-xl" />
                    Email
                  </span>
                  <span className="text-green-600 font-semibold truncate max-w-[200px]">
                    {profile?.email || "N/A"}
                  </span>
                </div>

                <div className="flex gap-2 py-0.5">
                  <span className="flex items-center gap-3 text-gray-400">
                    <HiPhone className="text-xl" />
                    Phone
                  </span>
                  <span className="text-gray-900 font-semibold truncate max-w-[200px]">
                    {profile?.phone_number || "N/A"}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-center text-gray-500 italic">No profile details found.</p>
            )}
          </div>
        </div>

        {/* Bio */}
        <div className="col-span-1 bg-white p-6 rounded-xl shadow flex flex-col justify-between items-center space-y-4">
          <div className="flex items-center w-full">
            <h2 className="text-xl font-bold text-gray-800">Bio</h2>
          </div>
          <div className="w-full">
            <BioSection bio={profile?.bio || "No bio available."} />
          </div>
        </div>
      </div>
    </HandleLoading>
  );
};

export default ProfilePage;
