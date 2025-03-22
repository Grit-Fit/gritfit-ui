import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../axios";
import { ChevronLeft } from "lucide-react";
import { useAuth } from "../context/AuthContext";  // we'll use "loginWithCredentials"

import logo from "../assets/GritFit_Full.png";
import logo1 from "../assets/logo_fit.jpeg";
import "../css/Auth.css";

const API_URL =  "https://api.gritfit.site/api";
const BETA_CODE = "GRITFIT2025";

export default function Auth() {
  // Local state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [betaCodeInput, setBetaCodeInput] = useState("");
  const [betaError, setBetaError] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // We want to call: loginWithCredentials({ email, password })
  const { loginWithCredentials } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const isLogin = location.pathname === "/login";
  const isSignup = location.pathname === "/signup";

  // ===========================
  //  1) CREATE ACCOUNT Logic
  // ===========================
  async function handleSubmitSignUp(e) {
    e.preventDefault();
    setIsSubmitting(true);
    setBetaError("");
    setMessage("");

    // 1) Beta Code Check
    if (betaCodeInput.trim() !== BETA_CODE) {
      setBetaError("Invalid Code. Please check and try again.");
      setIsSubmitting(false);
      return;
    }

    try {
      // 2) Call /createAccount (no token creation yet)
      const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const response = await axios.post(`${API_URL}/createAccount`, {
        email,
        password,
        timezone: userTimeZone,
      });

      if (response.status === 201) {
        console.log("Signup success, navigating to OTP...");
        // The server sends an OTP to the user’s email
        const serverMsg = response.data.message || "Check your email for OTP.";
        setMessage(serverMsg);

        // 3) Move to OTP page (no login yet)
        navigate("/otpVerify", { state: { email } });
      } else {
        setMessage(`Unexpected response: ${response.status}`);
      }
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Error creating account");
    } finally {
      setIsSubmitting(false);
    }
  }

  // ===========================
  //  2) SIGN IN Logic
  // ===========================
  async function handleSubmitLogin(e) {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      await loginWithCredentials({ email, password });
      navigate("/cardView");
    } catch (err) {
      console.error(err);

      setMessage(err.response?.data?.message || "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  }

  // ===========================
  //  3) UTILS + RENDER LOGIC
  // ===========================
  function handleBack() {
    navigate("/");
  }

  // LAUNCH SCREEN if not /login or /signup
  if (!isLogin && !isSignup) {
    return (
      <div className="auth-container auth-launch-screen">
        <img src={logo1} alt="GritFit Logo" className="auth-launch-logo" />
        <h2 className="auth">Welcome!</h2>

        <div className="auth-launch-buttons">
          <button className="auth-launch-btn" onClick={() => navigate("/login")}>
            Sign In
          </button>
          <button
            className="auth-launch-btn"
            onClick={() => navigate("/signup", { state: { from: "/signup" } })}
          >
            Create Account
          </button>
        </div>
      </div>
    );
  }

  // Show quick message if in “submitting”
  if (isSubmitting) {
    return (
      <div className="auth-container">
        <h3>
          {isLogin ? "Signing you in..." : "Creating your account..."}
        </h3>
      </div>
    );
  }

  // SIGN IN SCREEN
  if (isLogin) {
    return (
      <div className="auth-container auth-signin-bg">
        <ChevronLeft className="intro-back-button" onClick={handleBack} size={40} />

        <img src={logo} alt="GritFit Logo" className="auth-logo" />
        <h2 className="auth-title">Welcome back</h2>

        <form className="auth-form" onSubmit={handleSubmitLogin}>
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="auth-submit-btn">
            {isSubmitting ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {message && <p className="auth-message">{message}</p>}

        <p className="auth-alt-text">
          Don’t have an account?{" "}
          <span className="auth-link" onClick={() => navigate("/signup")}>
            Sign up
          </span>
        </p>
        <div className="forgot-password-link" onClick={() => navigate("/forgotPassword")}>
            Forgot Password?
          </div>
      </div>
    );
  }

  // SIGN UP SCREEN
  return (
    <div className="auth-container auth-signup-bg">
      <ChevronLeft className="intro-back-button" onClick={handleBack} size={40} />

      <img src={logo} alt="GritFit Logo" className="auth-logo" />
      <h2 className="auth-title">Create Account</h2>

      <form className="auth-form" onSubmit={handleSubmitSignUp}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Code to access"
          value={betaCodeInput}
          onChange={(e) => setBetaCodeInput(e.target.value)}
          required
        />
        <button type="submit" className="auth-submit-btn">
          {isSubmitting ? "Creating..." : "Get Started"}
        </button>
      </form>

      {betaError && <p className="auth-message error">{betaError}</p>}
      {message && <p className="auth-message">{message}</p>}

      <p className="auth-alt-text">
        Already have an account?{" "}
        <span className="auth-link" onClick={() => navigate("/login")}>
          Sign in
        </span>
      </p>
    </div>
  );
}
