import React, { useState } from "react";
import logo from "../assets/greenLogo.png";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import axios from "../axios";
import "./rightSwipe.css";

const RightSwipe = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { authToken } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const undoSwipe = (e) => {
    e.preventDefault();
    navigate("/gritPhases");
  };

  const doneBtnClick = async (e) => {
    e.preventDefault();

    const { phaseNumber, dayNumber } = location.state || {};

    if (!phaseNumber || !dayNumber) {
      setError("Missing required information");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/userprogressC",
        {
          phaseId: parseInt(phaseNumber),
          taskId: parseInt(dayNumber),
          nutritiontheory: "Intermittent Fasting",
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      console.log("Progress updated successfully:", response.data);
      navigate("/gritPhases");
    } catch (error) {
      console.error("Error updating progress:", error.response?.data);
      setError(error.response?.data?.message || "Failed to update progress");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fullpage">
      <div className="header-rightSwipe">
        <img src={logo} className="logo-rightSwipe" alt="logo" />
        <div className="btn-right">
          <ChevronLeft className="chev" />
          <div className="btn-rightSwipe" onClick={undoSwipe}>
            Undo Swipe
          </div>
        </div>
      </div>
      <div className="body-text">
        Yayy! you did it!
        <br />
        Way to go!!
      </div>
      {error && <div className="error-message">{error}</div>}
      <button
        className="doneBtnRight"
        onClick={doneBtnClick}
        disabled={isLoading}
      >
        {isLoading ? "Updating..." : "Done"}
      </button>
    </div>
  );
};

export default RightSwipe;
