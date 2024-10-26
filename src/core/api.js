import axios from "axios";
import { QueryClient } from "react-query";
import { toast, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Tạo instance Axios
const apiClient = axios.create({
  baseURL: "http://localhost:8080",
});

const queryClient = new QueryClient();

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      const message = data?.message || "An error occurred"; // Lấy message từ response nếu có

      if (status === 404) {
        toast.error(`${message}`, {
          position: "bottom-center",
          transition: Zoom,
        });
      } else if (status === 401) {
        toast.error(`${message}`, {
          position: "bottom-center",
          transition: Zoom,
        });
      } else if (status === 400) {
        toast.error(`${message}`, {
          position: "bottom-center",
          transition: Zoom,
        });
      } else {
        toast.error(`${message}`, {
          position: "top-right",
          transition: Zoom,
        });
      }
    } else {
      toast.error("Network error", {
        position: "top-right",
        transition: Zoom,
      });
    }
    return Promise.reject(error);
  }
);

export { apiClient, queryClient };
