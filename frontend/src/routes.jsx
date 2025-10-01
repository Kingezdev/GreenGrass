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
import PropertyDetailPage from "./pages/PropertyDetailPage";
import CreateProperty from "./pages/CreateProperty";
import RoomsPage from "./pages/RoomsPage";
import AddRoom from "./pages/AddRoom";
import ErrorBoundary from "./components/ErrorBoundary";
import Messages from "./pages/Messages";
import { useAuth } from "./context/AuthContext";
import PrivateLayout from "./components/PrivateLayout";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};


const AppRoutes = () => {

  return (
    <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <PrivateLayout>
                    <Dashboard />
                  </PrivateLayout>
                </PrivateRoute>
              }
            />
            
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <PrivateLayout>
                    <ProfilePage />
                  </PrivateLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/profile/:username"
              element={
                <PrivateRoute>
                  <PrivateLayout>
                    <UserProfile />
                  </PrivateLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/search"
              element={
                <PrivateRoute>
                  <PrivateLayout>
                    <Search />
                  </PrivateLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/landlords"
              element={
                <PrivateRoute>
                  <PrivateLayout>
                    <Landlords />
                  </PrivateLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/properties"
              element={
                <PrivateLayout>
                  <PropertiesPage />
                </PrivateLayout>
              }
            />
            
            <Route
              path="/properties/:id"
              element={
                <PrivateLayout>
                  <PropertyDetailPage />
                </PrivateLayout>
              }
            />
            <Route
              path="/properties/create"
              element={
                <PrivateRoute>
                  <PrivateLayout>
                    <CreateProperty />
                  </PrivateLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/rooms/:propertyid"
              element={
                <PrivateLayout>
                  <RoomsPage />
                </PrivateLayout>
              }
            />
            <Route
              path="/rooms/:property_id/add-room"
              element={
                <PrivateRoute>
                  <PrivateLayout>
                    <AddRoom />
                  </PrivateLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/messages"
              element={
                <PrivateRoute>
                  <PrivateLayout>
                    <Messages />
                  </PrivateLayout>
                </PrivateRoute>
              }
            />
            <Route path="/page-not-found" element={<PageNotFound />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
    </ErrorBoundary>
  );
};

export default AppRoutes;
