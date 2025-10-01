import React from "react";
import { useAuth } from "../context/AuthContext";
import { NavLink, useNavigate } from "react-router-dom";
import { FaBars, FaTimes, FaTachometerAlt, FaBuilding, FaComments, FaCog, FaLayerGroup, FaUser } from "react-icons/fa";
import { HiLogout } from "react-icons/hi";
import HamburgerToggle from "./HamburgerToggle";

const links = [
    { name: "Dashboard", path: "/dashboard", icon: <FaTachometerAlt /> },
    { name: "My profile", path: "/profile", icon: <FaUser /> },
    { name: "Properties", path: "/properties", icon: <FaBuilding /> },
    { name: "Landlords", path: "/landlords", icon: <FaLayerGroup /> },
    { name: "Messages", path: "/messages", icon: <FaComments /> },
    { name: "Settings", path: "/settings", icon: <FaCog /> },
];

const Sidebar = React.forwardRef(({ isOpen, setIsOpen }, ref) => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const handleLogout = () => {
        logout(); // perform logout
        navigate("/login"); // redirect to login
    };


    return (
        <>

        {/* Mobile Overlay */}
        {isOpen && (
            <div className="fixed inset-0 bg-black/90 z-31 md:hidden"></div>
        )}

        {/* Sidebar */}
        <div
            ref={ref}
            className={`
                fixed top-0 left-0  h-screen bg-white z-40 transform py-4 pl-4 md:pr-1.5 p-4
                ${isOpen ? "translate-x-0" : "-translate-x-full"}
                transition-transform duration-300 ease-in-out
                md:translate-x-0 
                lg:w-[230px] lg:translate-x-0
            `}
        >
            <div className="og-bg py-4 h-full flex-col">
                <nav className=" flex-col w-full">
                    {links.map((link) => (
                    <NavLink
                        key={link.name}
                        to={link.path}
                        className={
                            `relative flex items-center gap-3 py-2.5  group`
                        }
                        onClick={() => setIsOpen(false)} // close sidebar on mobile after clicking
                        >
                        {({ isActive }) => (
                            <>
                            {/* Indicator bar */}
                            {isActive && (
                                <span className="absolute left-0 top-0 h-full w-1.5  bg-green-700 rounded-r-full"></span>
                            )}
                            
                            {/* Icon */}
                            <span className={`text-xl ml-5.5 group-hover:text-green-700 ${isActive ? "text-green-700" : "text-gray-500"}`}>
                                {link.icon}
                            </span>
                            
                            {/* Text */}
                            <span className={`hidden lg:inline group-hover:text-gray-800 ${isActive ? "text-gray-800 font-semibold" : "text-gray-500"}`}>
                                {link.name}
                            </span>
                            </>
                        )}
                    </NavLink>
                    ))}
                </nav>
                <button
                    className="px-6 w-full transition-allk flex items-center justify-start gap-2.5 py-2.5 text-gray-500 hover:text-gray-800  group cursor-pointer "
                    onClick={handleLogout}
                >
                    <HiLogout className="text-xl group-hover:text-green-700"/>
                    <span className="text-[16px] hidden lg:inline">Logout</span>
                </button>
            </div>
        </div>
        </>
    );
});

export default Sidebar;

