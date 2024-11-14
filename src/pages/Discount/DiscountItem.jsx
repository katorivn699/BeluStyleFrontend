import React from "react";
import { formatPrice } from "../../components/format/formats";
import { IoCopyOutline } from "react-icons/io5";
import { toast, Zoom } from "react-toastify";

const DiscountCard = ({ discount, brand, timesUsed, expiry, discountType }) => {

  const handleCopyCode = () => {
    navigator.clipboard.writeText(brand);
    toast.success("Discount code copied!", {
      position: "bottom-center",
      transition: Zoom
    })
  };

  return (
    <div className="relative bg-belugradient text-white rounded-lg p-4 shadow-lg w-52 h-44">
      <div className="flex justify-between items-center">
        <span className="bg-red-500 text-xs font-semibold px-2 py-1 rounded-md font-montserrat">
          {timesUsed} TIME USED
        </span>
        {/* Copy Icon */}
        <IoCopyOutline
          className="text-white text-lg cursor-pointer hover:text-gray-300"
          onClick={handleCopyCode}
          title="Copy Discount Code"
        />
      </div>
      <div className="flex flex-col items-center mt-4 mb-2 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold font-montserrat">
          {discountType === "PERCENTAGE" ? `${discount}%` : formatPrice(discount)}
        </h1>
        <p className="text-lg font-semibold mt-1 font-montserrat">{brand}</p>
      </div>
      <div className="absolute bottom-2 right-2 text-xs font-montserrat">
        Exp: {expiry}
      </div>
    </div>
  );
};

export default DiscountCard;
