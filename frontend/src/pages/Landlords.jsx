// pages/Landlords.jsx
//this is page is a list of landlords
import React, { useEffect, useState } from "react";
import { getLandlords } from "../api/accounts";
import { useAuth } from "../context/AuthContext";
import { useHandle404Redirect } from "../utils/handleErrors";
import HandleLoading from "../utils/HandleLoading";

const Landlords = () => {
  const { accessToken } = useAuth();
  const [landlords, setLandlords] = useState([]);
  const [loading, setLoading] = useState(true);
  const handle404 = useHandle404Redirect();

  useEffect(() => {
    const fetchLandlords = async () => {
      try {
        const data = await getLandlords(accessToken);
        setLandlords(data);
      } catch (err) {
        handle404(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLandlords();
  }, [accessToken, handle404]);

   return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">All Landlords</h1>

      <HandleLoading loading={loading}>
        {landlords.length === 0 ? (
          <p className="text-gray-500">No landlords found.</p>
        ) : (
          <ul className="space-y-3">
            {landlords.map((landlord) => (
              <li
                key={landlord.id}
                className="p-4 border rounded-lg shadow-sm bg-white"
              >
                <h2 className="text-lg font-semibold">{landlord.username}</h2>
                <p className="text-gray-600">{landlord.email}</p>
              </li>
            ))}
          </ul>
        )}
      </HandleLoading>
    </div>
  );
};

export default Landlords;
