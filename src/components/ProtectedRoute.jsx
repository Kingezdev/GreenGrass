// components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

const isAuthenticated = () => {
  return localStorage.getItem('user') !== null;
};

const getUserRole = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return user.role || null;
};

const ProtectedRoute = ({ children, requiredRole = null }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  
  if (requiredRole && getUserRole() !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

export default ProtectedRoute;