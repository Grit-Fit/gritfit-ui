// ContactUs.js
import React from "react";
import "./contactUs.css";

const ContactUs = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button onClick={onClose} className="close-button">
          ✕
        </button>

        <div className="popup-text">
          <h2>Hey, drop us a mail here!</h2>
          <p className="email">gritfit.dev@gmail.com</p>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
