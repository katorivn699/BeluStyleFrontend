import { toast, Zoom } from "react-toastify";
import { apiClient } from "../core/api";

export const getOrderById = async (orderId, authHeader) => {
  try {
    const response = await apiClient.get("/api/orders/" + orderId, {
      headers: {
        Authorization: authHeader,
      },
    });
    return response;
  } catch (error) {
    toast.error(error?.data || "Get order error!", {
      position: "top-center",
      transition: Zoom,
    });
  }
};

export const confirmOrder = async (orderId, authHeader) => {
  try {
    const response = await apiClient.put(
      "/api/orders/" + orderId + "/confirm-receipt",
      {}, {
        headers: {
            Authorization: authHeader
        }
      }
    );
    return response;
  } catch (error) {
    toast.error(error?.data || "Error when confirm the order! try again", {
        position: "top-center",
        transition: Zoom
    })
  }
};
