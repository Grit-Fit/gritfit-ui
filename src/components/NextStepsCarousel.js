import React from "react";
import SwipeCarousel from "./SwipeCarousel";
import { useNavigate } from "react-router-dom";
import logo from "../assets/Logo.png"; // Replace with your logo path
import myFitnessPal from "../assets/myFitnessPal.png"; // App icon 1
import healthifyMe from "../assets/healthifyMe.png"; // App icon 2
import nutritionPdf from "../assets/Nutrition101PDF.pdf";
import "./NextStepsCarousel.css"; // Custom styles for your layout
import { getDeviceType } from "./deviceDetection"; // Import device detection utility
import "./NextStepsCarousel.css"; // Custom styles for your layout

const NextStepsCarousel = () => {
  const deviceType = getDeviceType();
  const navigate = useNavigate();
  const appLinks = {
    fitnessPal: {
      android:
        "https://play.google.com/store/apps/details?id=com.myfitnesspal.android&hl=en_IN&pli=1",
      ios: "https://apps.apple.com/us/app/calorie-counter-diet-tracker/id341232718?ign-mpt=uo%3D4",
      desktop: "https://www.myfitnesspal.com/mobile/iphone",
    },
    healthify: {
      android:
        "https://play.google.com/store/apps/details?id=com.healthifyme.basic&hl=en_IN",
      ios: "https://apps.apple.com/in/app/healthifyme-weight-loss-plan/id943712366",
      desktop: "https://www.healthifyme.com/app/",
    },
  };

  const slides = [
    <div>
      <h2 className="step-header">Step 1: What happens next?</h2>
      <p className="step-content">
        Till now you understood what your numbers should ideally look like, but
        it’s difficult to stick to it from day 1. So now we will start taking
        things piece by piece and build this habit.
      </p>
    </div>,
    <div>
      <h2 className="step-header">Step 2: How will I form﻿ the habit?</h2>
      <div className="step-content">
        <p>
          When we start building this habit, you will need a tool that will come
          in very handy. We encourage you to download either - MyFitnessPal or
          HealthifyMe for tracking nutrition value of food items.
          <br />
        </p>
        <div className="icon-row">
          <a
            href={appLinks.fitnessPal[deviceType]}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={myFitnessPal} alt="App 1 Icon" className="app-icon" />
          </a>
          <a
            href={appLinks.healthify[deviceType]}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={healthifyMe} alt="App 2 Icon" className="app-icon" />
          </a>
        </div>
      </div>
    </div>,
    <div>
      <h2 className="step-header">
        Step 3: How can I save what I just learnt?
      </h2>
      <p className="step-content">
        Don't worry! Click the link below to download a pdf, that has all the
        information you need. (Also list of food items to hit your goals)
      </p>
      <br />
      <br />
      <a href={nutritionPdf} download className="downloadButton">
        Nutrition PDF
      </a>
    </div>,
  ];

  const handleNext = () => {
    navigate("/gritPhases", {});
  };

  return (
    <div className="nextStepsContainer">
      {/* Logo at the top */}
      <div className="next-steps-header">
        <img src={logo} alt="Logo" className="logo-centered" />
      </div>

      <SwipeCarousel slides={slides} />

      <button className="nextButton" onClick={handleNext}>
        Next
      </button>
    </div>
  );
};

export default NextStepsCarousel;
