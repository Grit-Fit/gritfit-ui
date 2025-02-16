import React, { useState } from "react";
import { ChevronRight } from "lucide-react"; // Import ChevronRight
import "../css/StatusCard.css";

const StatusCard = ({ text, locked, onClick }) => {
  
    const handleClick = () => {
      if (!locked) {
        // Show green color first, then navigate
        onClick(); // Trigger visual change
      }
    };

  return (
    <div
      className={`status-card ${locked ? "locked" : "clickable"}`}
      onClick={handleClick}
    >
      <span>{text}</span>
      <span className="card-icon">
        {locked ? (
          "🔒" // Lock icon when locked
        ) : (
          <ChevronRight size={24} color="#333" className="chevron-icon" /> // Apply chevron-icon class only when not locked
        )}
      </span>
    </div>
  );
};

export default StatusCard;
