import { apiClient } from "../core/api";
import { toast, Zoom } from "react-toastify";

export const GetUserInfo = (authHeader) => {
  try {
    const response = apiClient.get("/api/account/me", {
      headers: {
        Authorization: authHeader,
      },
    });
    return response;
  } catch (error) {
    if (error.message) {
      toast.error(error.message, {
        position: "top-center",
        transition: Zoom,
      });
      throw new Error(error.response);
    } else {
      throw new Error("An error occurred. Please try again.");
    }
  }
};
