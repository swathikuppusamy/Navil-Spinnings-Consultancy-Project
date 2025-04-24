import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === 'production' 
  ? import.meta.env.VITE_API 
  : "http://localhost:5000/api",
    timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default axiosInstance;