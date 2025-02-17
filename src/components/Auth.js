import React, { useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "../axios";
import logo from "../assets/Logo.png";
import "../css/Auth.css";
import back from "../assets/Back.png";
import signInIcon from "../assets/signInIcon.png";
import signUpIcon from "../assets/signUpIcon.png";
const API_URL = process.env.REACT_APP_API_URL || "https://api.gritfit.site/api";

const Auth = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const isLogin = location.pathname === "/login";
  const isSignup = location.pathname === "/signup";

  const handleSubmitSignUp = async (e) => {
    e.preventDefault();
    console.log("Signup initiated...");

    try {
        const response = await axios.post(`${API_URL}/createAccount`, {
            email,
            password,
        });
        const { token, message: responseMessage } = response.data;

        if (token) {
            const userData = { email, password };
            login(token, userData);

            // ✅ Use localStorage instead of sessionStorage
            localStorage.setItem("justSignedUp", "true");
            console.log("🔹 LocalStorage value after setting:", localStorage.getItem("justSignedUp"));

            console.log("✅ Navigating to /welcome...");
            navigate("/welcome", { replace: true });
            setMessage(responseMessage);
        }
    } catch (error) {
        console.error(error);
        setMessage(error.response ? error.response.data.message : "Error occurred");
    }
};

  const handleSubmitLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5050/api/signIn", {
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
            </form>

              {message && <p className="message">{message}</p>}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Auth;
