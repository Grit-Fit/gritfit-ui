import React, { useState } from "react";
import { ChevronLeft } from "lucide-react";
import logo from "../assets/Logo.png";
import { useNavigate, useLocation } from "react-router-dom";
import "./CalorieTarget.css";

const CalorieTarget = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { targetCal, macros } = location.state || {};
  console.log("Macros: ", macros)
  const handleNext = () => {
    navigate('/nextSteps', {});
  };

  const NumberFormatter = ({ number }) => {
    const formatNumber = (num) => {
      return num.toLocaleString("en-US") + " cal";
    };

    return <div>{formatNumber(number)}</div>;
  };
  console.log("Maintenance Cal: ", targetCal);
  console.log("Macros: ", macros);
  const handleCardClick = (macro, value) => {
    navigate(`/macros`, {
        state: {
          macroType: macro,
          macroValue: value + " gms",
          calorie: targetCal,
        },
      });
  };

  return (
    <div className="calDisplayContainer">
      <div className="contentWrapper">
        <div className="target-header">
          <div>
            <ChevronLeft
              className="chevron-left"
              onClick={() => window.history.back()} // Use your routing method for navigation
            />
          </div>
          <div className="logo-container">
            <img src={logo} alt="Logo" className="logo-gritPhases" />
          </div>
        </div>

        <h1 className="title">Target Calories</h1>
        <div className="calorieValue">
          <NumberFormatter number={targetCal} />
        </div>

        <h2 className="macroTitle">
          Macro nutrient split for your target calories
        </h2>

        <div className="macroCardsContainer">
          {Object.entries(macros).map(([macro, value], index) => (
            <div key={macro} className="macroCardWrapper" onClick={() => handleCardClick(macro, value)}>
              <div className="macroCard">
                <div className="macroValue">{value}</div>
                <div className="macroUnit">gms</div>
              </div>
              <div className="macroLabel">
                {macro.charAt(0).toUpperCase() + macro.slice(1)}
              </div>
            </div>
          ))}
        </div>

        <p className="helperText">
          (Click on the respective macro cards to see more information about the
          macro nutrient.)
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

export default CalorieTarget;
