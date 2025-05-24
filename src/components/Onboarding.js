
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "../axios";
import "../css/Welcome.css";     
import logo from "../assets/GritFit_Full.png";
import { ChevronLeft } from 'lucide-react';
import "../css/IntroVideo.css";

const steps = [
  {
    key: "goal",
    type: "single",
    prompt: "What’s your current fitness goal?",
    options: ["Build muscle", "Lose fat", "Maintain & build habit", "Just exploring"],
  },
  {
    key: "struggle",
    type: "multi",
    prompt: "Where do you struggle most?",
    options: [
      "Eating enough protein",
      "Staying consistent",
      "Planning ahead",
      "Emotional eating / cravings",
      "All of the above",
      "Not sure",
    ],
  },
  {
    key: "success",
    type: "single",
    prompt: "What would be a success for you?",
    options: [
      "Building a habit I can stick to",
      "Learning how to eat better",
      "Showing up daily without guilt",
      "Just figuring things out",
    ],
  },
  {
    key: "motivation",
    type: "multi",
    prompt: "What may keep you coming back daily?",
    options: [
      "In-app rewards",
      "Streak increase",
      "Community accountability",
      "Having a clear plan to follow",
      "Other",
    ],
  },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const { accessToken } = useAuth();

  const [idx, setIdx] = useState(0);
  const [form, setForm] = useState({});
  const [error, setError] = useState("");

  const step = steps[idx];

  /* ---------- helpers ---------- */
  const next = async () => {
    const ans = form[step.key];
    const empty =
      (step.type === "single" && !ans) ||
      (step.type === "multi" && (!ans || ans.length === 0));
    if (empty) return setError("Please choose an option");

    setError("");
    if (idx < steps.length - 1) return setIdx(idx + 1);

    // last screen – POST to backend then move to intro
    try {
      await axios.post(
        "/api/onboardingAnswers",
        { answers: form },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
    } catch (e) {
      console.error(e);
      // even if it fails let user proceed
    }
    navigate("/introVideo");
  };

  const toggleOpt = (opt) => {
    if (step.type === "single") return setForm({ ...form, [step.key]: opt });

    const prev = form[step.key] || [];
    const nextArr = prev.includes(opt)
      ? prev.filter((o) => o !== opt)
      : [...prev, opt];
    setForm({ ...form, [step.key]: nextArr });
  };

    function handleBack() {
    navigate(-1);
  }

  /* ---------- render ---------- */
  return (
    <div className="welcome-container">
              <ChevronLeft className="intro-back-button" onClick={handleBack} size={40}/>
      <img src={logo} alt="GritFit Logo" className="welcome-logo" />

      <h3 className="welcome-prompt" style={{textAlign: "center"}}>{step.prompt}</h3>

      <div className="options-wrapper">
        {step.options.map((opt) => {
          const selected =
            step.type === "single"
              ? form[step.key] === opt
              : (form[step.key] || []).includes(opt);
          return (
            <label key={opt} className="option-row">
              <input
                type={step.type === "single" ? "radio" : "checkbox"}
                name={step.key}
                value={opt}
                checked={selected}
                onChange={() => toggleOpt(opt)}
              />
              {opt}
            </label>
          );
        })}
      </div>

      {/* Progress bar at 50% */}
      <div className="intro-progress-bar">
        <div className="intro-progress-fill" style={{ width: "25%" }}></div>
      </div>
      <p className="intro-progress-label">25%</p>

      {error && <p className="welcome-message">{error}</p>}

      <button className="welcome-next-btn" onClick={next}>
        {idx === steps.length - 1 ? "Next" : "Next"}
      </button>
    </div>
  );
}
