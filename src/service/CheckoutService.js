import React from "react";
import { apiClient } from "../core/api";
import { toast, Zoom } from "react-toastify";

export const checkout = async ({ items }) => {
  const response = apiClient.post("/api/orders", {
    orderDetails: items
  });
};

export const checkDiscount = async (discountCode, authHeader, totalOrder) => {
  try {
    const response = await apiClient.get(
      "/api/discounts/check-user-discount?discount=" + discountCode + "&total=" + totalOrder,
      {
        headers: {
          Authorization: authHeader,
        },
      }
    );
    return response;
  } catch (error) {
    toast.error(
      error.response?.data?.message || "Error when checking discount code! Try again.",
      {
        position: "bottom-center",
        transition: Zoom,
      }
    );
  }
};

export const checkoutOrder = async (checkoutItem, authHeader) => {
  try {
    const response = await apiClient.post("/api/orders", {
      notes: checkoutItem.notes,
      discountCode: checkoutItem.discountCode,
      billingAddress: checkoutItem.billingAddress,
      shippingMethod: checkoutItem.userAddress,
      totalAmount: checkoutItem.totalAmount,
      paymentMethod: checkoutItem.paymentMethod,
      userAddress: checkoutItem.userAddress,
      orderDetails: checkoutItem.orderDetails
    }, {
      headers: {
        Authorization: authHeader,
      },
    })
    return response;
  } catch (error) {
    toast.error(error?.data || "Error when ordering", {
      position: "top-center",
      transition: Zoom
    })
  }
};

export const paymentCallback = async(orderId, authHeader, status) => {
  try {
    const response = await apiClient.post("/api/orders/" + orderId + "/payment-callback?isSuccess=" + status, {}, {
      Authorization: {
        headers: authHeader
      }
    })
    return response;
  } catch (error) {
    toast.error(error?.data || "Error when payment", {
      position: "top-center",
      transition: Zoom
    })
  }
}