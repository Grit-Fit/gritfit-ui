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

  
//27-50
  const handleSubmitSignUp = async (e) => {
    e.preventDefault();
    console.log("Signup initiated...");
  
    try {
      // 1) Call your new /api/register route
      const response = await axios.post(`${API_URL}/register`, { email, password });
      const { message: responseMessage } = response.data;
  
      // 2) Show user a message: "Check your email..."
      setMessage(responseMessage || "User created! Check your email.");
  
      // 3) (Optional) Store a flag in localStorage to indicate user just signed up
      localStorage.setItem("justSignedUp", "true");
      console.log("🔹 LocalStorage justSignedUp:", localStorage.getItem("justSignedUp"));
  
      // 4) Optionally navigate them to a page that says "Check your email" or keep them here
      // If you want to stay on the same page, do nothing
      // Or do something like: navigate("/verify-info") to show instructions
    } catch (error) {
      console.error("Signup error:", error);
      setMessage(error.response?.data?.error || "Error occurred");
    }
  };

  
  const handleSubmitLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/signIn`, {
        email,
        password,
      });
      const { token, message: responseMessage } = res.data;
      setMessage(responseMessage);
      if (token) {
        const userData = { email, password };
        login(token, userData);

        // ✅ Fix: Redirect new users to /welcome, returning users to /gritPhases
        const fromSignup = location.state?.from === "/signup";
        navigate(fromSignup ? "/welcome" : "/gritPhases");
      }
    } catch (error) {
      console.error(error);
      setMessage(error.response ? error.response.data.message : "Error occurred");
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
