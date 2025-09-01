import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-700 p-6 text-center mt-10">
      <p>&copy; {new Date().getFullYear()} RealEstateX. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
