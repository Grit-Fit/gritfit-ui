import React, { useState, useEffect } from "react";
import logo from "../assets/logo1.png";
import sick from "../assets/sickk.png";
import cheatDay from "../assets/cheatt.png";
import lm from "../assets/loww.png";
import busy from "../assets/busyy.png";
import other from "../assets/otherr.png";
import { Redo2 } from "lucide-react";
import "../css/leftSwipe.css";
import "../css/CardView.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "../axios";

const LeftSwipe = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { accessToken, refreshAuthToken } = useAuth();
  const [selectedButton, setSelectedButton] = useState(null);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [otherReason, setOtherReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get phase and task from navigation state
  const { phaseNumber, taskId } = location.state || {};
  const phaseId = parseInt(phaseNumber);
  // Check its type and value

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

  const handleButtonClick = (buttonName, image) => {
    setSelectedButton({ name: buttonName, image: image });
  };

  const handleGoalSelection = (goal) => {
    setSelectedGoal(goal);
  };

  const getReasonText = (buttonName) => {
    switch (buttonName) {
      case "sick":
        return "Feeling unwell";
      case "less_motivation":
        return "Lack of motivation";
      case "cheatDay":
        return "Cheat day";
      case "busy":
        return "Too busy";
      case "other":
        return otherReason.trim();
      default:
        return "";
    }
  };

  const doneBtnClick = async (e) => {
    e.preventDefault();
    console.log("Leftswipe done button clicked.");
    const { phaseNumber, dayNumber } = location.state || {};

    if (!phaseNumber || !dayNumber) {
      setError("Missing required information");
      return;
    }
    if (phaseId === 3 && !selectedGoal) {
      setError("Please select a goal you were unable to achieve.");
      return;
    }
    console.log("Phase and Day, ", phaseNumber);
    setIsLoading(true);
    setError(null);
    try {
      const reason = getReasonText(selectedButton.name);

      const requestData = {
        phaseId: parseInt(phaseNumber),
        taskId: parseInt(dayNumber),
        reasonForNonCompletion: reason,
        failedGoal: null,
      };

      if (phaseId === 3) {
        requestData.failedGoal = selectedGoal; // Include goal in phase 3
      }

      // console.log("🚀 Sending request to:", "http://localhost:5050/api/userprogressNC");
      // console.log("📦 Request Data:", requestData);
      
      const response = await axios.post(
        "/api/userprogressNC",
        requestData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      console.log("Success:", response.data);
      // let phaseNumb,
      //   dayNumb = 0;
      // if (
      //   (parseInt(phaseNumber) % 3 !== 0 && parseInt(dayNumber) === 5) ||
      //   (parseInt(phaseNumber) % 3 === 0 && parseInt(dayNumber) === 4)
      // ) {
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
      navigate("/cardView", {
        state: {
          phase: parseInt(phaseNumber),
          day: parseInt(dayNumber),
          rightSwipe: false,
          leftSwipe: true,
        },
      });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleOtherReasonChange = (e) => {
    setOtherReason(e.target.value);
  };

  return (
    <div className="fullpage-left">
            <header className="gritphase-header">
            <img src={logo} alt="Logo" className="logo-gritPhases-task" />

            <div className="undo_swipe_btn" onClick={undoSwipe}>
              Undo Swipe <Redo2 className="c" />
            </div>
      </header>
      
      <div className="body-leftSwipe">
        {!selectedGoal && phaseId === 3 ? (
          <div className="goal-selection">
            <div className="body_text">
              <h2>Which goal were you unable to achieve?</h2>
            </div>
            <div className="goal-buttons">
              <button
                className="goalBtn"
                onClick={() => handleGoalSelection("Protein Goal")}
              >
                Protein Goal
              </button>
              <br />
              <h3> OR </h3>
              <br />
              <button
                className="goalBtn"
                onClick={() => handleGoalSelection("Fat Goal")}
              >
                Fat Goal
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="body_text">
            It's okay! What was your biggest hurdle today?
            </div>

            {!selectedButton ? (
              <div className="body_images">
              <div className="reason-card" onClick={() => handleButtonClick("sick", sick)}>
                <img src={sick} alt="Sick" className="reason-icon" />
                <span className="reason-label">Sick</span>
              </div>
            
              <div className="reason-card" onClick={() => handleButtonClick("less_motivation", lm)}>
                <img src={lm} alt="Low Motivation" className="reason-icon" />
                <span className="reason-label">Low Motivation</span>
              </div>
            
              <div className="reason-card" onClick={() => handleButtonClick("cheatDay", cheatDay)}>
                <img src={cheatDay} alt="Cheat Day" className="reason-icon" />
                <span className="reason-label">Cheat Day</span>
              </div>
            
              <div className="reason-card" onClick={() => handleButtonClick("busy", busy)}>
                <img src={busy} alt="Busy" className="reason-icon" />
                <span className="reason-label">Busy</span>
              </div>
            
              <div className="reason-card" onClick={() => handleButtonClick("other", other)}>
                <img src={other} alt="Other" className="reason-icon" />
                <span className="reason-label">Other</span>
              </div>
            </div>
            
            ) : (
              <div className="selected-button-container">
                {selectedButton.name !== "other" && (
                  <img
                    src={selectedButton.image}
                    alt={selectedButton.name}
                    className="selected-button"
                  />
                )}
                <div className="its-ok-text">
                  {selectedButton.name === "other" ? (
                    <div className="other-reason-container">
                      <input
                        type="text"
                        value={otherReason}
                        onChange={handleOtherReasonChange}
                        placeholder="Please specify your reason..."
                        className="other-reason-input"
                        autoFocus
                      />
                    </div>
                  ) : (
                    <>
                      That's OK!
                      <br />
                      Let us try again tomorrow!
                    </>
                  )}
                </div>
                <button
                  className="doneBtn pulse-button"
                  onClick={doneBtnClick}
                  disabled={isLoading}
                >
                  {isLoading ? "Updating..." : "Done"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default LeftSwipe;
