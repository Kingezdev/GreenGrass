// src/components/PrivateLayout.jsx
import React, { useState, useRef, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

const PrivateLayout = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef(null);

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    else document.removeEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar ref={sidebarRef} isOpen={isOpen} setIsOpen={setIsOpen} />

      <div className="flex-1 min-h-screen md:ml-23 lg:ml-58">
        {/* Header */}
        <Header isOpen={isOpen} setIsOpen={setIsOpen} />

        {/* Main content */}
        <main className="px-4 pb-4 md:pl-1.5 space-y-3 bg-white">{children}</main>
      </div>
    </div>
  );
};

export default PrivateLayout;
