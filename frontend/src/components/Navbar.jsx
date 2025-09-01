import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold text-green-600">
        RealEstateX
      </Link>
      <div className="flex gap-4">
        <Link to="/favorites" className="hover:text-green-600">Favorites</Link>
        <Link to="/messages" className="hover:text-green-600">Messages</Link>
        <Link to="/login" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Login</Link>
        <Link to="/signup" className="border border-green-600 px-4 py-2 rounded hover:bg-green-50">Signup</Link>
      </div>
    </nav>
  );
};

export default Navbar;
