import React, { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { IoCartOutline, IoSearchOutline } from "react-icons/io5";
import { useCart } from "react-use-cart"; // Import useCart
import logo from "../../assets/images/logo.webp";
import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import LoggedMenu from "../menus/LoggedMenu";
import GuessMenu from "../menus/GuessMenu";
import CartDrawer from "../Cart/CartDrawer";
import { Badge, IconButton } from "@mui/material";

export function Navbar() {
  const dropdownRef = useRef(null);
  const isAuth = useIsAuthenticated();

  const [isCartOpen, setIsCartOpen] = useState(false); // State for CartDrawer

  const { totalItems } = useCart();

  const toggleCartDrawer = (open) => () => {
    setIsCartOpen(open); // Open or close the CartDrawer
  };


  return (
    <nav className="fixed top-0 left-0 right-0 p-2 md:p-4 z-50 bg-white">
      <div className="navitem grid grid-cols-1 md:grid-cols-3 items-center">
        <div className="nav-left flex items-center justify-start pl-4 md:pl-10">
          <img src={logo} alt="" className="logo w-12 md:w-16" />
          <h2 className="name font-montserrat font-bold text-2xl md:text-3xl pl-2">BeluStyle</h2>
        </div>

        <div className="nav-center justify-center hidden md:flex">
          <ul className="flex space-x-6 md:space-x-20 items-center">
            <li>
              <NavLink to="/" className="font-poppins text-sm md:text-base hover:text-base-300 transition duration-300">Home</NavLink>
            </li>
            <li>
              <NavLink to="/shop" className="font-poppins text-sm md:text-base hover:text-base-300 transition duration-300">Shop</NavLink>
            </li>
            <li>
              <NavLink to="/about" className="font-poppins text-sm md:text-base hover:text-base-300 transition duration-300">About</NavLink>
            </li>
            <li>
              <NavLink to="https://www.facebook.com/profile.php?id=100014062039112" className="font-poppins text-sm md:text-base hover:text-base-300 transition duration-300">Contact</NavLink>
            </li>
          </ul>
        </div>

        <div className="nav-right items-center justify-end flex space-x-4 md:space-x-10 pr-4 md:pr-10">
          {isAuth ? (
            <div className="dropdown dropdown-bottom" ref={dropdownRef}>
              <LoggedMenu/>
            </div>
          ) : (
            <GuessMenu />
          )}

          <div className="searchBtn hover:text-base-300 transition duration-300">
            <button>
              <IoSearchOutline className="text-2xl md:text-3xl" />
            </button>
          </div>

          {/* Cart Button */}
          <div className="cartBtn hover:text-base-300 transition duration-300">
            <IconButton onClick={toggleCartDrawer(true)}>
              <Badge color="secondary" badgeContent={totalItems}>
              <IoCartOutline className="text-2xl md:text-3xl text-black" />
              </Badge>
            </IconButton>
          </div>
        </div>
      </div>

      {/* Cart Drawer */}
      <CartDrawer isCartOpen={isCartOpen} toggleCartDrawer={toggleCartDrawer} />
    </nav>
  );
}
