// src/pages/VerifyOtp.js (example path)
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../axios";  // or your axios instance

const VerifyOtp = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/verifyOtp", { email, otp });
      setMessage(response.data.message); // e.g. "User verified successfully!"
      // If success, navigate to /welcome
      navigate("/welcome");
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setMessage(error.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto" }}>
      <h2>Verify Your OTP</h2>
      <form onSubmit={handleVerifyOtp}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label>OTP:</label>
          <input
            type="text"
            placeholder="4-digit code"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
        </div>

        <button type="submit">Verify OTP</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
};

export default VerifyOtp;
