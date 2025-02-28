// src/components/WelcomePage.js
import React, { useState, useEffect } from "react";
import StatusCard from "./StatusCard";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import logo from "../assets/GritFit_Full.png";
import "../css/Welcome.css";
import axios from "../axios";

const WelcomePage = () => {
  const { logout, accessToken, refreshAuthToken } = useAuth();
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const [clickedIndex, setClickedIndex] = useState(null);


  const cardData = [
    { text: "Progress in the gym", locked: false },
    { text: "Overall health and longevity", locked: true },
  ];
  const handleCardClick = (index) => {
    if(!name){
      setMessage("Please enter your name first");
    } else {
      setClickedIndex(index);
      navigate("/selectTheory", {})
      // navigate("/calorieCalc", {});
      // Optionally, you can clear the input field after successful update
      setName("");
    }
  };

  // if (!authToken) {
  //   // Redirect to login page if not authenticated
  //   navigate("/");
  //   return null;
  // }
  useEffect(() => {
    // If there is no accessToken, try to refresh it by calling the backend refresh route
    if (!accessToken) {
      refreshAuthToken(); // Refresh token by making API call to the backend
    }
  }, [accessToken, refreshAuthToken]);

  const handleUpdateUsername = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "/api/updateUsername",
        {
          newUsername: name,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setMessage(response.data.message);
    } catch (error) {
      console.error("Error updating username:", error);
      setMessage(error.response ? error.response.data.message : "Error occurred");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="container">
              <div className="theory-header1">
          <div>
          </div>
          <div className="logo-container-welcome">
            <img src={logo} alt="Logo" className="logo-gritPhases1" />
          </div>
        </div>
      {/* <h1 className="welcome">Welcome!</h1> */}
      {/* <p className="text">We are as excited as you are!</p>
      <p className="text">Let's start by knowing a bit about you</p> */}
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
          That's Me!
        </button>
      </form>
      {message && <p className="message">{message} !</p>}
      <br />
      <br />
      <h3 className="nameprompt">Tell us what brings you here?</h3>
      <div style={{ padding: "20px", marginTop: "20px" }}>
        {cardData.map((card, index) => (
          <StatusCard
            key={index}
            text={card.text}
            locked={card.locked}
            onClick={() => handleCardClick(index)}
            className={clickedIndex === index && !card.locked ? "clicked" : ""}
          />
        ))}
      </div>
      {/* <button onClick={handleLogout} className="btn">
        Logout
      </button> */}
    </div>
  );
};

export default WelcomePage;
