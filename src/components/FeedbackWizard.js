import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "../axios";
import "../css/FeedbackWizard.css";   
import "../css/Welcome.css";     
import logo from "../assets/GritFit_Full.png";
import { ChevronLeft, Lightbulb } from 'lucide-react';   
import "../css/NextStepsCarousel.css";


export default function FeedbackWizard({ onClose }) {
  const [step, setStep]       = useState(1);   
  const [progress, setProg]   = useState(0);   
    const navigate = useNavigate();
    const { accessToken } = useAuth();

  /* keep a consistent teal for buttons */
  const tealBtn = {
    background:"#00d0e6",
    border:"none",
    color:"#fff",
    fontWeight:600,
    padding:"10px 14px",
    borderRadius:4,
    cursor:"pointer"
  };

  /* advance helper */
  const next = () => {
    setStep(s => Math.min(s + 1, 3));
    setProg(p => p + 50);        // goes 0 → 50 → 100
  };

  /* ------------- individual cards ------------- */
  const Step1 = () => (
    <>
      <p>
        If you got value using <strong>GritFit</strong>, please leave us a tiny
        testimonial. It encourages us to keep building &amp; improving the app.
      </p>
      <div className="fw-btn-row">
        <button style={tealBtn} onClick={() => {
          window.open("https://forms.gle/gritfit-testimonial", "_blank");
          next();
        }}>Write</button>
        <button className="fw-skip" onClick={next}>Skip</button>
      </div>
    </>
  );

const Step2 = () => {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <>
      <p>
        We really appreciate your participation and want to invite you to our
        <strong> Strategy Squad</strong>. Interested?
      </p>
      <div className="fw-btn-row">
        <button className="app-button" onClick={() => {
          window.open("https://chat.whatsapp.com/gritfit-strategy", "_blank");
          next();
        }}>
          Tell me more!
        </button>
        <Lightbulb
          size={40}
          style={{ marginLeft: "10px", cursor: "pointer" }}
          onClick={() => setShowInfo(prev => !prev)}
          color="#4facfe"
        />
      </div>
      {showInfo && (
        <div className="strategy-info-bubble">
          Strategy Squad is a small, invite-only WhatsApp group where you help shape GritFit's future. No commitment — just honest input on new ideas!
        </div>
      )}
    </>
  );
};


  const Step3 = () => (
    <>
      <p>
        We’d love to connect with you to learn about your experience – pick any
        slot that works:
      </p>
      <button style={tealBtn} onClick={() => {
        window.open("https://calendly.com/gritfit/brief-call", "_blank");
        setProg(100);
      }}>20 min brief call with Founder</button>
    </>
  );

      function handleBack() {
    navigate(-1);
  }

  /* ------------- main render ------------- */
  return (
    <>
            <img src={logo} alt="GritFit Logo" className="welcome-logo" style={{marginBottom: "0rem"}} />
            <ChevronLeft className="intro-back-button" onClick={handleBack} size={40}/>
            <h3 className="welcome-prompt" style={{textAlign: "center"}}>{step.prompt}</h3>

      <div style={{ textAlign:"left", marginTop:24, maxWidth:300 }}>

        <div className="fw-timeline">
          {[1,2,3].map(n => (
            <div key={n} className={n<=step ? "fw-dot done" : "fw-dot"}>{n}</div>
          ))}
          <div className="fw-line1"/>
          <div className="fw-line2"/>
        </div>

{/* step content */}
{step===1 && (
  <>
    <div className="fw-timeline">
      {/* dots + line already rendered above */}
    </div>

    <div className="fw-copy1">
      <Step1/>
    </div>
  </>
)}
{step===2 && (
  <>
    <div className="fw-timeline"/>
    <div className="fw-copy2"><Step2/></div>
  </>
)}
{step===3 && (
  <>
    <div className="fw-timeline"/>
    <div className="fw-copy3"><Step3/></div>
  </>
)}



        {/* Done button */}
        {progress===100 && (
          <button className="done-btn" style={{ marginTop:20 }}
                  onClick={onClose}>
            Done!
          </button>
        )}
      </div>
      </>
  );
}
