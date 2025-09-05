import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import ViewPropertyDetails from "./pages/ViewPropertyDetails";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import VerificationStatus from "./pages/VerificationStatus";
import Favorites from "./pages/Favorites";
import Messages from "./pages/Messages";
import LandlordProfile from "./pages/LandlordProfile";
import TenantProfile from "./pages/TenantProfile";
import Dashboard from "./pages/Dashboard";
import ProfileSettings from "./pages/ProfileSettings";
import AddProperty from "./pages/AddProperty";
import EditProperty from "./pages/EditProperty";
import PaymentPage from "./pages/PaymentPage";
import Transactions from "./pages/Transactions";


// Authentication check functions
const isAuthenticated = () => {
  // Check if user is logged in (from localStorage, context, or state)
  return localStorage.getItem('user') !== null;
};

const getUserRole = () => {
  // Get user role from stored user data
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return user.role || null;
};

// Protected Route component
const ProtectedRoute = ({ children, requiredRole = null }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  
  if (requiredRole && getUserRole() !== requiredRole) {
    // If a specific role is required but user doesn't have it
    return <Navigate to="/" replace />;
  }
  
  return children;
};

// Home route that redirects to dashboard if already logged in
const HomeRoute = () => {
  return isAuthenticated() ? <Navigate to="/dashboard" replace /> : <Home />;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<HomeRoute />} />
    <Route path="/property/:id" element={<ViewPropertyDetails />} />
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
    <Route 
      path="/verification" 
      element={
        <ProtectedRoute>
          <VerificationStatus />
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/favorites" 
      element={
        <ProtectedRoute>
          <Favorites />
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/messages" 
      element={
        <ProtectedRoute>
          <Messages />
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/dashboard" 
      element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } 
    />
    <Route path="/landlord/:id" element={<LandlordProfile />} />
    <Route path="/tenant/:id" element={<TenantProfile />} />

    <Route 
      path="/profile/settings" 
      element={
        <ProtectedRoute>
          <ProfileSettings />
        </ProtectedRoute>
      } 
    />
    
    <Route 
      path="/add-property" 
      element={
        <ProtectedRoute requiredRole="landlord">
          <AddProperty />
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/edit-property/:id" 
      element={
        <ProtectedRoute requiredRole="landlord">
          <EditProperty />
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/payment/:id" 
      element={
        <ProtectedRoute requiredRole="tenant">
          <PaymentPage />
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/transactions" 
      element={
        <ProtectedRoute>
          <Transactions />
        </ProtectedRoute>
      } 
    />
  </Routes>
);

export default AppRoutes;