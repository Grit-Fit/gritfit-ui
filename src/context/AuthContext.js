import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../supabaseClient';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  // On mount, get the current session from Supabase and subscribe to auth state changes.
  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        setAccessToken(session.access_token);
      }
    };
    getSession();

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth event:", event, session);
      if (session) {
        setUser(session.user);
        setAccessToken(session.access_token);
      } else {
        setUser(null);
        setAccessToken(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Login using Supabase auth
  const login = async (credentials) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });
    if (error) {
      console.error("Login failed:", error.message);
      throw error;
    }
    if (data.session) {
      setUser(data.session.user);
      setAccessToken(data.session.access_token);
    }
    return data;
  };

  // Logout using Supabase auth
  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Logout failed:", error.message);
    }
    setUser(null);
    setAccessToken(null);
  };

  // Reset password: Sends a password reset email via Supabase.
  // The email's reset link should point to your ResetPassword page.
  const resetPassword = async (email) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://www.gritfit.site/reset-password', // Update with your URL
    });
    if (error) {
      console.error("Password reset failed:", error.message);
      throw error;
    }
    return data;
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, login, logout, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
