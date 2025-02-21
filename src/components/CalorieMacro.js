import React, { useState } from "react";
import { ChevronLeft, ChevronDown, ChevronRight } from "lucide-react";
import logo from "../assets/GritFit_Full.png";
import { useNavigate, useLocation } from "react-router-dom";
import "../css/CalorieMacro.css";

const CalorieMacro = () => {
  const macroData = {
    protein: [
      {
        id: "calculation",
        question: "How to calculate protein according to my weight?",
        answer:
          " You should aim to consume at least 1 gm of protein per lb of bodyweight, per day. For example if you weigh 160 lbs, then you should get 160 grams of protein in total from all your meals",
      },
      {
        id: "importance",
        question: "Why is protein important?",
        answer:
          "Protein is essential for building and repairing tissues, producing enzymes and hormones, and supporting overall muscle and immune function.",
      },
    ],
    carbs: [
      {
        id: "calculation",
        question: "How to calculate carbohydrates according to my weight?",
        answer:
          "You should aim to consume 2-3 grams of carbohydrates per lb of body weight per day. For example, if you weigh 160 lbs, then you should get 320-480 grams of carbohydrates in total from all your meals.",
      },
      {
        id: "importance",
        question: "Why are carbohydrates important?",
        answer:
          "Carbohydrates are the body's primary source of energy, fueling daily activities and vital bodily functions.",
      },
    ],
    fats: [
      {
        id: "calculation",
        question: "How to calculate fat according to my weight?",
        answer:
          "You should aim to consume about 0.4-0.5 grams of fat per lb of body weight per day. For example, if you weigh 160 lbs, then you should get 64-80 grams of fat in total from all your meals.",
      },
      {
        id: "importance",
        question: "Why is fat important?",
        answer:
          " Fats are crucial for energy, hormone production, brain function, and absorbing essential vitamins.",
      },
    ],
  };
  const location = useLocation();
  const { macroType, macroValue, calorie } = location.state || {};
  const [activeIndex, setActiveIndex] = useState(0);

  const handleAccordionToggle = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };
  const NumberFormatter = ({ number }) => {
    const formatNumber = (num) => {
      return num.toLocaleString("en-US") + " cal";
    };

    return <div>{formatNumber(number)}</div>;
  };

  const data = macroData[macroType] || [];

  return (
    <div className="macroDetailsContainer">
      <div className="macro-header">
        <img src={logo} alt="Logo" className="logo-centered" />
      </div>
      <p className="targetCalories">Target Calorie</p>
      <h1 className="calorieAmount">
        <NumberFormatter number={calorie} />
      </h1>
      <button className="backButton" onClick={() => window.history.back()}>
        <ChevronLeft />
        <span className="backText">Back</span>
      </button>
      <div className="card" aria-label="Nutrient Information">
        <div className="accordion-header">
          <h2 className="nutrientName">
            {macroType.charAt(0).toUpperCase() + macroType.slice(1)}
          </h2>
          <div className="amount">{macroValue}</div>
        </div>
        <hr className="divider" />

        {data.map((section, index) => (
          <div key={index} className="accordionItem">
            <div
              className="accordionButton"
              onClick={() => handleAccordionToggle(index)}
            >
              <span>{section.question}</span>
              <span>
                {activeIndex === index ? (
                  <ChevronDown className="icon" />
                ) : (
                  <ChevronRight className="icon" />
                )}
              </span>
            </div>
            {activeIndex === index && (
              <div className="accordionContent">
                    <p className="answer">{section.answer}</p>
               </div>
            )}
            
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalorieMacro;
