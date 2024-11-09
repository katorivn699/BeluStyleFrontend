import Lottie from "lottie-react";
import React from "react";
import RegSuccess from "../../assets/anim/RegisterSuccess.json";
import { useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import { TbReorder } from "react-icons/tb";

function OrderSuccess() {
  const navigate = useNavigate();

  const handleReturnToHome = () => {
    navigate("/");
  };

  return (
    <div className="OrderConfirm flex flex-col items-center py-24">
      <div className="MailSended w-60">
        <Lottie animationData={RegSuccess} loop={false} />
      </div>
      <div className="content font-poppins text-center">
        <p className="text-3xl font-bold">Order Success</p>
        <p className="text-xl py-2 font-bold">Your Order number: P00000X</p>
        <p className="pt-3">
          Your order is now pending. Please wait for the shop staff to confirm
          your order. This will just take a moment!
        </p>
      </div>
      <div className="button flex pt-40 space-x-6">
        <button
          className="btn Return flex bg-slate-400 text-white rounded-full items-center space-x-2 font-inter shadow-none border-none w-auto px-4 justify-center h-12"
          onClick={handleReturnToHome}
        >
          <p>View Order</p>
          <TbReorder />
        </button>
        <button
          className="btn Return flex bg-blueOcean text-white rounded-full items-center space-x-2 font-inter shadow-none border-none w-auto px-4 justify-center h-12"
          onClick={handleReturnToHome}
        >
          <p>Continue Shopping</p>
          <FaArrowRight />
        </button>
      </div>
    </div>
  );
}

export default OrderSuccess;
