import React, { useState, useEffect } from "react";
import logo from "../assets/logo1.png";
import { useNavigate, useLocation } from "react-router-dom";
import { Undo2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import axios from "../axios";
import "../css/rightSwipe.css";
import "../css/CardView.css";

const RightSwipe = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { accessToken, refreshAuthToken } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // If there is no accessToken, try to refresh it by calling the backend refresh route
    if (!accessToken) {
      refreshAuthToken(); // Refresh token by making API call to the backend
    }
  }, [accessToken, refreshAuthToken]);

  const undoSwipe = (e) => {
    e.preventDefault();
    navigate("/cardView");
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
      console.log("Access Token: ", accessToken)
      console.log("phaseNumber:", phaseNumber, "dayNumber:", dayNumber);

      const response = await axios.post("/api/userprogressC", {
        phaseId: phaseNumber,
        taskId: dayNumber,
      }, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
  
      console.log("Progress updated successfully:", response.data);
  
      navigate("/cardView", {
        state: {
          phase: parseInt(phaseNumber),
          day: parseInt(dayNumber),
          rightSwipe: true,
          leftSwipe: false,
        },
      });
    } catch (error) {
      console.error("Error updating progress:", error.response?.data);
      setError(error.response?.data?.message || "Failed to update progress");
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className="fullpage">
      <header className="gritphase-header">
            <img src={logo} alt="Logo" className="logo-gritPhases-task" />

            <div className="undo_swipe_btn" onClick={undoSwipe}>
              Undo Swipe <Undo2 className="c" />
            </div>
      </header>
  
      {/* Animated Success Message */}
      <div className="body-text">
         <span className="highlight-text">Yayy! You did it!</span> 🎊
        <br />
        <span className="sub-text">Way to go!!</span>
      </div>
  
      {/* Error Message (if any) */}
      {error && <div className="error-message">{error}</div>}
  
      {/* Done Button with Pulse Animation */}
      <button
        className="doneBtnRight pulse-button"
        onClick={doneBtnClick}
        disabled={isLoading}
      >
        {isLoading ? "Updating..." : "🎯 Done"}
      </button>
    </div>
  );
  
};

export default RightSwipe;
