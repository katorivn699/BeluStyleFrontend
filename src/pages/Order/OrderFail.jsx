import Lottie from "lottie-react";
import React, { useEffect } from "react";
import orderFail from "../../assets/anim/ordererror.json";
import { useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import { paymentCallback } from "../../service/CheckoutService";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";

function OrderFail() {
  const navigate = useNavigate();
  const orderId = localStorage.getItem("orderId");
  const authHeader = useAuthHeader();
  const status = 0;

  useEffect(() => {
    paymentCallback(orderId, authHeader, status);
  }, [orderId, authHeader]);

  const handleReturnToHome = () => {
    navigate("/");
  };

  return (
    <div className="OrderConfirm flex flex-col items-center py-24">
      <div className="MailSended w-72">
        <Lottie animationData={orderFail} loop={false} />
      </div>
      <div className="content font-poppins text-center">
        <p className="text-3xl font-bold">Your order is canceled</p>
        {/* <p className="text-xl py-2 font-bold">Your Order number: P00000X</p> */}
        <p className="pt-3">
          Your order is now stuck. Please wait re-order and pay! Don’t hold back
          on spending
        </p>
      </div>
      <div className="button flex pt-40 space-x-6">
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

export default OrderFail;
