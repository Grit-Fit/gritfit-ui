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

  // snippet in Auth.js
const handleSendOtp = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post("/api/sendOtp", {
      email,
      password,
    });
    setMessage(response.data.message); // e.g. "OTP sent to your email."
    // Optionally navigate to an OTP verification page
    navigate("/verify-otp");
  } catch (error) {
    console.error(error);
    setMessage(error.response?.data?.error || "Something went wrong");
  }
};
 
// snippet in Auth.js

const handleSubmitSignUp = async (e) => {
  e.preventDefault();
  console.log("Signup initiated...");

  try {
    // 1) Call your new /api/sendOtp endpoint
    const response = await axios.post(`${API_URL}/sendOtp`, {
      email,
      password,
    });
    const { message: responseMessage } = response.data;

    // 2) (Optional) Store a flag in localStorage to track new sign-ups
    localStorage.setItem("justSignedUp", "true");
    console.log("🔹 LocalStorage value after setting:", localStorage.getItem("justSignedUp"));

    // 3) Show any success message returned by the server
    setMessage(responseMessage);

    // 4) Navigate to your VerifyOtp page
    navigate("/verify-otp", { replace: true });
  } catch (error) {
    console.error(error);
    setMessage(error.response ? error.response.data.message : "Error occurred");
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
