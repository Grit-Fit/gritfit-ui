import React, { useState } from "react";
import { ChevronLeft } from "lucide-react";
import logo from "../assets/GritFit_Full.png";
import { useNavigate, useLocation } from "react-router-dom";
import "../css/CalorieDisplay.css";
import "../css/NutritionTheory.css";

const CalorieDisplay = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { maintenanceCal, macros, calGoal } = location.state || {};
  // Determine title, paragraph, and calorie adjustment based on calGoal
  let title = "";
  let paragraph = "";
  let adjustedCalories = maintenanceCal;

  switch (calGoal) {
    case "Surplus":
      title = "Calorie Surplus";
      paragraph =
        "As you intend to increase your weight, we want to ensure you are going down a calculated way forward. Our goal is to maximize muscle gain and minimize fat gain, so we recommend you increase your daily calorie intake by 500. Hence, below is the number of calories you should be consuming each day.";
      adjustedCalories += 500;
      break;
    case "Deficit":
      title = "Calorie Deficit";
      paragraph =
        "As you intend to lose your weight, we want to ensure you are going down a calculated way forward. Our goal is to maximize fat loss and minimize muscle loss, so we recommend you decrease your daily calorie intake by 500. Hence, below is the number of calories you should be consuming each day.";
      adjustedCalories -= 500;
      break;
    case "Maintenance":
      title = "Calorie Maintenance";
      paragraph =
        "As you intend to maintain your current weight, we recommend you stick to the maintenance calories.";
      break;
    default:
      title = "Calorie Maintenance";
      paragraph =
        "As you intend to maintain your current weight, we recommend you stick to the maintenance calories.";
  }

  const handleNext = () => {
    if (adjustedCalories !== maintenanceCal) {
      const proteinCalories = adjustedCalories * 0.25;
      const carbCalories = adjustedCalories * 0.5;
      const fatCalories = adjustedCalories * 0.25;

      const macrosData = {
        protein: Math.round(proteinCalories / 4),
        carbs: Math.round(carbCalories / 4),
        fats: Math.round(fatCalories / 9),
      };

      navigate("/displayTargetCalories", {
        state: {
          targetCal: adjustedCalories,
          macros: macrosData,
        },
      });
    } else {
      navigate("/displayTargetCalories", {
        state: {
          targetCal: maintenanceCal,
          macros: macros,
        },
      });
    }
  };
  const NumberFormatter = ({ number }) => {
    const formatNumber = (num) => {
      return num.toLocaleString("en-US") + " cal";
    };

    return <div>{formatNumber(number)}</div>;
  };
  console.log("Maintenance Cal: ", maintenanceCal);
  console.log("Macros: ", macros);

  return (
    <div className="calDisplayContainer">
      <div className="contentWrapper">
        <div className="theory-header">
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

        <h1 className="title">Maintenance Calories</h1>
        <p className="description">
          This is the amount of calories you need to consume to maintain your
          current body weight.
        </p>
        <div className="calorieValue">
          <NumberFormatter number={maintenanceCal} />
        </div>

        <h1 className="title">{title}</h1>
        <p className="description">{paragraph}</p>
        <div className="calorieValue">
          <NumberFormatter number={adjustedCalories} />
        </div>

        <p class="helperText">
          Disclaimer: Always consult a healthcare professional before making significant changes to your diet or exercise routine. We're here for primary education and suggestions, not medical advice!
        </p>

        <button
          className="calculateButton"
          onClick={handleNext}
          aria-label="Display Target"
        >
          Got It!
        </button>
      </div>
    </div>
  );
};

export default CalorieDisplay;
