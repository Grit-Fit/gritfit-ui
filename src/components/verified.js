// src/components/Verified.js
import React from "react";
import { useNavigate } from "react-router-dom";

const Verified = () => {
  const navigate = useNavigate();

  const handleContinue = () => {
    // If you want them to sign in after verifying,
    // you could navigate("/login"), or directly to /welcome if you want:
    navigate("/welcome");
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Congratulations!</h1>
      <p>Your email has been verified.</p>
      <button onClick={handleContinue}>Continue</button>
    </div>
  );
};

export default Verified;
