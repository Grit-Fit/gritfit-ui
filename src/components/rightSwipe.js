import React, { useState, useEffect } from "react";
import logo from "../assets/greenLogo.png";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import axios from "../axios";
import "./rightSwipe.css";

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
      console.log("Access Token: ", accessToken)
      const response = await axios.post(
        "http://localhost:5050/api/userprogressC",
        {
          phaseId: parseInt(phaseNumber),
          taskId: parseInt(dayNumber),
          nutritiontheory: "If It Fits Your Macros",
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      console.log("Progress updated successfully:", response.data);
      // let phaseNumb, dayNumb = 0;
      // if( (parseInt(phaseNumber) % 3 !== 0  && parseInt(dayNumber) === 5) ||  (parseInt(phaseNumber) % 3 === 0  && parseInt(dayNumber) === 4)) {
      //   phaseNumb = parseInt(phaseNumber) + 1;
      //   dayNumb = 1;
      // } else {
      //   phaseNumb = parseInt(phaseNumber);
      //   dayNumb = parseInt(dayNumber) + 1;
      // }

      // const startProgressResponse = await axios.post(
      //   "http://localhost:5050/api/userprogressStart",
      //   {
      //     phaseId: phaseNumb,
      //     taskId: dayNumb,
      //   },
      //   {
      //     headers: {
      //       Authorization: `Bearer ${accessToken}`,
      //     },
      //   }
      // );
      // console.log("Start Progress: ", startProgressResponse.data);
      navigate("/gritPhases", {
        state: {
          phase: parseInt(phaseNumber),
          day: parseInt(dayNumber),
          rightSwipe: true,
          leftSwipe: false,
        },
      }
      );
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
