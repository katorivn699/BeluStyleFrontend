import React from "react";
import OrderItemCard from "./OrderItem";

export const OrderList = ({ OrderList }) => {
  return (
    <div className="oList">
      {OrderList.map((Order) => (
        <div className="item py-3">
          <OrderItemCard Order={Order} />
        </div>
      ))}
    </div>
  );
};
