import React, { useState } from "react";
import logo from "../assets/red_logo.png";
import sick from "../assets/sick.png";
import cheatDay from "../assets/cheat_day.png";
import lm from "../assets/less_motivation.png";
import busy from "../assets/busy.png";
import other from "../assets/other.png";
import { ChevronRight } from "lucide-react";
import "./leftSwipe.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const LeftSwipe = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { authToken } = useAuth();
  const [selectedButton, setSelectedButton] = useState(null);
  const [otherReason, setOtherReason] = useState("");

  // Get phase and task from navigation state
  const { phaseId, taskId } = location.state || {};

  const undoSwipe = (e) => {
    e.preventDefault();
    navigate("/gritPhases");
  };

  const handleButtonClick = (buttonName, image) => {
    setSelectedButton({ name: buttonName, image: image });
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

    try {
      const reason = getReasonText(selectedButton.name);

      const response = await axios.post(
        "http://localhost:5000/api/userprogressNC",
        {
          phaseId,
          taskId,
          reasonForNonCompletion: reason,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      console.log("Success:", response.data);
      navigate("/gritPhases");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleOtherReasonChange = (e) => {
    setOtherReason(e.target.value);
  };

  return (
    <div className="fullpage-left">
      <header className="header-left">
        <img src={logo} alt="logo" className="logo-left" />
        <div className="undo_swipe_btn" onClick={undoSwipe}>
          Undo Swipe <ChevronRight className="c" />
        </div>
      </header>

      <div className="body-leftSwipe">
        <div className="body_text">
          What prevented you from completing your goal?
        </div>

        {!selectedButton ? (
          <div className="body_images">
            <img
              src={sick}
              alt="sick"
              onClick={() => handleButtonClick("sick", sick)}
            />
            <img
              src={lm}
              alt="less_motivation"
              onClick={() => handleButtonClick("less_motivation", lm)}
            />
            <img
              src={cheatDay}
              alt="cheatDay"
              onClick={() => handleButtonClick("cheatDay", cheatDay)}
            />
            <img
              src={busy}
              alt="busy"
              onClick={() => handleButtonClick("busy", busy)}
            />
            <img
              src={other}
              alt="other"
              onClick={() => handleButtonClick("other", other)}
            />
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
              className="doneBtn"
              onClick={doneBtnClick}
              disabled={selectedButton.name === "other" && !otherReason.trim()}
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeftSwipe;
