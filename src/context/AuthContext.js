// src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import {jwtDecode} from 'jwt-decode';   // If named import fails, use a default import
import axios from '../axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); 
  const [accessToken, setAccessToken] = useState(
    () => localStorage.getItem('accessToken') || null
  );
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Whenever `accessToken` changes, sync it to localStorage
  useEffect(() => {
    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
    } else {
      localStorage.removeItem('accessToken');
    }
  }, [accessToken]);

  // Decode a JWT and set user state
  const decodeToken = (token) => {
    try {
      const decoded = jwtDecode(token);
      setUser(decoded);
      return decoded;
    } catch (error) {
      console.error('Failed to decode token', error);
      setUser(null);
      return null;
    }
  };

  // 1) For normal sign-in with credentials (calls /api/signIn)
  const loginWithCredentials = async (credentials) => {
    try {
      const response = await axios.post('/api/signIn', credentials, {
        withCredentials: true, // so cookies get sent
      });
      const { token } = response.data;
      if (token) {
        setAccessToken(token);
        decodeToken(token);
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error; // Or handle error in your UI
    }
  };

  // 2) For OTP-based verification (server returns token),
  //    we simply store it in state + decode.
  const loginWithToken = (token) => {
    setAccessToken(token);
    decodeToken(token);
  };

  // Logout function
  const logout = async () => {
    try {
      setIsLoggingOut(true);
      await axios.post('/api/logout', {}, { withCredentials: true });
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setAccessToken(null);
      setUser(null);
      setIsLoggingOut(false);
    }
  };

  // Attempt to refresh the token (if your backend supports it)
  const refreshAuthToken = async () => {
    try {
      const response = await axios.post('/refreshToken', {}, { withCredentials: true });
      const { accessToken: newToken } = response.data;
      if (newToken) {
        setAccessToken(newToken);
        decodeToken(newToken);
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
    }
  };

  // Check token expiry on app load
  useEffect(() => {
    if (accessToken && !isLoggingOut) {
      const decoded = decodeToken(accessToken);
      if (!decoded?.exp) return;
      
      const expiryTime = decoded.exp * 1000; 
      const now = Date.now();
      const timeUntilRefresh = expiryTime - now - 60000; 
      
      if (timeUntilRefresh > 0) {
        const refreshTimer = setTimeout(refreshAuthToken, timeUntilRefresh);
        return () => clearTimeout(refreshTimer);
      } else {
        // Already expired or nearly expired => attempt to refresh immediately
        refreshAuthToken();
      }
    }
  }, [accessToken, isLoggingOut]);

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        loginWithCredentials,
        loginWithToken,    // <--- OTP can call this
        refreshAuthToken,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
