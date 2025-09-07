import React from "react";
import loginImage from "../assets/loginbg.jpg"; // adjust path

export default function Login() {
  return (
    <div className="h-screen w-full flex">
      {/* Left side with image */}
      <div
        className="w-1/2 h-full bg-cover bg-center"
        style={{ backgroundImage: `url(${loginImage})` }}
      ></div>

      {/* Right side with login form */}
      <div className="w-1/2 h-full bg-blue-600 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-80">
          <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
          <form className="space-y-4">
            <div>
              <label className="block text-gray-700 text-sm mb-1">Email</label>
              <input
                type="email"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm mb-1">Password</label>
              <input
                type="password"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter your password"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
