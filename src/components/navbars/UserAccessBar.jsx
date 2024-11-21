import { useNavigate } from "react-router-dom";
import React from "react";
import { IoArrowBack } from "react-icons/io5";

export function NavLogin() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
    localStorage.removeItem("orderId");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-base-100 p-1 z-50 border-b-2 border-gray-200 bg-white">
      <div className="navitem grid grid-cols-3 gap-4 content-center">
        <div className="nar-left flex items-center pl-10 pt-1">
          <button onClick={handleGoBack} ><IoArrowBack className="text-3xl" /></button>
        </div>
        <div className="navinfo items-center justify-center flex space-x-4">
          <img src="https://i.ibb.co/CsqzWQw/belustyle-icon.png" alt="" className="logo flex w-auto h-16" />
        </div>
      </div>
    </nav>
  );
}
