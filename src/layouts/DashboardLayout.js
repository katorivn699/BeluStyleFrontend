import React from "react";
import { FaBars, FaSearch, FaTimes } from "react-icons/fa";
import Sidebar from "../components/sidebars/Sidebar";
import Breadcrumb from "../components/breadcrumb/Breadcrumbs";
import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import userDefault from "../assets/images/userdefault.webp";

const DashboardLayout = ({ toggleSidebar, isOpen, children }) => {
  const isAuth = useIsAuthenticated();
  const authUser = useAuthUser();
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

            {/* Search bar */}
            {/* <div className="flex items-center bg-gray-100 p-2 rounded-full shadow-sm w-96 mx-auto ml-4">
              <FaSearch className="text-gray-400 ml-2" />
              <input
                type="text"
                placeholder="Search"
                className="bg-gray-100 focus:outline-none ml-2 w-full"
              />
            </div> */}
          </div>

          {/* User Profile */}
          <div className="flex items-center space-x-2">
            <img
              src={authUser.userImage ? authUser.userImage : userDefault}
              alt="User"
              className="rounded-full w-6 md:w-8 h-6 md:h-8 object-cover"
            />
            <span className="font-medium">{authUser.userFullName}</span>
          </div>
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
