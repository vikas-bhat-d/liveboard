import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://liveboard-0pnz.onrender.com",
});

export default axiosInstance;
