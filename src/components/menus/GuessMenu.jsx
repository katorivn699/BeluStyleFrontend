import React from "react";
import { AiOutlineLock } from "react-icons/ai";
import { FaRegUser } from "react-icons/fa";
import { FiUsers } from "react-icons/fi";
import { Link } from "react-router-dom";

const GuessMenu = ({ isMenuOpen }) => {
  return (
    <>
      {isMenuOpen && (
        <ul
          tabIndex={0}
          className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
        >
          <li>
            <Link to="/login" className="dropdown-item">
              <FaRegUser className="text-2xl" />
              <p className="text-base">Login</p>
            </Link>
          </li>
          <li>
            <Link to="/register" className="dropdown-item">
              <FiUsers className="text-2xl" />
              <p className="text-base">Register</p>
            </Link>
          </li>
          <li>
            <Link to="/register" className="dropdown-item">
              <AiOutlineLock className="text-2xl" />
              <p className="text-base">Forgot Password</p>
            </Link>
          </li>
        </ul>
      )}
    </>
  );
};

export default GuessMenu;
