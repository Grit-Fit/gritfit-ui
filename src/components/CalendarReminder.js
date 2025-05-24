
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/GritFit_Full.png";
import "../css/TermsAndConditions.css";      
import "../css/Welcome.css";         
import axios from "../axios";
import { AuthContext } from "../context/AuthContext";
import { ChevronLeft } from 'lucide-react';

export default function CalendarReminder() {
  const navigate                     = useNavigate();
  const { accessToken, user }        = useContext(AuthContext);
  const [busy, setBusy]              = useState(false);

  /* ------------------------------------------------------------------ */
  const addCalendar = async () => {
    if (busy) return;
    setBusy(true);

    /* 1️⃣  Build a 10 PM local reminder, recurring daily for 14 days */
    const now   = new Date();
    const start = new Date(
      now.getFullYear(), now.getMonth(), now.getDate(), 22, 0, 0
    );
    const end   = new Date(start.getTime() + 30 * 60 * 1000);

    const fmt = (d) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

    const ics = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:GritFit daily reminder
DESCRIPTION:Stay consistent with GritFit!
DTSTART:${fmt(start)}
DTEND:${fmt(end)}
RRULE:FREQ=DAILY;COUNT=14
LOCATION:gritfit.app
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url  = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "gritfit_reminder.ics";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    /* 2️⃣  Optional: award 5 gems */
    try {
      await axios.post(
        "/api/awardGems",
        { reason: "calendar_reminder", amount: 5 },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      alert("📅 Calendar added!\n💎 5 bonus gems awarded.");
    } catch (e) {
      console.error("awardGems failed:", e);
      alert("📅 Calendar added! (Couldn’t contact server for gems.)");
    }

    navigate("/finalSteps", { replace: true });
  };

  const skip = () => navigate("/finalSteps", { replace: true });
    function handleBack() {
    navigate(-1);
  }

  /* ------------------------------------------------------------------ */
  return (
    <div className="welcome-container">
        <ChevronLeft className="intro-back-button" onClick={handleBack} size={40}/>
      <img src={logo} alt="GritFit Logo" className="welcome-logo" />

      <div className="calender-content">
        <p>🗓️ Add <strong>GritFit</strong> to your calendar as a daily reminder — it
        takes just <strong>10 seconds</strong> and makes a huge difference.</p>

        <p>💡 Users who do this show way higher consistency → more results.<br/>
        🎁 You’ll also earn <strong>+5 bonus gems</strong> for setting it up!</p>

        <button
          onClick={addCalendar}
          disabled={busy}
          className="terms-agree-btn"
          style={{ width: "100%", marginTop: 48 }}
        >
          {busy ? "Preparing…" : "📅 Yes, I want a reminder!"}
        </button>
      </div>

      {/* Progress bar at 50% */}
      <div className="intro-progress-bar">
        <div className="intro-progress-fill" style={{ width: "75%" }}></div>
      </div>
      <p className="intro-progress-label">75%</p>

      {/* bottom buttons */}
      {/* Next button */}
      <button className="intro-next-btn" onClick={skip}>
        Next
      </button>
    </div>
  );
}
