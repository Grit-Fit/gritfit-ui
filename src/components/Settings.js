import React, { useState } from "react";
import "../css/Settings.css";
import ConfirmationModal from "./ConfirmationModal"; // The new modal
import { useAuth } from "../context/AuthContext";
import axios from "../axios";
import { ChevronLeft, LogOut, UserX, RotateCw, Mail } from "lucide-react"; 
import logo from "../assets/GritFit_Full.png";
import set from "../assets/set.png";
import TabBar from "./TabBar";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const { logout, accessToken } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRestartModal, setShowRestartModal] = useState(false);
  const navigate = useNavigate();

  // 1) Log Out
  const handleSignOutClick = () => {
    setShowLogoutModal(true);
  };

  const confirmSignOut = async () => {
    setShowLogoutModal(false);
    try {
      if (logout) {
        await logout();
      }
      navigate("/");
    } catch (err) {
      console.error("Error logging out:", err);
      alert("Failed to log out. Please try again later.");
    }
  };

  const cancelSignOut = () => {
    setShowLogoutModal(false);
  };

  // 2) Delete Account
  const handleDeleteAccountClick = () => {
    setShowDeleteModal(true);
  };

  const confirmDeleteAccount = async () => {
    setShowDeleteModal(false);
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

  const cancelDeleteAccount = () => {
    setShowDeleteModal(false);
  };


  const handleRestartJourneyClick = () => {
    setShowRestartModal(true);
  };

  const confirmRestartJourney = async () => {
    setShowRestartModal(false);
    try {
      await axios.post("/api/restartJourney", {}, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      alert("Journey restarted! Your progress data has been cleared.");
    } catch (error) {
      console.error("Error restarting journey:", error);
      alert("Failed to restart journey. Please try again later.");
    }
  };

  const cancelRestartJourney = () => {
    setShowRestartModal(false);
  };


  const handleContactUs = () => {
    window.location.href = "mailto:support@gritfit.site";
  };


  const handleBackProfile = () => {
    navigate("/UserProfile");
  };

  return (
    <>
      <header className="gritphase-header">
        <ChevronLeft className="backIcon" onClick={handleBackProfile} />
        <img
          src={logo}
          alt="Logo"
          className="logo-gritPhases-header"
          style={{ marginLeft: "-12rem" }}
          onClick={handleBackProfile}
        />
      </header>

      <div className="report_header_set">
        <div className="report_header-text">
          <img src={set} alt="Settings" />
          Settings
        </div>
      </div>

      <div className="settings-container">
        <div className="settings-grid">
          {/* Log Out */}
          <div className="settings-card" onClick={handleSignOutClick}>
            <LogOut className="card-icon" size={32} />
            <div className="card-label">Log Out</div>
          </div>

          {/* Delete Account */}
          <div className="settings-card" onClick={handleDeleteAccountClick}>
            <UserX className="card-icon" size={32} />
            <div className="card-label">Delete Account</div>
          </div>

          {/* Restart Journey */}
          <div className="settings-card" onClick={handleRestartJourneyClick}>
            <RotateCw className="card-icon" size={32} />
            <div className="card-label">Restart Journey</div>
          </div>

          {/* Contact Us */}
          <div className="settings-card" onClick={handleContactUs}>
            <Mail className="card-icon" size={32} />
            <div className="card-label">Contact Us</div>
          </div>
        </div>
      </div>

      <TabBar />

      {/* Our 3 confirmation modals */}
      <ConfirmationModal
        visible={showLogoutModal}
        title="Log Out"
        message="Are you sure you want to log out?"
        onConfirm={confirmSignOut}
        onCancel={cancelSignOut}
      />

      <ConfirmationModal
        visible={showDeleteModal}
        title="Delete Account"
        message="Are you sure you want to delete your account? This cannot be undone."
        onConfirm={confirmDeleteAccount}
        onCancel={cancelDeleteAccount}
      />

      <ConfirmationModal
        visible={showRestartModal}
        title="Restart Journey"
        message="Are you sure you want to restart your journey? All progress will be deleted."
        onConfirm={confirmRestartJourney}
        onCancel={cancelRestartJourney}
      />
    </>
  );
}
