// src/pages/Dashboard.jsx
import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className=" ">
      <main className="og-bg og-p">
        <h1 className="text-4xl font-semibold">Dashboard</h1>
      </main>
    </div>
  );
};

export default Dashboard;
