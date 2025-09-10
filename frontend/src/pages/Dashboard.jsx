// src/pages/Dashboard.jsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { LucideSearch } from "lucide-react";
import { getProfileByUsername } from "../api/accounts";
import { useHandle404Redirect } from "../utils/handleErrors";

const Dashboard = () => {
  const { user, logout, accessToken } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const handle404 = useHandle404Redirect();

  if (!user) {
    navigate("/login");
    return null;
  }

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery) return;

    try {
      // Check if user exists
      await getProfileByUsername(searchQuery, accessToken);
      // Navigate to profile if exists
      navigate(`/profile/${searchQuery}`);
    } catch (err) {
      handle404(err);
    } finally {
      setSearchQuery("");
    }
  };


  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Welcome, {user?.first_name || user?.email}
      </h1>

      <div className="flex gap-4 mb-6 flex-wrap">
        <button
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
          onClick={logout}
        >
          Logout
        </button>

        <Link
          to="/profile"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Go to Profile
        </Link>

        <Link
          to="/search"
          className="flex items-center px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800 transition"
        >
          <LucideSearch className="w-5 h-5 mr-2" />
          Search Users
        </Link>

        <Link to="/landlords" className="flex items-center px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800 transition">
          View Landlords
        </Link>
        <Link 
          to="/properties" 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          properties
        </Link>
      </div>

      <form onSubmit={handleSearch} className="flex max-w-md mb-4">
        <input
          type="text"
          placeholder="Search by username..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 p-2 border border-gray-300 rounded-l-md focus:outline-none"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-gray-700 text-white rounded-r-md hover:bg-gray-800 flex items-center"
        >
          <LucideSearch className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};

export default Dashboard;
