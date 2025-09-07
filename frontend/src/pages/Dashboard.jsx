import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import LandlordDashboard from '../components/Dashboard/Landlord/LandlordDashboard';
import TenantDashboard from '../components/Dashboard/TenantDashboard';
import { FaPlusCircle, FaSearch } from "react-icons/fa";
import { IoIosAddCircleOutline } from "react-icons/io"

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate fetching user data
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 ">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-medium text-[#333]">
                Hi, {user.name}!
              </h1>
              <p className="text-gray-600">
                {user.role === 'landlord' 
                  ? 'Manage your properties and track performance' 
                  : 'Find your perfect home and track your search'
                }
              </p>
              
            </div>
            <div className='flex items-center  gap-3'>
              <div>
                {user.role === "landlord" ? (
                  <Link
                    to="/add-property"
                    className="bg-black rounded-full text-white px-5 py-2.5 hover:bg-[#1a1a1a] text-xs flex items-center gap-2"
                  >
                    <IoIosAddCircleOutline className="text-white text-xl" />
                    Add Property
                  </Link>
                  ) : (
                  <Link
                    to="/properties"
                    className="bg-black rounded-full text-white px-5 py-2.5 hover:bg-[#1a1a1a] text-xs flex items-center gap-2"
                  >
                    <FaSearch className="text-white text-xl" />
                    Browse Properties
                  </Link>
                )}
              </div>
              <div className="flex items-center space-x-4">
                {!user.verified && (
                  <button
                    onClick={() => navigate('/verification')}
                    className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg text-sm font-medium hover:bg-yellow-200"
                  >
                    Complete Verification
                  </button>
                )}
                <span className={`px-5 py-2.5 rounded-full text-xs font-medium ${
                  user.verified ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {user.verified ? 'Verified' : 'Unverified'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Role-Based Content */}
        {user.role === 'landlord' && <LandlordDashboard user={user} />}
        {user.role === 'tenant' && <TenantDashboard user={user} />}
      </div>
    </div>
  );
};

export default Dashboard;