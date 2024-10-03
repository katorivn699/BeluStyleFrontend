import { Link } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import logo from "../../assets/images/logo.png";
import GuessMenu from "../menus/GuessMenu";
import { IoCartOutline, IoSearchOutline } from "react-icons/io5";
import { CiUser } from "react-icons/ci";
import { useAuth } from "../../store/AuthContext";
import LoggedMenu from "../menus/LoggedMenu";

export function Navbar() {
  const { isLoggedIn, avatarUrl } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState({ guess: false, logged: false });
  const dropdownRef = useRef(null);

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

  // Sử dụng hook useEffect để đóng menu khi click ra ngoài
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-white p-1">
      <div className="navitem grid grid-cols-3 items-center">
        <div className="nar-left flex items-center justify-start pl-10">
          <img src={logo} alt="" className="logo w-20" />
          <h2 className="name font-montserrat font-bold text-3xl">BeluStyle</h2>
        </div>
        <div className="nar-center justify-center flex">
          <ul className="flex space-x-20 items-center">
            <li>
              <Link
                to="/"
                className="text-black hover:text-gray-400 font-poppins transition duration-300"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/shop"
                className="text-black hover:text-gray-400 font-poppins transition duration-300"
              >
                Shop
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="text-black hover:text-gray-400 font-poppins transition duration-300"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="text-black hover:text-gray-400 font-poppins transition duration-300"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>
        <div className="navinfo items-center justify-end flex space-x-10 pr-10">
          {isLoggedIn ? (
            <div className="relative" ref={dropdownRef}>
              {/* Avatar icon để mở menu */}
              <div
                className="cursor-pointer hover:text-gray-700 transition duration-300"
                onClick={() => toggleMenu("logged")}
              >
                <img
                  src={avatarUrl}
                  className="rounded-full w-12 h-12 object-cover"
                  alt="User avatar"
                />
              </div>
              {/* LoggedMenu khi đăng nhập */}
              <LoggedMenu isMenuOpen={isMenuOpen.logged} />
            </div>
          ) : (
            <div className="relative" ref={dropdownRef}>
              {/* Icon user để mở menu Guest */}
              <div
                className="cursor-pointer hover:text-gray-700 transition duration-300 pb-2"
                onClick={() => toggleMenu("guess")}
              >
                <CiUser className="text-4xl" />
              </div>
              {/* GuessMenu khi chưa đăng nhập */}
              <GuessMenu isMenuOpen={isMenuOpen.guess} />
            </div>
          )}
          <div className="searchBtn hover:text-gray-700 transition duration-300">
            <button>
              <IoSearchOutline className="text-3xl" />
            </button>
          </div>
          <div className="cartBtn hover:text-gray-700 transition duration-300">
            <button>
              <IoCartOutline className="text-3xl" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
