// components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import UserMenu from './UserMenu';

const Navbar = ({ user, setUser }) => {
  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <nav className="bg-white shadow-md border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left side - Logo and Navigation */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 font-bold text-xl text-green-600">
              NaijaRent
            </Link>
            <div className="hidden md:ml-8 md:flex md:space-x-6">
              <Link 
                to="/" 
                className="text-gray-700 hover:text-green-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                Browse Properties
              </Link>
              {user && (
                <Link 
                  to="/dashboard" 
                  className="text-gray-700 hover:text-green-600 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Dashboard
                </Link>
              )}
            </div>
          </div>
          
          {/* Right side - User actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* Messages Icon */}
                <Link 
                  to="/messages" 
                  className="p-2 text-gray-500 hover:text-green-600 rounded-lg hover:bg-gray-100 transition-colors"
                  title="Messages"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </Link>

                {/* Favorites Icon */}
                <Link 
                  to="/favorites" 
                  className="p-2 text-gray-500 hover:text-green-600 rounded-lg hover:bg-gray-100 transition-colors"
                  title="Favorites"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </Link>

                {/* User Menu */}
                <UserMenu user={user} onLogout={handleLogout} />
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link 
                  to="/login" 
                  className="text-gray-700 hover:text-green-600 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Sign in
                </Link>
                <Link 
                  to="/signup" 
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        <div className="md:hidden flex justify-center py-2 border-t">
          <div className="flex space-x-4">
            <Link to="/" className="text-gray-700 hover:text-green-600 text-sm">
              Browse Properties
            </Link>
            {user && (
              <Link to="/dashboard" className="text-gray-700 hover:text-green-600 text-sm">
                Dashboard
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;