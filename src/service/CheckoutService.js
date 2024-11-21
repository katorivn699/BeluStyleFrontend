import { apiClient } from "../core/api";
import { toast, Zoom } from "react-toastify";

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
    // toast.error(error?.data || "Error when payment", {
    //   position: "top-center",
    //   transition: Zoom
    // })
    // console.log(error);
  }
};

export const cancelOrder = async (orderId, authHeader) => {
  try {
    const response = await apiClient.put("/api/orders/" + orderId + "/cancel", {}, {
      headers: {
        Authorization: authHeader
      }
    })
    return response
  } catch (error) {
    toast.error(error?.data || "Error when cancel order", {
      position: "top-center",
      transition: Zoom
    })
  }
};