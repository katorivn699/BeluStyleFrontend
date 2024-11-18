import Lottie from "lottie-react";
import React, { useEffect } from "react";
import orderSuccess from "../../assets/anim/ordersuccess.json";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import { TbReorder } from "react-icons/tb";
import { paymentCallback } from "../../service/CheckoutService";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import { useCart } from "react-use-cart";

function OrderSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = localStorage.getItem("orderId");
  const {emptyCart} = useCart();
  const authHeader = useAuthHeader();

  useEffect(() => {
    const responseCode = searchParams.get("vnp_ResponseCode");
    const transactionStatus = searchParams.get("vnp_TransactionStatus");
  
    // Check if the order ID exists
    if (!orderId) {
      navigate("/");
      emptyCart();
      return;
    }
  
    // Handle cases where searchParams are missing
    if (!responseCode || !transactionStatus) {
      // Assume success for methods without response codes (e.g., PayOs, COD, Bank Transfer)
      paymentCallback(orderId, authHeader, 1); // Status 1 for success
      return;
    }
  
    // Handle VNPay specific responses
    if (responseCode === "00" && transactionStatus === "00") {
      // Success: perform callback
      paymentCallback(orderId, authHeader, 1); // Status 1 for success
    } else {
      // Failure: redirect to error page
      navigate("/orders/error");
      return;
    }
  }, [authHeader, emptyCart, navigate, orderId, searchParams]);
  

  const handleViewOrder = () => {
    navigate("/user/orders/" + orderId);
    emptyCart();
    localStorage.removeItem("orderId");
  }

  const handleReturnToHome = () => {
    navigate("/");
    emptyCart();
    localStorage.removeItem("orderId");
  };

  return (
    <div className="OrderConfirm flex flex-col items-center py-24">
      <div className="MailSended w-72">
        <Lottie animationData={orderSuccess} loop={false} />
      </div>
      <div className="content font-poppins text-center">
        <p className="text-3xl font-bold">Order Success</p>
        <p className="text-xl py-2 font-bold">Your Order number: {orderId}</p>
        <p className="pt-3">
          Your order is now pending. Please wait for the shop staff to confirm
          your order. This will just take a moment!
        </p>
      </div>
      <div className="button flex pt-40 space-x-6">
        <button
          className="btn Return flex bg-slate-400 text-white rounded-full items-center space-x-2 font-inter shadow-none border-none w-auto px-4 justify-center h-12"
          onClick={handleViewOrder}
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
