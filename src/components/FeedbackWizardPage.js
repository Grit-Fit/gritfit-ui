import React from "react";
import { useNavigate } from "react-router-dom";
import FeedbackWizard from "../components/FeedbackWizard";
import "../css/Welcome.css";  
import "../css/NextStepsCarousel.css";         //  reuse existing styles

export default function FeedbackWizardPage() {
  const navigate = useNavigate();
  return (
    <div className="welcome-container" style={{paddingBottom: "1.6rem"}} >
      <FeedbackWizard onClose={() => navigate("/cardView", { replace:true })}/>
    </div>
  );
}
