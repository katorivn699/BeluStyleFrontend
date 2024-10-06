import { Link } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import logo from "../../assets/images/logo.png";
import { IoCartOutline, IoSearchOutline } from "react-icons/io5";
import { CiUser } from "react-icons/ci";
import { useAuth } from "../../store/AuthContext";
import LoggedMenu from "../menus/LoggedMenu";
import { FaRegUser } from "react-icons/fa";
import { FiUsers } from "react-icons/fi";
import { AiOutlineLock } from "react-icons/ai";

export function Navbar() {
  const { isLoggedIn, avatarUrl } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState({ guess: false, logged: false });
  const dropdownRef = useRef(null);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  const handleToggle = (e) => {
    const newTheme = e.target.checked ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  const toggleMenu = (menuType) => {
    setIsMenuOpen((prevState) => ({
      guess: menuType === "guess" ? !prevState.guess : false,
      logged: menuType === "logged" ? !prevState.logged : false,
    }));
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsMenuOpen({ guess: false, logged: false }); // Đóng tất cả menu
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 p-1 z-50 bg-base-100">
      <div className="navitem grid grid-cols-3 items-center">
        <div className="nar-left flex items-center justify-start pl-10">
          <img src={logo} alt="" className="logo w-20" />
          <h2 className="name font-montserrat font-bold text-3xl">BeluStyle</h2>
        </div>
        <div className="nar-center justify-center flex">
          <ul className="flex space-x-20 items-center">
            <li>
              <Link to="/" className="font-poppins hover:text-base-300 transition duration-300">
                Home
              </Link>
            </li>
            <li>
              <Link to="/shop" className="font-poppins hover:text-base-300 transition duration-300">
                Shop
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="font-poppins hover:text-base-300 transition duration-300"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="font-poppins hover:text-base-300 transition duration-300"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>
        <div className="navinfo items-center justify-end flex space-x-10 pr-10">
          {isLoggedIn ? (
            <div className="relative" ref={dropdownRef}>
              <div
                className="cursor-pointer hover:text-base-300 transition duration-300"
                onClick={() => toggleMenu("logged")}
              >
                <img
                  src={avatarUrl}
                  className="rounded-full w-8 h-8 object-cover"
                  alt="User avatar"
                />
              </div>
              <LoggedMenu isMenuOpen={isMenuOpen.logged} />
            </div>
          ) : (
            <div className="dropdown dropdown-bottom" ref={dropdownRef}>
              <div
                tabIndex={0}
                role="button"
                className="cursor-pointer hover:text-base-300 transition duration-300 pb-2"
                onClick={() => toggleMenu("guess")}
              >
                <CiUser className="text-4xl" />
              </div>
              {isMenuOpen.guess && (
                <ul
                  tabIndex={0}
                  className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
                >
                  <li>
                    <Link to="/login" className="dropdown-item">
                    <FaRegUser className="text-2xl" /> <p className="text-base">Login</p>
                    </Link>
                  </li>
                  <li>
                    <Link to="/register" className="dropdown-item">
                    <FiUsers className="text-2xl" /><p className="text-base">Register</p>
                    </Link>
                  </li>
                  <li>
                    <Link to="/register" className="dropdown-item">
                    <AiOutlineLock className="text-2xl" /><p className="text-base">Forgot Password</p>
                    </Link>
                  </li>
                </ul>
              )}
            </div>
          )}
          <div className="searchBtn hover:text-base-300 transition duration-300">
            <button>
              <IoSearchOutline className="text-3xl" />
            </button>
          </div>
          <div className="cartBtn hover:text-base-300 transition duration-300">
            <button>
              <IoCartOutline className="text-3xl" />
            </button>
          </div>
          <div className="themeBtn hover:text-base-300 transition duration-300">
            <button>
              <label className="swap swap-rotate">
                <input
                  type="checkbox"
                  className="theme-controller"
                  checked={theme === "dark"}
                  onChange={handleToggle}
                />
                <svg
                  className="swap-off h-8 w-8 fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
                </svg>
                <svg
                  className="swap-on h-8 w-8 fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
                </svg>
              </label>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
