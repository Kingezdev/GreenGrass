// src/utils/HandleLoading.jsx
import React from "react";

const HandleLoading = ({ loading, children }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center p-6">
        <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-2 text-gray-600">Loading...</span>
      </div>
    );
  }

  return <>{children}</>;
};

export default HandleLoading;
