import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api"||import.meta.env.VITE_API,  // Default to localhost in development
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default axiosInstance;