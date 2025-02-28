import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useLocation, useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { search } = useLocation();

  // Extract the access token from the URL query parameters, if present.
  // The reset link from Supabase should include the access token.
  const queryParams = new URLSearchParams(search);
  const accessTokenFromURL = queryParams.get('access_token');

  // If there's a token from the URL, set the session
  useEffect(() => {
    const setSessionFromURL = async () => {
      if (accessTokenFromURL) {
        // For security, you might want to validate this token.
        // Here we set the session so that the user can update their password.
        await supabase.auth.setSession({ access_token: accessTokenFromURL, refresh_token: null });
      }
    };
    setSessionFromURL();
  }, [accessTokenFromURL]);

  const handleReset = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Password updated successfully. Please log in.");
      // Optionally, navigate to login page after a short delay
      setTimeout(() => navigate('/login'), 2000);
    }
  };

  return (
    <div className="reset-password-container">
      <h2>Reset Your Password</h2>
      <form onSubmit={handleReset}>
        <input
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <button type="submit">Reset Password</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ResetPassword;
