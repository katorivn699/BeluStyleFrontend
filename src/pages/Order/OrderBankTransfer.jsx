import React, { useEffect, useState } from "react";
import qrcode from "../../assets/images/momoBankTransfer.jpg";
import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import { useCart } from "react-use-cart";
import { formatPrice } from "../../components/format/formats";

function OrderBankTransfer() {
  const OrderId = localStorage.getItem("orderId");
  const [isConfirmed, setIsConfirmed] = useState(false); // Track if payment is confirmed
  const navigate = useNavigate();
  const { emptyCart } = useCart();
  const location = useLocation();
  
  // Parse the query string
  const queryParams = new URLSearchParams(location.search);
  const total = queryParams.get('total'); // Get the 'total' query parameter

  const handleNavigate = () => {
    // Navigate to a different page, such as the order confirmation or order details page
    navigate("/orders/success"); // Replace with the desired path
  };


  useEffect(() => {
    if (!OrderId) {
      emptyCart();
      return navigate("/"); // Redirect to the home page
    }
  }, [OrderId, emptyCart, navigate]);

  const handleConfirmPayment = () => {
    // Once payment is confirmed, disable further interactions
    setIsConfirmed(true);
  };

  return (
    <div className="mx-auto max-h-full">
      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left side: QR Code */}
        <div className="flex justify-center">
          <img
            src={qrcode}
            alt="QR Code for Payment"
            className="w-1/2 h-full"
          />
        </div>

        {/* Right side: Order Information */}
        <div className="flex flex-col justify-center items-center space-y-4 font-montserrat">
          <p className="text-center text-gray-600">
            Please complete your payment by scanning the QR code above. After
            the payment is successful, we will process your order.
          </p>
          <p className="text-center text-gray-600">
            Ensure that the amount is transferred correctly to avoid delays.
          </p>
          <p className="text-center text-gray-600">
            Content: "BELUSTYLE {OrderId}"
          </p>
          <p className="text-center text-gray-600">
            Total: {formatPrice(total)}
          </p>
          <p className="text-center text-gray-600">Owner: DUONG NHAT ANH</p>
          <div className="space-y-4">
            {!isConfirmed ? (
              <>
                <div className="flex justify-center">
                  <button
                    onClick={handleConfirmPayment}
                    className="mt-4 px-6 py-2 bg-beluBlue text-white rounded-full hover:bg-blue-700 font-poppins transition-transform duration-300 hover:scale-105"
                  >
                    Confirm Transfer
                  </button>
                </div>
                <p className="text-red-500 text-sm">
                  After confirming, you will not be able to go back to this
                  step.
                </p>
              </>
            ) : (
              <div className="text-center text-gray-500">
                <p>Your payment has been confirmed. Thank you!</p>
                <div className="flex justify-center">
                  <button
                    onClick={handleNavigate}
                    className="mt-4 px-6 py-2 bg-beluBlue text-white rounded-full hover:bg-blue-700 font-poppins transition-transform duration-300 hover:scale-105"
                  >
                    Confirm Order
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderBankTransfer;
