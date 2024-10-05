import { useNavigate } from "react-router-dom";
import React from "react";
import logo from "../../assets/images/logo.png";
import { IoArrowBack } from "react-icons/io5";

export function NavLogin() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white p-1 z-50 border-b-2 border-gray-400">
      <div className="navitem grid grid-cols-3 gap-4 content-center">
        <div className="nar-left flex items-center pl-10 pt-1">
          <button onClick={handleGoBack} ><IoArrowBack className="text-3xl" /></button>
        </div>
        <div className="navinfo items-center justify-center flex space-x-4">
          <img src={logo} alt="" className="logo flex w-auto h-20" />
        </div>
      </div>
    </nav>
  );
}
