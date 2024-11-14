import React from "react";
import { FaShippingFast } from "react-icons/fa";
import { GoTrophy } from "react-icons/go";
import { IoShieldCheckmarkOutline } from "react-icons/io5";
import { MdOutlineSupportAgent } from "react-icons/md";
import { Link } from "react-router-dom";
import logo from "../../assets/images/logo.webp";
import { Divider } from "@mui/material";

const Footer = () => {
  return (
    <>
      {/* Feature Section */}
      <div className="footer h-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 bg-blueOcean items-center text-xl font-poppins place-items-center py-10 gap-y-8 sm:gap-y-0">
        <div className="HighQuantity flex flex-col items-center md:flex-row">
          <GoTrophy className="text-6xl sm:text-7xl" />
          <div className="conQuality text-center md:text-left mt-4 md:mt-0 md:ml-4">
            <h1 className="font-semibold">High Quality</h1>
            {/* <p className="text-base-100">Made in China</p> */}
          </div>
        </div>
        <div className="Protection flex flex-col items-center md:flex-row">
          <IoShieldCheckmarkOutline className="text-6xl sm:text-7xl" />
          <div className="conProtection text-center md:text-left mt-4 md:mt-0 md:ml-4">
            <h1 className="font-semibold">Warranty Protection</h1>
            {/* <p className="text-base-100">Over 2 seconds</p> */}
          </div>
        </div>
        <div className="Shipping flex flex-col items-center md:flex-row">
          <FaShippingFast className="text-6xl sm:text-7xl" />
          <div className="conShipping text-center md:text-left mt-4 md:mt-0 md:ml-4">
            <h1 className="font-semibold">Free Shipping</h1>
            {/* <p className="text-base-100">Only for admin</p> */}
          </div>
        </div>
        <div className="Support flex flex-col items-center md:flex-row">
          <MdOutlineSupportAgent className="text-6xl sm:text-7xl" />
          <div className="conSupport text-center md:text-left mt-4 md:mt-0 md:ml-4">
            <h1 className="font-semibold">24/7 Support</h1>
            {/* <p className="text-base-100">Only for admin</p> */}
          </div>
        </div>
      </div>

      {/* Contact Info Section */}
      <div className="ContactInfo grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 h-auto bg-base-100 py-10 px-4 md:px-10 gap-y-10">
        <div className="col-span-2 place-items-start px-4 sm:px-10 md:px-20">
          <h1 className="font-poppins font-semibold text-2xl py-5">BeluStyle</h1>
          <div className="info w-full">
            <p className="font-poppins text-sm md:text-base">
              600 Nguyễn Văn Cừ Nối Dài, An Bình, Ninh Kiều, Cần Thơ 900000 FPT CAN THO UNIVERSITY
            </p>
          </div>
        </div>

        <div className="Links px-4">
          <p className="py-5 font-medium font-poppins text-base-300 text-xl md:text-2xl">Links</p>
          <div className="naviLink font-medium font-poppins flex flex-col space-y-10 text-sm md:text-base">
            <Link to="/">Home</Link>
            <Link to="/shop">Shop</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
          </div>
        </div>

        <div className="Helps px-4">
          <p className="py-5 font-medium font-poppins text-base-300 text-xl md:text-2xl">Help</p>
          <div className="naviLink font-medium font-poppins flex flex-col space-y-10 text-sm md:text-base">
            <Link to="/payment-options">Payment Options</Link>
            <Link to="/return">Return</Link>
            <Link to="/privacy-policies">Privacy Policies</Link>
          </div>
        </div>

        <div className="NewLetters col-span-2 px-4">
          <img src={logo} alt="" />
        </div>
      </div>

      {/* Copyright Section */}
      <div className="copyRight bg-base-200 py-4 mx-32">
      <Divider></Divider>
        <p className="font-poppins text-sm md:text-base">2024 &copy; Group 4. All rights reverved</p>
      </div>
    </>
  );
};

export default Footer;
