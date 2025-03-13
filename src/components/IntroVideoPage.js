import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/GritFit_Full.png";
import backIcon from "../assets/Back.png";
import introVideo from "../assets/GritFit.mp4";
import "../css/IntroVideo.css";
import { ChevronLeft } from 'lucide-react';

export default function IntroVideoPage() {
  const navigate = useNavigate();

  function handleBack() {
    navigate(-1);
  }

  function handleNext() {
    navigate("/finalSteps");
  }

  return (
    <div className="intro-container">

      <ChevronLeft className="intro-back-button" onClick={handleBack} size={40}/> 

      <img src={logo} alt="GritFit Logo" className="intro-logo" />

      {/* Subtext */}
      <p className="intro-subtext">Definitely worth spending a min!</p>

      {/* Video section */}
      <div className="intro-video-wrapper">
        <video className="intro-video-element" controls poster={logo}>
          <source src={introVideo} type="video/mp4" />
          {/* Fallback text */}
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Progress bar at 50% */}
      <div className="intro-progress-bar">
        <div className="intro-progress-fill" style={{ width: "50%" }}></div>
      </div>
      <p className="intro-progress-label">50%</p>

      {/* Next button */}
      <button className="intro-next-btn" onClick={handleNext}>
        Next
      </button>
    </div>
  );
}
