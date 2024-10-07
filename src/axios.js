// src/axios.js
import axios from "axios";

// Create an Axios instance
const instance = axios.create({
  baseURL: "https://grit-fit-backend-stage.vercel.app/api", // Adjust based on your backend URL
});

// Add a request interceptor to include the token
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Or retrieve from AuthContext
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
