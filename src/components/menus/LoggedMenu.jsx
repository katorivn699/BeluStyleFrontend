import React from "react";
import { FaRegUserCircle } from "react-icons/fa";
import { GoBell } from "react-icons/go";
import { IoLogOutOutline } from "react-icons/io5";
import { LuMousePointerClick } from "react-icons/lu";
import { TbRosetteDiscount } from "react-icons/tb";
import { Link } from "react-router-dom";

const LoggedMenu = ({ isMenuOpen }) => {
  return (
    <div
      className={`absolute right-0 mt-2 w-56 bg-white shadow-lg rounded-lg z-50 transition-opacity duration-300 ease-in-out ${
        isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
    >
      <ul>
        <li>
          <Link
            to="/user/infomation"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 items-center transition-transform duration-200 ease-in-out"
          >
            <div className="logintag flex items-center space-x-4">
              <FaRegUserCircle className="text-2xl" />
              <p>Account Settings</p>
            </div>
          </Link>
        </li>
        <li>
          <Link
            to="/history"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-transform duration-200 ease-in-out"
          >
            <div className="registertag flex items-center space-x-4">
              <LuMousePointerClick className="text-2xl" />
              <p>Purchase History</p>
            </div>
          </Link>
        </li>
        <li>
          <Link
            to="/notifications"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-transform duration-200 ease-in-out"
          >
            <div className="forgottag flex items-center space-x-4">
              <GoBell className="text-2xl" />
              <p>Notifications</p>
            </div>
          </Link>
        </li>
        <li>
          <Link
            to="/discounts"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-transform duration-200 ease-in-out"
          >
            <div className="forgottag flex items-center space-x-4">
              <TbRosetteDiscount className="text-2xl" />
              <p>Discounts</p>
            </div>
          </Link>
        </li>
        <li>
          <Link
            to="/logout"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-transform duration-200 ease-in-out"
          >
            <div className="forgottag flex items-center space-x-4">
              <IoLogOutOutline className="text-2xl" />
              <p>Sign out</p>
            </div>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default LoggedMenu;
