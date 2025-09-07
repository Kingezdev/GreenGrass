import React from "react";
import { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from "./routes";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
  const [user, setUser] = useState(null);

  // Check if user is logged in on app load
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar user={user} setUser={setUser} />
        <div className="flex-1">
          <AppRoutes />
        </div>
        {/*<Footer />*/}
      </div>
    </AuthProvider>
  );
}

export default App;