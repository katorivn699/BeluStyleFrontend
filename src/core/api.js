import axios from "axios";
import { QueryClient } from "react-query";
import "react-toastify/dist/ReactToastify.css";

// Tạo instance Axios
const apiClient = axios.create({
  baseURL: "http://localhost:8080",
});

const queryClient = new QueryClient();

export { apiClient, queryClient };
