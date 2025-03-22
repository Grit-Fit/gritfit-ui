import React, { useState, useEffect } from "react";
import "../css/Settings.css";
import ConfirmationModal from "./ConfirmationModal";
import { useAuth } from "../context/AuthContext";
import axios from "../axios";
import {
  ChevronLeft,
  LogOut,
  UserX,
  RotateCw,
  Mail,
  Bell,
  BellRing,
} from "lucide-react";
import logo from "../assets/GritFit_Full.png";
import set from "../assets/set.png";
import TabBar from "./TabBar";
import { useNavigate } from "react-router-dom";

// 1) Import Pusher Beams
import * as PusherPushNotifications from "@pusher/push-notifications-web";
const API_URL =  "https://api.gritfit.site/api";

export default function Settings() {
  const { logout, accessToken , user} = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRestartModal, setShowRestartModal] = useState(false);

  const navigate = useNavigate();

  // NEW: Track the beams_device_id from DB. If null => user unsubscribed, else subscribed
  const [beamsDeviceId, setBeamsDeviceId] = useState(null);
  const [userId, setUserId] = useState(null);

  // On mount, fetch user profile to see if beams_device_id is present

  useEffect(() => {
    async function fetchProfile() {
      try {
        if (!accessToken) return;
        // 1) Fetch user profile
        const res = await axios.get("/api/getUserProfile", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (res.data) {
          // 2) If the user has beams_device_id, store it
          if (res.data.beams_device_id) {
            setBeamsDeviceId(res.data.beams_device_id);
          }
          // 3) Also store userId if it exists in the response
          if (res.data.userid) {
            setUserId(res.data.userid);
          }
        }
      } catch (err) {
        console.error("Error fetching user profile:", err);
      }
    }
    fetchProfile();
  }, [accessToken]);

  // Toggle notifications logic (only enabling them here)
  async function handleNotificationsClick() {
    if (!accessToken) {
      alert("Please log in first.");
      return;
    }

    if (beamsDeviceId) {
      // Turn OFF notifications
      try {
        // 1) remove deviceId in DB
        await axios.post(
          `${API_URL}/storeBeamsDevice`,
          { deviceId: null },
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        // 2) remove local device interest if registered
        const beamsClient = new PusherPushNotifications.Client({
          instanceId: "ab36b7bc-d7f7-4be6-a812-afe25361ea37",
        });
        const regState = await beamsClient.getRegistrationState();
        console.log("[Beams] regState on unsub:", regState);
        if (regState === "REGISTERED" && user && user.id) {
          await beamsClient.removeDeviceInterest(`user-${user.id}`);
          console.log(`[Beams] Removed interest user-${user.id}`);
        }

        setBeamsDeviceId(null);
         alert("Notifications turned OFF.");
      } catch (err) {
        console.error("Error unsubscribing from push:", err);
      }
    } else {
      // Turn ON notifications
      try {
        const beamsClient = new PusherPushNotifications.Client({
          instanceId: "ab36b7bc-d7f7-4be6-a812-afe25361ea37",
        });
        const regState = await beamsClient.getRegistrationState();
        console.log("[Beams] regState before subscribing:", regState);

        if (regState === "PERMISSION_DENIED") {
          alert("Notifications blocked in your browser settings.");
          return;
        }

        if (
          regState === "UNREGISTERED" ||
          regState === "PERMISSION_GRANTED_NOT_REGISTERED_WITH_BEAMS"
        ) {
          await beamsClient.start();
          console.log("[Beams] start() done for subscription.");
        }

        // add interest if user has an ID
        if (user && user.id) {
          await beamsClient.addDeviceInterest(`user-${user.id}`);
          console.log(`[Beams] Subscribed to interest user-${user.id}`);
        }

        // store device ID in DB
        const newDeviceId = await beamsClient.getDeviceId();
        if (!newDeviceId) {
          alert("Could not retrieve device ID. Something went wrong.");
          return;
        }

        await axios.post(
          `${API_URL}/storeBeamsDevice`,
          { deviceId: newDeviceId },
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        setBeamsDeviceId(newDeviceId);
         alert("Notifications turned ON!");
      } catch (err) {
        console.error("Error subscribing to push:", err);
      }
    }
  }
  

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
      navigate("/auth");
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
      navigate("/auth");
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("Failed to delete account. Please try again later.");
    }
  };

  const cancelDeleteAccount = () => {
    setShowDeleteModal(false);
  };

  // 3) Restart Journey
  const handleRestartJourneyClick = () => {
    setShowRestartModal(true);
  };

  const confirmRestartJourney = async () => {
    setShowRestartModal(false);
    try {
      await axios.post(
        "/api/restartJourney",
        {},
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      alert("Journey restarted! Your progress data has been cleared.");
    } catch (error) {
      console.error("Error restarting journey:", error);
      alert("Failed to restart journey. Please try again later.");
    }
  };

  const cancelRestartJourney = () => {
    setShowRestartModal(false);
  };

  // 4) Contact Us => mailto link
  const handleContactUs = () => {
    window.location.href = "mailto:support@gritfit.site";
  };

  // Go back one page
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

          {/* NEW: Notifications Card */}
        {/* Notifications card that only enables notifications */}
        <div className="settings-card" onClick={handleNotificationsClick}>
          {beamsDeviceId ? (
            <BellRing className="card-icon" size={32} />
          ) : (
            <Bell className="card-icon" size={32} />
          )}
          <div className="card-label">
            {beamsDeviceId ? "Notifications ON" : "Enable Notifications"}
          </div>
        </div>
        </div>
      </div>

      <TabBar />

      {/* Confirmation Modals */}
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
