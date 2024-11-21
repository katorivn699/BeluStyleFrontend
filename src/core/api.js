import axios from "axios";
import { QueryClient } from "react-query";
import "react-toastify/dist/ReactToastify.css";

// Tạo instance Axios
const apiClient = axios.create({
  baseURL: "http://26.37.54.168:8080",
});

const queryClient = new QueryClient();

export { apiClient, queryClient };
