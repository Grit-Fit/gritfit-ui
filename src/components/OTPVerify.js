import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "../axios";
import { useAuth } from "../context/AuthContext";
import "../css/OTPVerify.css"; 
import logo1 from "../assets/logo_fit.jpeg";
import { ChevronLeft } from "lucide-react";  

export default function OTPVerify() {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { loginWithToken } = useAuth();


  const email = location.state?.email || "";

  async function handleOTPSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      const resp = await axios.post("/api/verifyOTP", { email, code: otp });
      if (resp.status === 200) {
        const { token } = resp.data;
        if (token) {

          loginWithToken(token);

          navigate("/welcome");
        } else {
          setMessage("OTP verified, but token missing from response.");
        }
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Error verifying OTP.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleBack() {
    navigate(-1); 
  }

  return (
    <div className="otp-container">
      {/* Back arrow at top-left */}
      <div className="otp-back" onClick={handleBack}>
        <ChevronLeft size={40} />
      </div>

      {/* Logo */}
      <img src={logo1} alt="GritFit Logo" className="auth-launch-logo" />

      <div className="otp-box">
        <h2 className="otp-title">Verify Your Account</h2>
        <p className="otp-subtext">
          Enter the OTP sent to <strong>{email}</strong>
        </p>

        {message && <p className="otp-message">{message}</p>}

        <form className="otp-form" onSubmit={handleOTPSubmit}>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter 4-digit OTP"
            className="otp-input"
            required
          />
          <button type="submit" className="otp-btn" disabled={isSubmitting}>
            {isSubmitting ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
      </div>
    </div>
  );
}
