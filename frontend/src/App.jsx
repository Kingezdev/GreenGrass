// src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { PropertyProvider } from "./context/PropertyContext";
import { LandlordProvider } from "./context/LandlordContext";
import AppRoutes from "./routes";

const App = () => {
  return (
    <AuthProvider>
      <PropertyProvider>
        <BrowserRouter>
          <LandlordProvider>
            <AppRoutes />
          </LandlordProvider>
        </BrowserRouter>
      </PropertyProvider>
    </AuthProvider>
  );
};

export default App;
