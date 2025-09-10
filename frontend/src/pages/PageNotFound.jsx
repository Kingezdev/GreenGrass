// src/pages/PageNotFound.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const PageNotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center p-4">
      <h1 className="text-6xl font-bold mb-4 text-gray-800">404</h1>
      <p className="text-xl mb-6 text-gray-600">Oops! Page not found.</p>
      <button
        className="px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600 transition"
        onClick={() => navigate("/dashboard")}
      >
        Go Back to Dashboard
      </button>
    </div>
  );
};

export default PageNotFound;
