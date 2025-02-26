import React, { useState, useEffect } from "react";
import SwipeCarousel from "./SwipeCarousel";
import { useNavigate } from "react-router-dom";
import logo from "../assets/GritFit_Full.png"; 
import myFitnessPal from "../assets/myFitnessPal.png"; 
import healthifyMe from "../assets/healthifyMe.png"; 
import nutritionPdf from "../assets/Nutrition101PDF.pdf";
import "../css/NextStepsCarousel.css"; 
import { getDeviceType } from "./deviceDetection"; 
import "../css/NutritionTheory.css";
import GeneratePdf from "./GeneratePdfButton";
import axios from "../axios";
import { useAuth } from "../context/AuthContext";


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

  const { accessToken } = useAuth();
  const [maintenance, setMaintenance] = useState(null);
  const [macros, setMacros] = useState(null);

  useEffect(() => {
    const fetchUserNutrition = async () => {
      try {
        const response = await axios.get("/api/getUserNutrition", {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        if (response.data?.data) {
          const userData = response.data.data;

          // Suppose userData has userData.maintenance_calories, etc.
          const m = userData.maintenance_calories;
          setMaintenance(m);

          // optional: derive macros or store them in DB, whichever
          // e.g. if you do the same 25/50/25 split:
          if (m) {
            const proteinCalories = m * 0.25;
            const carbCalories = m * 0.5;
            const fatCalories = m * 0.25;
            setMacros({
              protein: Math.round(proteinCalories / 4),
              carbs: Math.round(carbCalories / 4),
              fats: Math.round(fatCalories / 9),
            });
          }
        }
      } catch (error) {
        console.error("Error fetching user data for carousel:", error);
      }
    };

    if (accessToken) {
      fetchUserNutrition();
    }
  }, [accessToken]);
  
  const handleNext = () => {
    navigate("/gritPhases", {});
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
        <div className="button-column">
          <a
            href={appLinks.fitnessPal[deviceType]}
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="app-button">MyFitnessPal</button>
          </a><br />
          <a
            href={appLinks.healthify[deviceType]}
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="app-button">HealthifyMe</button>
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
        information you need.<br /> (Also list of food items to hit your goals)
      </p>
      <br />
      <a href={nutritionPdf} download className="downloadButton">
        Nutrition 101 PDF ⬇️
      </a>

      <div>
      {/* The rest of your NextStepsCarousel code */}

      {maintenance && macros && (
        <GeneratePdf
          userName="Jane Doe"  // Or fetch username from DB as well
          maintenanceCalories={maintenance}
          macros={macros}
        />
      )}
    </div>

      <button className="nextButton" onClick={handleNext}>
        Next
      </button>

    </div>,
  ];


  return (
    <div className="nextStepsContainer">
      {/* Logo at the top */}
      <div className="theory-header">
        <div class = "logo-container-nut">
          <img src={logo} alt="Logo" className="logo-gritPhases-nut" />
        </div>
      </div>

      <SwipeCarousel slides={slides} />

     {/* <button className="nextButton" onClick={handleNext}>
        Next
      </button> */}
    </div>
  );
};

export default NextStepsCarousel;
