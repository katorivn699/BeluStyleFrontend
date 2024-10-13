import { NavLink } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import logo from "../../assets/images/logo.svg";
import { IoCartOutline, IoSearchOutline } from "react-icons/io5";
import { CiUser } from "react-icons/ci";
import LoggedMenu from "../menus/LoggedMenu";
import GuessMenu from "../menus/GuessMenu";
import { BtnTheme } from "../buttons/Button";
import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import userDefault from "../../assets/images/userdefault.svg";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState({ guess: false, logged: false });
  const dropdownRef = useRef(null);
  const isAuth = useIsAuthenticated();
  const authUser = useAuthUser();

  const toggleMenu = (menuType) => {
    setIsMenuOpen((prevState) => ({
      guess: menuType === "guess" ? !prevState.guess : false,
      logged: menuType === "logged" ? !prevState.logged : false,
    }));
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsMenuOpen({ guess: false, logged: false }); // Close all menus
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 p-2 md:p-4 z-50 bg-base-100">
      <div className="navitem grid grid-cols-1 md:grid-cols-3 items-center">
        <div className="nav-left flex items-center justify-start pl-4 md:pl-10">
          <img src={logo} alt="" className="logo w-12 md:w-16" />
          <h2 className="name font-montserrat font-bold text-2xl md:text-3xl pl-2">BeluStyle</h2>
        </div>
        <div className="nav-center justify-center hidden md:flex">
          <ul className="flex space-x-6 md:space-x-20 items-center">
            <li>
              <NavLink
                to="/"
                className="font-poppins text-sm md:text-base hover:text-base-300 transition duration-300"
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/shop"
                className="font-poppins text-sm md:text-base hover:text-base-300 transition duration-300"
              >
                Shop
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/about"
                className="font-poppins text-sm md:text-base hover:text-base-300 transition duration-300"
              >
                About
              </NavLink>
            </li>
            <li>
              <NavLink
                to="https://www.facebook.com/profile.php?id=100014062039112"
                className="font-poppins text-sm md:text-base hover:text-base-300 transition duration-300"
              >
                Contact
              </NavLink>
            </li>
          </ul>
        </div>
        <div className="nav-right items-center justify-end flex space-x-4 md:space-x-10 pr-4 md:pr-10">
          {isAuth ? (
            <div className="dropdown dropdown-bottom" ref={dropdownRef}>
              <div
                tabIndex={0}
                role="button"
                className="cursor-pointer hover:text-base-300 transition duration-300 pb-1"
                onClick={() => toggleMenu("logged")}
              >
                <img
                  src={authUser.userImage ? authUser.userImage : userDefault}
                  className="rounded-full w-6 md:w-8 h-6 md:h-8 object-cover"
                  alt="Profile"
                />
              </div>
              <LoggedMenu isMenuOpen={isMenuOpen.logged} />
            </div>
          ) : (
            <div className="dropdown dropdown-bottom" ref={dropdownRef}>
              <div
                tabIndex={0}
                role="button"
                className="cursor-pointer hover:text-base-300 transition duration-300 pb-1"
                onClick={() => toggleMenu("guess")}
              >
                <CiUser className="text-2xl md:text-3xl" />
              </div>
              <GuessMenu isMenuOpen={isMenuOpen.guess} />
            </div>
          )}
          <div className="searchBtn hover:text-base-300 transition duration-300">
            <button>
              <IoSearchOutline className="text-2xl md:text-3xl" />
            </button>
          </div>
          <div className="cartBtn hover:text-base-300 transition duration-300">
            <button>
              <IoCartOutline className="text-2xl md:text-3xl" />
            </button>
          </div>
          <div className="themeBtn hover:text-base-300 transition duration-300">
            <BtnTheme />
          </div>
        </div>
      </div>
    </nav>
  );
}
