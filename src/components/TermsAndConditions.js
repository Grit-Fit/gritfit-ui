import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/GritFit_Full.png";
import "../css/TermsAndConditions.css";
import { AuthContext } from "../context/AuthContext";

// 1) Import the Pusher Beams client
import * as PusherPushNotifications from "@pusher/push-notifications-web";
import axios from "axios";

const API_URL =  "https://api.gritfit.site/api";

export default function TermsAndConditions() {
  const navigate = useNavigate();

  // Original state for “Decline” popup
  const [showDeclinePopup, setShowDeclinePopup] = useState(false);

  // NEW state for showing a push-notifications popup
  const [showBeamsPopup, setShowBeamsPopup] = useState(false);
  const { accessToken, user } = useContext(AuthContext); 

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

  // If user says "Yes" to push notifications
  async function confirmEnableNotifications() {
    setShowBeamsPopup(false);
    try {
      console.log("[Beams] Creating client...");
      const beamsClient = new PusherPushNotifications.Client({
        instanceId: "ab36b7bc-d7f7-4be6-a812-afe25361ea37",
      });

      console.log("[Beams] Checking registration state...");
      const regState = await beamsClient.getRegistrationState();
      console.log("[Beams] Registration state:", regState);

      // if user previously unregistered
      if (regState === "UNREGISTERED") {
        console.log("[Beams] calling beamsClient.start()...");
        await beamsClient.start();

        console.log("[Beams] start() done. If user allowed, subscription success");

        // add interest if we have user ID
        if (user && user.id) {
          await beamsClient.addDeviceInterest(`user-${user.id}`);
          console.log(`[Beams] Subscribed to interest user-${user.id}`);
        }

        const deviceId = await beamsClient.getDeviceId();
        console.log("[Beams] device ID:", deviceId);

        // store device ID in DB
        await axios.post(
          `${API_URL}/storeBeamsDevice`,
          { deviceId },
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        console.log("[Beams] Device ID stored in DB!");
      } else {
        console.log("[Beams] Already registered or permission denied, skipping start()");
      }
    } catch (err) {
      console.error("[Beams] Subscription error:", err);
    } finally {
      navigate("/cardView");
    }
  }

  // If user says "No" to push
  function denyEnableNotifications() {
    setShowBeamsPopup(false);
    // Just navigate without subscribing
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

      {/* Our new push popup */}
      {showBeamsPopup && (
        <div className="decline-popup-overlay">
          <div className="decline-popup">
            <h3>Enable Push Notifications?</h3>
            <p>Would you like to receive push notifications from GritFit?</p>
            <div style={{ marginTop: "1rem" }}>
              <button
                onClick={confirmEnableNotifications}
                style={{ marginRight: "0.5rem" }}
              >
                Yes
              </button>
              <button onClick={denyEnableNotifications}>No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}