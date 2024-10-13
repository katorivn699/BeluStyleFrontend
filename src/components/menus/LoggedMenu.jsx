import React from "react";
import { FaRegUserCircle } from "react-icons/fa";
import { GoBell } from "react-icons/go";
import { IoLogOutOutline } from "react-icons/io5";
import { LuMousePointerClick } from "react-icons/lu";
import { TbRosetteDiscount } from "react-icons/tb";
import { Link } from "react-router-dom";

const LoggedMenu = ({ isMenuOpen }) => {
  return (
    <>
      {isMenuOpen && (
        <ul
          tabIndex={0}
          className="dropdown-content menu bg-base-100 rounded-box z-[1] w-56 p-2 shadow"
        >
          <li>
            <Link to="/user/information" className="dropdown-item">
              <FaRegUserCircle className="text-2xl" />
              <p className="text-base">Account Settings</p>
            </Link>
          </li>
          <li>
            <Link to="/history" className="dropdown-item">
              <LuMousePointerClick className="text-2xl" />
              <p className="text-base">Purchase History</p>
            </Link>
          </li>
          <li>
            <Link to="/notifications" className="dropdown-item">
              <GoBell className="text-2xl" />
              <p className="text-base">Notifications</p>
            </Link>
          </li>
          <li>
            <Link to="/discounts" className="dropdown-item">
              <TbRosetteDiscount className="text-2xl" />
              <p className="text-base">Discounts</p>
            </Link>
          </li>
          <li>
            <Link to="/logout" className="dropdown-item">
              <IoLogOutOutline className="text-2xl" />
              <p className="text-base">Sign out</p>
            </Link>
          </li>
        </ul>
      )}
    </>
  );
};

export default LoggedMenu;
