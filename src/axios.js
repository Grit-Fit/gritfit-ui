// src/axios.js
import axios from "axios";
import { useAuth } from "./context/AuthContext";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5050/api", // Use environment variable for base URL
  withCredentials: true, // Send cookies for authentication
});

export const useAxios = () => {
  const { accessToken, refreshAuthToken, logout } = useAuth();

  // Add a request interceptor to attach the access token
  api.interceptors.request.use(
    async (config) => {
      if (accessToken) {
        config.headers["Authorization"] = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Add a response interceptor to handle token expiration
  api.interceptors.response.use(
    (response) => response, // Pass through successful responses
    async (error) => {
      if (error.response?.status === 401) {
        // If unauthorized, try refreshing the token
        try {
          await refreshAuthToken(); // Fetch a new access token
          return api.request(error.config); // Retry the original request
        } catch (refreshError) {
          logout(); // Logout if refresh fails
        }
      }
      return Promise.reject(error); // Pass other errors to the caller
    }
  );

  return api;
};

export default api;
