// src/components/FinalStepsPage.js

import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/GritFit_Full.png";
import backIcon from "../assets/Back.png";
import "../css/FinalSteps.css";

// Example app link data
const appLinks = {
  fitnessPal: {
    android:
      "https://play.google.com/store/apps/details?id=com.myfitnesspal.android&hl=en_IN&pli=1",
    ios: "https://apps.apple.com/us/app/calorie-counter-diet-tracker/id341232718",
    desktop: "https://www.myfitnesspal.com/mobile/iphone",
  },
  healthify: {
    android:
      "https://play.google.com/store/apps/details?id=com.healthifyme.basic&hl=en_IN",
    ios: "https://apps.apple.com/in/app/healthifyme-weight-loss-plan/id943712366",
    desktop: "https://www.healthifyme.com/app/",
  },
};

// Optional function to detect platform (Android/iOS/Desktop)
function detectPlatform() {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  if (/android/i.test(userAgent)) {
    return "android";
  }
  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    return "ios";
  }
  return "desktop";
}

export default function FinalStepsPage() {
  const navigate = useNavigate();

  // For the back arrow
  function handleBack() {
    navigate(-1);
  }

  // For the "Done!" button
  function handleDone() {
    navigate("/terms");
  }

  // For "My FitnessPal" button
  function openFitnessPal() {
    const platform = detectPlatform();
    const link = appLinks.fitnessPal[platform];
    window.open(link, "_blank");
  }

  // For "Healthify Me" button
  function openHealthify() {
    const platform = detectPlatform();
    const link = appLinks.healthify[platform];
    window.open(link, "_blank");
  }

  return (
    <div className="final-steps-container">
      {/* (Optional) Back arrow */}
      <button className="intro-back-button" onClick={handleBack}>
        <img src={backIcon} alt="Back" className="intro-back-icon" />
      </button>

      {/* Logo */}
      <img src={logo} alt="GritFit Logo" className="intro-logo" />

      <div className="steps-wrapper">
        <div className="step-item">
          <div className="step-circle">1</div>
          <div className="step-text">
            <p>
              Download a calorie tracking app (it will help you on this journey)
            </p>
            <div className="app-buttons">
              <button className="app-btn" onClick={openFitnessPal}>
                My FitnessPal
              </button>
              <button className="app-btn" onClick={openHealthify}>
                Healthify Me
              </button>
            </div>
          </div>
        </div>


        <div className="step-item">
          <div className="step-circle">2</div>
          <div className="step-text">
            <p>
              Relax! Downloading this app doesn’t mean hitting all the goals
              from day 1.
            </p>
          </div>
        </div>


        <div className="step-item">
          <div className="step-circle">3</div>
          <div className="step-text">
            <p>
              Trust the process of GritFit and remain consistent. You got this!
            </p>
          </div>
        </div>
      </div>


      <div className="intro-progress-bar">
        <div className="intro-progress-fill" style={{ width: "100%" }}></div>
      </div>
      <p className="intro-progress-label">100%</p>


      <button className="intro-next-btn" onClick={handleDone}>
        Done!
      </button>
    </div>
  );
}
