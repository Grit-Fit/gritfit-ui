// src/components/WelcomePage.js
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import logo from "../assets/Logo.png";
import "./Welcome.css";
import axios from "../axios";

const WelcomePage = () => {
  const { logout, authToken } = useAuth();
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // if (!authToken) {
  //   // Redirect to login page if not authenticated
  //   navigate("/");
  //   return null;
  // }
  const handleUpdateUsername = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://gritfit-backend.onrender.com/api/updateUsername",
        { newUsername: name },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      setMessage(response.data.message);
      navigate("/gritPhases");
      // Optionally, you can clear the input field after successful update
      setName("");
    } catch (error) {
      console.error(error);
      setMessage(
        error.response ? error.response.data.message : "Error occurred"
      );
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="container">
      <img src={logo} alt="Logo" className="logo" />
      <h1 className="welcome">Welcome!</h1>
      <p className="text">We are as excited as you are!</p>
      <p className="text">Let's start by knowing a bit about you</p>
      <h3 className="nameprompt">What is your name?</h3>
      <form onSubmit={handleUpdateUsername}>
        <input
          type="text"
          value={name}
          className="inputbx"
          onChange={(e) => setName(e.target.value)}
          required
        />
        <button type="submit" className="btn">
          Submit
        </button>
      </form>
      {message && <p className="message">{message}</p>}
      <button onClick={handleLogout} className="btn">
        Logout
      </button>
    </div>
  );
};

export default WelcomePage;
