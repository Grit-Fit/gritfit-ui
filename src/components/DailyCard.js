// src/components/DailyCard.js
import React from "react";
import "../css/DailyCard.css"; // Unique CSS for the card

function DailyCard({ dateText, description, isLocked }) {
  return (
    <div className="dailyCardContainer">
      <div className="dailyCardHeader">
        <h2 className="dailyCardDate">{dateText}</h2>
      </div>
      <p className="dailyCardDesc">{description}</p>

      {isLocked && (
        <div className="dailyCardLockedOverlay">
          <p>Task unlocks soon!</p>
        </div>
      )}
    </div>
  );
}

export default DailyCard;
