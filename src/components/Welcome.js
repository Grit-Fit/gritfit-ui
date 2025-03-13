
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "../axios";

import "../css/Welcome.css";

// Assets
import logo from "../assets/GritFit_Full.png";
import backIcon from "../assets/Back.png";

export default function WelcomePage() {
  const { accessToken, refreshAuthToken } = useAuth();
  const navigate = useNavigate();

  // State
  const [name, setName] = useState("");
  const [goal, setGoal] = useState("");
  const [message, setMessage] = useState("");
  const [isLocked, setIsLocked] = useState(false);


  useEffect(() => {
    if (!accessToken) {
      refreshAuthToken();
    }
  }, [accessToken, refreshAuthToken]);


  async function handleNext() {
    // If name is empty => error
    if (!name.trim()) {
      setMessage("Please enter your name first.");
      return;
    }

    if (!goal) {
      setMessage("Please select a goal.");
      return;
    }

    if (goal === "longevity") {
      setIsLocked(true);
      setMessage("That goal is locked for now. Please pick 'Progress in the gym'.");
      return;
    }


    try {
      const response = await axios.post(
        "/api/updateUsername",
        { newUsername: name },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setMessage(response.data.message || "");

  
      navigate("/introVideo");
    } catch (error) {
      console.error("Error updating username:", error);
      setMessage(
        error.response
          ? error.response.data.message
          : "Error occurred"
      );
    }
  }



  return (
    <div className="welcome-container">

      {/* Logo */}
      <img src={logo} alt="GritFit Logo" className="welcome-logo" />

      {/* Prompt: "What can I call you?" */}
      <h3 className="welcome-prompt">What can I call you?</h3>
      <input
        className="welcome-input"
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          setMessage("");
        }}
      />

      {/* Goal dropdown */}
      <div className="goal-dropdown-container">
        <select
          className="goal-dropdown"
          value={goal}
          onChange={(e) => {
            setGoal(e.target.value);
            setMessage("");
          }}
        >
          <option value="" disabled>
            Select a goal
          </option>
          <option value="gym">Progress in the gym</option>
          <option value="longevity" disabled>
            Overall longevity (locked)
          </option>
        </select>
      </div>

      {/* Progress bar at 0% */}
      <div className="welcome-progress-bar">
        <div className="welcome-progress-fill" style={{ width: "0%" }}></div>
      </div>
      <p className="progress-label">0%</p>

      {/* Next button */}
      <button className="welcome-next-btn" onClick={handleNext}>
        Next
      </button>

      {/* Show any messages or locked error */}
      {message && <p className="welcome-message">{message}</p>}
      {isLocked && <p className="locked-message">This goal is locked!</p>}
    </div>
  );
}
