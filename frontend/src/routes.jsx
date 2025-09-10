// src/AppRoutes.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProfilePage from "./pages/ProfilePage";
import UserProfile from "./pages/UserProfile";
import Search from "./pages/Search";
import PageNotFound from "./pages/PageNotFound";
import Landlords from "./pages/Landlords";
import PropertiesPage from "./pages/PropertiesPage"
import PropertyDetails from "./pages/PropertyDetails";
import CreateProperty from "./pages/CreateProperty";
import Rooms from "./pages/Rooms";
import AddRoom from "./pages/AddRoom";
import { useAuth } from "./context/AuthContext";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};


const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <ProfilePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/profile/:username"
        element={
          <PrivateRoute>
            <UserProfile />
          </PrivateRoute>
        }
      />
      <Route
        path="/search"
        element={
          <PrivateRoute>
            <Search />
          </PrivateRoute>
        }
      />
      <Route
        path="/landlords"
        element={
          <PrivateRoute>
            <Landlords />
          </PrivateRoute>
        }
      />
      <Route path="/properties" element={<PropertiesPage />} />
      <Route
        path="/properties/:property_id"
        element={<PropertyDetails />}
      />
      <Route
        path="/properties/create"
        element={
          <PrivateRoute>
            <CreateProperty />
          </PrivateRoute>
        }
      />

      <Route path="/rooms" element={<Rooms />} />
      <Route
        path="/rooms/:property_id"
        element={
          <PrivateRoute>
            <AddRoom />
          </PrivateRoute>
        }
      />
        
      <Route path="/page-not-found" element={<PageNotFound />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

export default AppRoutes;
