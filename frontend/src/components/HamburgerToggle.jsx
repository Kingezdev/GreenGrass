import React from "react";
import { FaBars, FaTimes } from "react-icons/fa";

const HamburgerToggle = ({ isOpen, setIsOpen }) => {
  return (
    <button
      className=" p-3.5 bg-white rounded-full shadow md:hidden"
      onClick={() => setIsOpen(!isOpen)}
    >
      {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
    </button>
  );
};

export default HamburgerToggle;
