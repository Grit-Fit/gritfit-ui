import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/Settings.css";
import { useAuth } from "../context/AuthContext";
import axios from "../axios";
import { ChevronLeft, LogOut, UserX, RotateCw, Mail } from "lucide-react"; 
import logo from "../assets/GritFit_Full.png";
import set from "../assets/set.png";
import TabBar from "./TabBar";

export default function Settings() {
  const { logout, accessToken } = useAuth();
  const navigate = useNavigate();

  // 1) Log Out
  const handleSignOut = async (e) => {
    e.preventDefault();
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (!confirmLogout) return;

    if (logout) {
      await logout();
    }
    navigate("/");
  };

  // 2) Delete Account => remove user row from userprofile
  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account? This cannot be undone."
    );
    if (!confirmDelete) return;

    try {
      await axios.delete("/api/deleteAccount", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      
      if (logout) {
        await logout();
      }
      navigate("/");
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("Failed to delete account. Please try again later.");
    }
  };

  
  const handleRestartJourney = async () => {
    const confirmRestart = window.confirm(
      "Are you sure you want to restart your journey? This will delete all your progress."
    );
    if (!confirmRestart) return;

    try {
      // Example route: POST /api/restartJourney
      await axios.post("/api/restartJourney", {}, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      alert("Journey restarted! Your progress data has been cleared.");
    } catch (error) {
      console.error("Error restarting journey:", error);
      alert("Failed to restart journey. Please try again later.");
    }
  };

  // 4) Contact Us => mailto link
  const handleContactUs = () => {
    window.location.href = "mailto:support@gritfit.site";
  };

  // Go back one page
  const handleBackProfile = () => {
    navigate("/UserProfile");
  };

  function goHome() {
    navigate("/cardView");
  }

  return (
    <>
    <header className="gritphase-header">
            <ChevronLeft className="backIcon" onClick={handleBackProfile} />
                    <img src={logo} alt="Logo" className="logo-gritPhases-header" style={{marginLeft: "-12rem"}}  onClick={handleBackProfile}/>
                    <div className="phase-row">
                    </div>
    </header>
    <div className="report_header_set">
            <div className="report_header-text"><img src={set} />Settings</div>
    </div>
    <div className="settings-container">

      {/* 2x2 Grid */}
      <div className="settings-grid">
        {/* Log Out Card */}
        <div className="settings-card" onClick={handleSignOut}>
          <LogOut className="card-icon" size={32} />
          <div className="card-label">Log Out</div>
        </div>

        {/* Delete Account Card */}
        <div className="settings-card" onClick={handleDeleteAccount}>
          <UserX className="card-icon" size={32} />
          <div className="card-label">Delete Account</div>
        </div>

        {/* Restart Journey Card */}
        <div className="settings-card" onClick={handleRestartJourney}>
          <RotateCw className="card-icon" size={32} />
          <div className="card-label">Restart Journey</div>
        </div>

        {/* Contact Us Card */}
        <div className="settings-card" onClick={handleContactUs}>
          <Mail className="card-icon" size={32} />
          <div className="card-label">Contact Us</div>
        </div>
      </div>
    </div>
    <TabBar />
    </>
  );
}
