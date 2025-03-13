// src/components/Auth.js

import React, { useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "../axios";

// Assets
import logo from "../assets/GritFit_Full.png";
import logo1 from "../assets/logo_fit.jpeg";
import backIcon from "../assets/Back.png";
import "../css/Auth.css";

const API_URL =  "https://api.gritfit.site/api";
const BETA_CODE = "MYBETA123";

export default function Auth() {
  const { login } = useContext(AuthContext);

  // States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [betaCodeInput, setBetaCodeInput] = useState("");
  const [betaError, setBetaError] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const isLogin = location.pathname === "/login";
  const isSignup = location.pathname === "/signup";

  // === CREATE ACCOUNT Logic ===
  async function handleSubmitSignUp(e) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1) Attempt to create the account
      const response = await axios.post(`${API_URL}/createAccount`, {
        email,
        password,
      });
      const { token, message: responseMessage } = response.data;

      // 2) Check Beta Code
      if (betaCodeInput.trim() !== BETA_CODE) {
        setBetaError("Invalid Code. Please check and try again.");
        return;
      }

      // 3) If success => store token, set 'justSignedUp', go to /welcome
      if (token) {
        login(token, { email, password });
        localStorage.setItem("justSignedUp", "true");
        navigate("/welcome", { replace: true });
        setMessage(responseMessage);
      }
    } catch (err) {
      console.error(err);
      setMessage(err.response ? err.response.data.message : "Error occurred");
    } finally {
      setIsSubmitting(false);
    }
  }

  // === SIGN IN Logic ===
  async function handleSubmitLogin(e) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await axios.post(`${API_URL}/signIn`, { email, password });
      const { token, message: responseMessage } = res.data;
      setMessage(responseMessage);

      if (token) {
        // 1) If sign in success => store token, go to /cardView
        login(token, { email, password });
        navigate("/cardView");
      }
    } catch (err) {
      console.error(err);
      setMessage(err.response ? err.response.data.message : "Error occurred");
    } finally {
      setIsSubmitting(false);
    }
  }

  // === BACK arrow => go Landing ===
  function handleBack() {
    navigate("/");
  }

  if (!isLogin && !isSignup) {
    return (
      <div className="auth-container auth-launch-screen">

        <img src={logo1} alt="GritFit Logo" className="auth-launch-logo" />
        <h2 className="auth">Welcome!</h2>

        <div className="auth-launch-buttons">
          <button
            className="auth-launch-btn"
            onClick={() => navigate("/login")}
          >
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

  if (isSubmitting) {
    return (
      <div className="auth-container">
        <h3>
          {isLogin ? "Signing you in..." : "Creating your account..."}
        </h3>
      </div>
    );
  }
  

  // === SIGN IN SCREEN ===
  if (isLogin) {
    return (
      <div className="auth-container auth-signin-bg">
        {/* Back arrow */}
        <button className="auth-back-button" onClick={handleBack}>
          <img src={backIcon} alt="Back" className="back-icon-img" />
        </button>

        {/* Logo */}
        <img src={logo} alt="GritFit Logo" className="auth-logo" />

        {/* Title */}
        <h2 className="auth-title">Welcome back</h2>

        {/* Form */}
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
      </div>
    );
  }

  // === SIGN UP SCREEN ===
  return (
    <div className="auth-container auth-signup-bg">
      <button className="auth-back-button" onClick={handleBack}>
        <img src={backIcon} alt="Back" className="back-icon-img" />
      </button>

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
