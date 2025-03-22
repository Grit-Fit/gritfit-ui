import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../axios";
import { ChevronLeft } from "lucide-react"; 
import "../css/ResetPassword.css";
import logo from "../assets/logo_fit.jpeg";

export default function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();

  const [email, setEmail] = useState(location.state?.email || "");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleReset(e) {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      const resp = await axios.post("http://localhost:5050/api/resetPassword", {
        email,
        resetCode,
        newPassword,
      });

      if (resp.status === 200) {
        setMessage("Password reset! You can now sign in.");
        navigate("/login");
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to reset password");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  }


  function handleBack() {
    navigate(-1);
  }

  return (
    <div className="reset-container">

      <div className="reset-back" onClick={handleBack}>
        <ChevronLeft size={40} />
      </div>


      <img src={logo} alt="App Logo" className="reset-logo" />

      <h2 className="reset-title">Reset Your Password</h2>


      {message && <p className="reset-message">{message}</p>}

      {/* Form */}
      <form onSubmit={handleReset} className="reset-form">
        <input
          type="email"
          className="reset-input"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="text"
          className="reset-input"
          placeholder="Reset OTP"
          value={resetCode}
          onChange={(e) => setResetCode(e.target.value)}
          required
        />

        <input
          type="password"
          className="reset-input"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />

        <button type="submit" className="reset-btn" disabled={isSubmitting}>
          {isSubmitting ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}
