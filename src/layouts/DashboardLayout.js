import React, { useState } from "react";
import { FaBars, FaCog, FaSignOutAlt, FaTimes } from "react-icons/fa";
import Sidebar from "../components/sidebars/Sidebar";
import Breadcrumb from "../components/breadcrumb/Breadcrumbs";
import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import userDefault from "../assets/images/userdefault.webp";
import { Link } from "react-router-dom";

const DashboardLayout = ({ toggleSidebar, isOpen, children }) => {
  const isAuth = useIsAuthenticated();
  const authUser = useAuthUser();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex justify-between items-center p-6 bg-white shadow">
          <div className="flex items-center px-10">
            {/* Hamburger menu */}
            <button onClick={toggleSidebar} className="text-gray-700">
              {isOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>

          {/* User Profile */}
          <div className="relative flex items-center space-x-2">
            <span
              className={`font-medium px-2 py-1 rounded ${
                authUser.role === "STAFF"
                  ? "text-yellow-700 bg-yellow-100"
                  : authUser.role === "ADMIN"
                  ? "text-red-700 bg-red-100"
                  : "text-gray-700 bg-gray-100"
              }`}
            >
              {authUser.role}
            </span>
            <div
              className="flex items-center space-x-2 object-cover cursor-pointer transition duration-200 ease-in-out transform hover:scale-105 hover:shadow-md"
              onClick={toggleDropdown}
            >
              <img
                src={authUser.userImage ? authUser.userImage : userDefault}
                alt="User"
                className="rounded-full w-8 h-8 "
              />

              <span className="font-medium">{authUser.userFullName}</span>
            </div>
          </div>
          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 top-12 mt-2 w-48 bg-white border rounded-md shadow-lg z-10">
              {/* Settings Button */}
              <button className="px-4 py-2 w-full cursor-pointer hover:bg-gray-100 flex items-center gap-1">
                <FaCog /> Settings
              </button>

              {/* Log Out Button */}
              <Link to="/Dashboard/Logout" className="w-full">
                <button className="px-4 py-2 w-full cursor-pointer hover:bg-gray-100 flex items-center gap-1 text-gray-700 hover:text-white hover:bg-gray-500">
                  <FaSignOutAlt /> Log Out
                </button>
              </Link>
            </div>
          )}
        </header>

        {/* Breadcrumb */}
        <div className="p-4">
          <Breadcrumb />
        </div>

        {/* Main content */}
        <main className="flex-1 p-6 overflow-auto m-5">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
