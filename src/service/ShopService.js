import { toast, Zoom } from "react-toastify";
import { apiClient } from "../core/api";

export const getCategory = async () => {
  try {
    const response = await apiClient.get("/api/categories");
    return response.data;
  } catch (error) {
    toast.error(
      error.message ||
        "Unable to load the category list. Please try again later.",
      {
        position: "top-left",
        transition: Zoom,
      }
    );
    return [];
  }
};

export const getBrand = async () => {
  try {
    const response = await apiClient.get("/api/brands");
    return response.data;
  } catch (error) {
    toast.error(
      error.message ||
        "Unable to load the category list. Please try again later.",
      {
        position: "top-left",
        transition: Zoom,
      }
    );
    return [];
  }
};
