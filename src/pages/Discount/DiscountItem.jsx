import React from "react";
import { formatPrice } from "../../components/format/formats";

const CouponCard = ({ discount, brand, timesUsed, expiry, discountType }) => {
  return (
    <div className="relative bg-blue-500 text-white rounded-lg p-4 shadow-lg w-52">
      <div className="flex justify-between items-center">
        <span className="bg-red-500 text-xs font-semibold px-2 py-1 rounded-md">
          {timesUsed} TIME USED
        </span>
      </div>
      <div className="flex flex-col items-center mt-4 mb-2">
        <h1 className="text-4xl font-bold">
          {discountType === "PERCENTAGE"
            ? `${discount}%`
            : formatPrice(discount)}
        </h1>
        <p className="text-lg font-semibold mt-1">{brand}</p>
      </div>
      <div className="absolute bottom-2 right-2 text-xs">Exp: {expiry}</div>
    </div>
  );
};

export default CouponCard;
