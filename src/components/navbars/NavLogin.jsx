import { Link, useNavigate } from "react-router-dom";
import React from "react";
import logo from "../../assets/images/logo.png";
import { IoArrowBack } from "react-icons/io5";

export function NavLogin() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b-2 border-gray-400">
      <div className="navitem grid grid-cols-3 gap-4 content-center">
        <div className="nar-left flex items-center pl-10 pt-1">
          <Link to="/">
          <button ><IoArrowBack className="text-5xl" /></button>
          </Link>
        </div>
        <div className="navinfo items-center justify-center flex space-x-4">
          <img src={logo} alt="" className="logo flex w-20" />
        </div>
      </div>
    </nav>
  );
}
