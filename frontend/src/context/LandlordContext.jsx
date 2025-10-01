// src/context/LandlordContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { getLandlords } from "../api/accounts";
import { useAuth } from "./AuthContext"; // to get accessToken
import { useHandle404Redirect } from "../utils/handleErrors"; // optional, for 404 handling

const LandlordContext = createContext();

export const LandlordProvider = ({ children }) => {
  const { accessToken } = useAuth();
  const handle404 = useHandle404Redirect();

  const [landlords, setLandlords] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLandlords = async () => {
      setLoading(true);
      try {
        const data = await getLandlords(accessToken);
        setLandlords(data);
      } catch (err) {
        handle404(err);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if we have an access token and no landlords yet
    if (accessToken && landlords.length === 0) {
      fetchLandlords();
    }
  }, [accessToken]);

  return (
    <LandlordContext.Provider value={{ landlords, loading }}>
      {children}
    </LandlordContext.Provider>
  );
};

export const useLandlords = () => useContext(LandlordContext);
