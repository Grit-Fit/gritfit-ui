import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from '../axios';
import { supabase } from "../supabaseClient";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Stores decoded user info
  const [accessToken, setAccessToken] = useState(() => localStorage.getItem('accessToken') || null); // Access token stored only in localStorage
  const [isLoggingOut, setIsLoggingOut] = useState(false); // Flag to track manual logout

  useEffect(() => {
    if (accessToken) {
        localStorage.setItem('accessToken', accessToken);
    } else {
        localStorage.removeItem('accessToken');
    }
}, [accessToken]);
  // Decode the access token and update the user state
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

// Login function
const login = async (_, credentials) => {
  try {
      const response = await axios.post('api/signIn', credentials, {
          withCredentials: true, // Include cookies
      });
      const { token } = response.data;

      console.log("✅ Signup Successful. Storing token...");
      
      // ✅ Delay setting token to allow navigation to complete
      
          setAccessToken(token);
          decodeToken(token);

  } catch (error) {
      console.error('Login failed:', error);
  }
};


  // Logout function
  // Logout function
  const logout = async () => {
    try {
      setIsLoggingOut(true); // Set the flag to true when logging out
      await axios.post('api/logout', {}, { withCredentials: true }); // Backend should clear the refresh token
      setAccessToken(null);
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoggingOut(true); // Reset the flag after logout process
    }
  };

  useEffect(() => {
    // Check for an existing session on load.
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setAccessToken(session.access_token);
        setUser(session.user);
      }
    });
  
    // Subscribe to auth changes (sign in, sign out, etc.)
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setAccessToken(session.access_token);
        setUser(session.user);
      } else {
        setAccessToken(null);
        setUser(null);
      }
    });
    return () => authListener.subscription.unsubscribe();
  }, []);
  

  // Fetch the token from the backend via a refresh route
  const refreshAuthToken = async () => {
    try {
      const response = await axios.post('/refreshToken', {}, { withCredentials: true });
      const { accessToken } = response.data; // New access token from backend
      setAccessToken(accessToken);
      decodeToken(accessToken); // Decode the new token
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout(); // Handle logout if refresh fails
    }
  };


  // Check token validity on app load
  useEffect(() => {
    if (accessToken && !isLoggingOut) {
      const decoded = jwtDecode(accessToken);
      const expiryTime = decoded.exp * 1000; // Convert to milliseconds
      console.log("expired: ", new Date(expiryTime).toUTCString());
      const timeout = expiryTime - Date.now() - 60000; // Refresh 1 minute before expiry
      console.log("today: ", new Date(Date.now() - 60000).toUTCString());
  
      const refreshTimer = setTimeout(refreshAuthToken, timeout);
      return () => clearTimeout(refreshTimer); // Cleanup on unmount
    }
  }, [accessToken, isLoggingOut]);

  return (
    <AuthContext.Provider value={{ user, accessToken, refreshAuthToken, login, logout  }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
