import axios from "axios";
 const axiosInstance = axios.create({
    baseURL : "https://navil-spinnings-consultancy-project.onrender.com/api",
    timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
})
export default axiosInstance;