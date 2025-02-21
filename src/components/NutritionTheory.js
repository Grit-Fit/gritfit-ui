import React, { useState } from "react";
import StatusCard from "./StatusCard";
import { ChevronLeft } from "lucide-react";
import logo from "../assets/GritFit_Full.png";
import { useNavigate } from "react-router-dom";
import "../css/NutritionTheory.css";

const NutritionTheory = () => {
  const navigate = useNavigate();
  const [clickedIndex, setClickedIndex] = useState(null);

  const cardData = [
    { text: "Intermittent Fasting", locked: true },
    { text: "If It Fits Your Macros", locked: false },
    { text: "Mediterranean Diet", locked: true },
    { text: "Atkins Diet", locked: true },
    { text: "FODMAP", locked: true },
    { text: "Keto", locked: true },
    { text: "Paleo Diet", locked: true },
    { text: "Whole 30", locked: true },
  ];
  const handleCardClick = (index) => {
    setClickedIndex(index);
    navigate("/selectGoal", {});
  };

  return (
    <div className="theoryContainer">
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

        <h1 className="title-nut">Select a nutrition theory</h1>
        <div style={{ padding: "20px", marginTop: "20px" }}>
          {cardData.map((card, index) => (
            <StatusCard
              key={index}
              text={card.text}
              locked={card.locked}
              onClick={() => handleCardClick(index)}
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

export default NutritionTheory;
