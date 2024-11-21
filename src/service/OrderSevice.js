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
    console.log("Error fetching Order");
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
  }
};
