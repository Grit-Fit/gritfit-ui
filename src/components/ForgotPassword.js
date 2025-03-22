import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../axios";
import "../css/ForgotPassword.css";
import logo from "../assets/logo_fit.jpeg";
import { ChevronLeft } from "lucide-react";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle sending reset code
  async function handleSendCode(e) {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      const resp = await axios.post("https://api.gritfit.site/api/forgotPassword", { email });
      if (resp.status === 200) {
        setMessage("Reset code sent! Please check your email.");
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Error sending reset code");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  }

  // If user already has a code, go to "resetPassword" page
  function handleAlreadyHaveCode() {
    navigate("/resetPassword", { state: { email } });
  }


  function handleBack() {
    navigate(-1);
  }

  return (
    <div className="forgot-container">

      <div className="forgot-back" onClick={handleBack}>
        <ChevronLeft size={40} />
      </div>

      {/* Centered logo */}
      <img src={logo} alt="App Logo" className="forgot-logo" />

      {/* Heading */}
      <h2 className="forgot-title">Forgot Password</h2>

      {/* Subtext or instructions */}
      <p className="forgot-subtext">Enter the email associated with your account</p>

      {/* Error or success message */}
      {message && <p className="forgot-message">{message}</p>}

      {/* Form */}
      <form className="forgot-form" onSubmit={handleSendCode}>
        <input
          type="email"
          className="forgot-input"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button type="submit" className="forgot-btn" disabled={isSubmitting}>
          {isSubmitting ? "Sending..." : "Send Code"}
        </button>
      </form>

      <button type="button" className="forgot-alt-btn" onClick={handleAlreadyHaveCode}>
        Reset Your Password
      </button>
    </div>
  );
}
