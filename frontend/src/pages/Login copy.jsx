// pages/Login.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import loginbg from '../assets/loginbg.jpg';
import { loginUser } from "../api/auth"; // import API function

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("tenant");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Call real API
      const data = await loginUser(email, password);

      // Build user object
      const user = {
        ...data.data,
        role,
      };

      // Save JWT token for authenticated requests
      localStorage.setItem("token", data.data.token);

      // Update auth context
      login(user);

      // Redirect to dashboard
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (userType) => {
    setIsLoading(true);
    setError("");

    try {
      const demoEmail = userType === "tenant" ? "tenant@example.com" : "landlord@example.com";
      const demoPassword = "password123";

      const data = await loginUser(demoEmail, demoPassword);

      const user = {
        ...data.data,
        role: userType,
      };

      localStorage.setItem("token", data.data.token);
      login(user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Demo login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center bg-white relative">
      <div className="absolute inset-0 bg-cover bg-center bg-[url('/loginbg.jpg')] lg:bg-none">
        <div className="absolute inset-0 bg-black/90 lg:hidden"></div>
      </div>
      <div className="w-1/2 h-screen hidden lg:block relative">
        <img src={loginbg} className="h-full w-full object-cover" alt="login background" />
      </div>
      <div className="w-full lg:w-1/2 h-full flex items-center justify-center relative space-y-8 p-8 my-5 lg:my-0">
        <div>
          <div>
            <h2 className="mt-6 text-center text-3xl font-bold text-white lg:text-gray-800">
              Welcome Back to GreenGrass!
            </h2>
            <p className="mt-3 text-sm text-gray-400">Log-in your account</p>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              {error}
            </div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label>Email</label>
                <input
                  type="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-900/30 placeholder-gray-400 lg:placeholder-gray-500 text-white lg:text-gray-900 rounded-t-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label>Password</label>
                <input
                  type="password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-900/30 placeholder-gray-400 lg:placeholder-gray-500 text-white lg:text-gray-900 rounded-b-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded" />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300 lg:text-gray-900">Remember me</label>
              </div>
              <div className="text-sm">
                <a href="#" className="text-gray-600 hover:text-green-500">Forgot password?</a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Logging in...
                  </span>
                ) : "Log in"}
              </button>
            </div>
            {error && <p className="text-red-500">{error}</p>}
          </form>

          <div>
            <p className="mt-4 text-center text-sm text-gray-400 lg:text-gray-800">
              New to GreenGrass?{" "}
              <Link to="/signup" className="text-green-600 hover:text-green-500">Create account</Link>
            </p>
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="hidden lg:block">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-none lg:bg-white text-gray-500">Demo access</span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <button
                onClick={() => handleDemoLogin("tenant")}
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                Demo as Tenant
              </button>
              <button
                onClick={() => handleDemoLogin("landlord")}
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                Demo as Landlord
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
