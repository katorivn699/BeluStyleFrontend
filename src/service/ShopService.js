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
        "Unable to load the brand list. Please try again later.",
      {
        position: "top-left",
        transition: Zoom,
      }
    );
    return [];
  }
};

export const getProductList = async () => {
  try {
    const response = await apiClient.get("/api/products");
    return response.data; 
  } catch (error) {
    toast.error(
      error.message ||
        "Unable to load the product list. Please try again later.",
      {
        position: "top-left",
        transition: Zoom,
      }
    );
    return []; 
  }
};

export const getProductItem = async (productId) => {
  try {
    const response = await apiClient.get("/api/products/" + productId.id);
    return response.data; 
  } catch (error) {
    toast.error(
      error.message ||
        "Unable to load this product! Please try again.",
      {
        position: "top-left",
        transition: Zoom,
      }
    );
    return []; 
  }
};
