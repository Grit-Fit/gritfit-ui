import React, { useState } from "react";
import StatusCard from "./StatusCard";
import { ChevronLeft } from "lucide-react";
import logo from "../assets/GritFit_Full.png";
import { useNavigate } from "react-router-dom";
import "../css/GymGoal.css";
import "../css/NutritionTheory.css";

const GymGoal = () => {
  const navigate = useNavigate();
  const [clickedIndex, setClickedIndex] = useState(null);
  const [showInfo, setShowInfo] = useState(false); // State to toggle info text visibility

  const cardData = [
    { text: "Cutting", locked: false },
    { text: "Bulking", locked: false },
    { text: "Maintaining", locked: false },
  ];

  const goalMapping = {
    "Bulking": "Surplus", // Bulking -> Surplus
    "Cutting": "Deficit", // Cutting -> Deficit
    "Maintaining": "Maintenance" // Maintaining -> Maintenance
  };

  const handleCardClick = (index, goal) => {
    setClickedIndex(index);
    navigate("/calorieCalc", {
        state: {
            calGoal: goalMapping[goal],
        },
  });
  };

  const handleInfoClick = () => {
    setShowInfo((prevState) => !prevState); // Toggle visibility of the info text

    // Hide the info after 5-10 seconds
    if (!showInfo) {
      setTimeout(() => {
        setShowInfo(false);
      }, 5000); // Change to 10000 for 10 seconds if needed
    }
  };

  return (
    <div className="goalContainer">
      <div className="contentWrapper">
        <div className="goal-header">
          <div>
            <ChevronLeft
              className="chevron-left"
              onClick={() => window.history.back()} // Use your routing method for navigation
            />
          </div>
          <div className="logo-container-nut">
            <img src={logo} alt="Logo" className="logo-gritPhases-nut" />
          </div>
        </div>

        <div className="goal-selection-header">
          <h1 className="title">Select your goal</h1>
          <button
            className="info-icon"
            onClick={handleInfoClick}
            aria-label="Info"
          >
            i
          </button>
        </div>

        {/* Show info text if showInfo is true */}
        {showInfo && (
          <div className="info-text">
            <p>
              <strong>Cutting:</strong> Reduce body fat while maintaining muscle
              mass through a calorie deficit and high-protein diet.
            </p>
            <p>
              <strong>Bulking:</strong> Focus on muscle growth by consuming a
              calorie surplus with a balanced diet and strength training.
            </p>
            <p>
              <strong>Maintaining:</strong> Keep current body composition by
              balancing calorie intake with expenditure to avoid fat gain or
              muscle loss.
            </p>
          </div>
        )}

        <div style={{ padding: "20px", marginTop: "50px" }}>
          {cardData.map((card, index) => (
            <StatusCard
              key={index}
              text={card.text}
              locked={card.locked}
              onClick={() => handleCardClick(index, card.text)}
              className={
                clickedIndex === index && !card.locked ? "clicked" : ""
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default GymGoal;
