import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/GritFit_Full.png";
import "../css/TermsAndConditions.css";
import { AuthContext } from "../context/AuthContext";

// 1) Import the Pusher Beams client
import * as PusherPushNotifications from "@pusher/push-notifications-web";
import axios from "axios";

const API_URL =  "https://api.gritfit.site/api";

const BEAMS_INSTANCE_ID = process.env.REACT_APP_BEAMS_INSTANCE_ID;

export default function TermsAndConditions() {
  const navigate = useNavigate();

  // Original state for “Decline” popup
  const [showDeclinePopup, setShowDeclinePopup] = useState(false);

  // NEW state for showing a push-notifications popup
  const [showBeamsPopup, setShowBeamsPopup] = useState(false);
  const { accessToken, user } = useContext(AuthContext); 
  const [showCalendarPopup, setShowCalendarPopup] = useState(false);

  // Called when user clicks "Agree and continue"
  async function handleAgree() {
    // Instead of navigating immediately, show a second popup for push
    setShowBeamsPopup(true);
  }

  // If user clicks "Decline" for T&C
  function handleDecline() {
    setShowDeclinePopup(true);
  }

  function closePopup() {
    setShowDeclinePopup(false);
  }

async function confirmAddCalendar() {
  setShowCalendarPopup(false);

  try {
    const now = new Date();
    const tenPM = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      22, 0, 0
    );
    const end = new Date(tenPM.getTime() + 30 * 60 * 1000);

    const formatDate = (date) =>
      date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

    const calendarData = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:GritFit Daily Reminder
DESCRIPTION:Stay consistent with GritFit! Open the app daily.
DTSTART:${formatDate(tenPM)}
DTEND:${formatDate(end)}
RRULE:FREQ=DAILY;COUNT=14
LOCATION:gritfit.app
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([calendarData], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "gritfit_reminder.ics";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Award gems
    if (accessToken) {
      await axios.post(
        "/api/awardGems",
        { reason: "calendar_reminder", amount: 5 },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
    }

    alert("📅 Calendar added for 10 PM daily!\n💎 You've earned 5 gems!");

  } catch (err) {
    console.error("Calendar invite error:", err);
    alert("📅 Calendar added for 10 PM daily!\n💎 You've earned 5 gems!");
  } finally {
    navigate("/cardView");
  }
}

function denyAddCalendar() {
  setShowCalendarPopup(false);
  navigate("/cardView");
}



  return (
    <div className="terms-container">

      <img src={logo} alt="GritFit Logo" className="terms-logo" />


      <h2 className="terms-title">Terms & Conditions</h2>
      <p className="terms-update">Update 01/01/2025</p>


      <div className="terms-content">
        <h3>1. Acceptance of Terms</h3>
        <p>
          By using GritFit, you agree to these Terms & Conditions. If you do not
          agree, please do not use our service.
        </p>

        <h3>2. Purpose of the App</h3>
        <p>
          GritFit is designed to help users build healthy nutrition habits step
          by step. Our approach is focused on gradual habit formation, making it
          easier to stay consistent.
        </p>

        <h3>3. Nutritional Guidance Disclaimer</h3>
        <p>
          The macro split and target calorie recommendations provided in the app
          are based on general research and industry best practices. We do not
          replace personalized medical advice. If you wish to start following
          strict nutritional guidelines, consult a certified dietitian or
          medical professional.
        </p>

        <h3>4. Not a Medical Substitute</h3>
        <p>
          GritFit does not provide medical advice. Always consult a healthcare
          professional before making significant dietary or lifestyle changes,
          especially if you have existing medical conditions.
        </p>

        <h3>5. User Responsibility</h3>
        <p>
          You acknowledge that progress depends on consistency and personal
          effort. GritFit provides guidance, but ultimate results may vary.
        </p>

        <h3>6. Data & Privacy</h3>
        <p>
          We respect your privacy and handle your data as outlined in our
          [Privacy Policy]. Your information will never be shared without your
          consent.
        </p>

        <h3>7. Changes to Terms</h3>
        <p>
          These terms may be updated periodically. Continued use of the app
          implies acceptance of the latest terms.
        </p>

        <h3>8. Proceeding</h3>
        <p>
          By proceeding, you agree to these terms and are ready to build habits
          the GritFit way.
        </p>
      </div>

      {/* Buttons */}
      <div className="terms-buttons">
        <button className="terms-agree-btn" onClick={handleAgree}>
          Agree and continue
        </button>
        <button className="terms-decline-btn" onClick={handleDecline}>
          Decline
        </button>
      </div>

      {showDeclinePopup && (
        <div className="decline-popup-overlay">
          <div className="decline-popup">
            <p>You must accept the Terms & Conditions to proceed.</p>
            <button onClick={closePopup}>OK</button>
          </div>
        </div>
      )}

{showCalendarPopup && (
  <div className="decline-popup-overlay">
    <div className="decline-popup">
      <h3>Add Calendar Reminder?</h3>
      <p>Would you like to add a daily 10 PM reminder for GritFit?</p>
      <div style={{ marginTop: "1rem" }}>
        <button onClick={confirmAddCalendar} style={{ marginRight: "0.5rem" }}>
          Yes
        </button>
        <button onClick={denyAddCalendar}>No</button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}