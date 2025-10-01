// src/context/PropertyContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { getAllProperties } from "../api/property";

const PropertyContext = createContext();

export const PropertyProvider = ({ children }) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (properties.length === 0) {
      setLoading(true);
      getAllProperties()
        .then(setProperties)
        .finally(() => setLoading(false));
    }
  }, [properties]);

  return (
    <PropertyContext.Provider value={{ properties, loading }}>
      {children}
    </PropertyContext.Provider>
  );
};

export const useProperties = () => useContext(PropertyContext);
