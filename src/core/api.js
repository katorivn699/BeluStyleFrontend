import axios from "axios";
import { QueryClient } from "react-query";

const apiClient = axios.create({
    baseURL: 'http://localhost:8080',
})

const queryClient = new QueryClient();

export {apiClient, queryClient};