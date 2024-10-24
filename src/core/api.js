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
      const { status } = error.response;
      if (status === 404) {
        toast.error("Error 404: Resource not found", {
          position: "top-right",
          transition: Zoom,
        });
      } else if (status === 401) {
        toast.error("Error 401: Unauthorized access", {
          position: "top-right",
          transition: Zoom,
        });
      } else if (status === 400) {
        toast.error("Error 400: Bad request", {
          position: "top-right",
          transition: Zoom,
        });
      } else {
        toast.error(
          `Error ${status}: ${
            error.response.data.message || "An error occurred"
          }`,
          {
            position: "top-right",
            transition: Zoom,
          }
        );
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
