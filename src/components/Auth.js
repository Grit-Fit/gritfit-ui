import React, { useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "../axios";
import logo from "../assets/GritFit_Full.png";
import "../css/Auth.css";
import back from "../assets/Back.png";
import signInIcon from "../assets/signInIcon.png";
import signUpIcon from "../assets/signUpIcon.png";
import RefreshButton from "./RefreshButton.js";
import { supabase } from "../supabaseClient";

const API_URL =  "https://api.gritfit.site/api";

const Auth = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const isLogin = location.pathname === "/login";
  const isSignup = location.pathname === "/signup";

  

  // ✅ Updated: Now using Supabase for sign up (email verification included)
  const handleSubmitSignUp = async (e) => {
    e.preventDefault();
    setMessage(""); // Clear old messages

    try {
      const { data, error } = await supabase.auth.signUp(
        { email, password },
        { redirectTo: "https://www.gritfit.site/welcome" }
      );

      if (error) {
        setMessage(`❌ ${error.message}`);
      } else {
        setMessage("✅ Account created! Please check your email to verify your account.");
      }
    } catch (err) {
      setMessage("An unexpected error occurred.");
      console.error(err);
    }
  };

  // ✅ Updated: Now using Supabase for sign in (removes old backend API dependency)
  const handleSubmitLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setMessage(`❌ ${error.message}`);
      } else {
        login(data.session.access_token, { email });
        navigate("/gritPhases");
      }
    } catch (err) {
      setMessage("An unexpected error occurred.");
      console.error(err);
    }
  };

  return (
    <div className="auth-container">
      {(isLogin || isSignup) && (
        <button className="back-button" onClick={() => navigate("/")}>
          <img src={back} alt="back"></img>
        </button>
      )}
      <div className="content-wrapper">
        <img src={logo} alt="Logo" className="logo-auth" />
        {!isLogin && !isSignup ? (
          <div>
            <>
              {/* <h5 className="welcome">Welcome!</h5> */}
              <div className="button-container">
                <button className="auth-button" id="signIN" onClick={() => navigate("/login")}>
                  <img src={signInIcon} alt="Sign In Icon" className="icon-left" />
                  Sign In
                </button>
                <button className="auth-button" id="signUP" onClick={() => navigate("/signup", { state: { from: "/signup" } })}>
                  <img src={signUpIcon} alt="Sign Up Icon" className="icon-left" />
                  Create Account
                </button>

                <div className="App">
                  <RefreshButton />
                </div>

              </div>
            </>
          </div>
        ) : isLogin ? (
          <>
            <h2 className="welcome">Sign In</h2>
            <div className="form-container">
              <form onSubmit={handleSubmitLogin}>
                <input type="email" value={email} placeholder="Email*" onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" value={password} placeholder="Password*" onChange={(e) => setPassword(e.target.value)} required />
                <button className="signin-button" type="submit">Sign In</button>
                <div className="App">
                  <RefreshButton />
                </div>
              </form>
              {message && <p className="message">{message}</p>}
            </div>
          </>
        ) : (
          <>
            <h2 className="welcome">Create Account</h2>
            <div className="form-container create-account-form">
            <form onSubmit={handleSubmitSignUp}> 
                <input
                    type="email"
                    value={email}
                    placeholder="Email*"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    value={password}
                    placeholder="Create Password*"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                {/* ✅ Fix: Ensure button acts as submit */}
                <button type="submit" className="createAcc-button">Create Account</button>

                <div className="App" style={{ marginLeft: "124px" }}>
                  <RefreshButton />
                </div>
            </form>

            

              {message && <p className="message">{message}</p>}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

{/* Check gitpush */}

export default Auth;
