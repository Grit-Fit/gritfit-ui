import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { Lock, Unlock, Gem } from "lucide-react";
import "../css/GemsPage.css";
import { useNavigate } from "react-router-dom";
import axios from "../axios";
import logo from "../assets/logo1.png";
import TabBar from "./TabBar";

export default function GemsPage() {
  const { accessToken } = useAuth();
  const navigate = useNavigate();

  const [gems, setGems] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [bonusUnlockedAt, setBonusUnlockedAt] = useState(null);
  const [bonusUsed, setBonusUsed] = useState(false);
  const [currentPhase, setCurrentPhase] = useState(1); // Default phase 1

  const rewardTiers = [
    { cost: 50, name: "Get a Bonus Mission" },
    { cost: 500, name: "Custom Habit Tracker Slot" },
    { cost: 1500, name: "Swipe Multiplier (Double XP for a Day)" },
    { cost: 2500, name: "Mini Challenge Unlock" },
    { cost: 5000, name: "GritFit Pro Sneak Peek" },
  ];

  const loadData = useCallback(async () => {
    if (!accessToken) return;
    try {
      const { data: g } = await axios.get("/api/getUserGems", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setGems(typeof g.gems === "number" ? g.gems : 0);

      const { data: prof } = await axios.get("/api/getUserProfile", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setBonusUnlockedAt(prof.bonus_unlocked_at || null);
      setBonusUsed(!!prof.bonus_used);
      setCurrentPhase(prof.current_phase || 1); // Set phase
    } catch (err) {
      console.error("Error loading gems/profile:", err);
    }
  }, [accessToken]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const bonusActive = (() => {
    if (!bonusUnlockedAt || bonusUsed) return false;
    return Date.now() - new Date(bonusUnlockedAt).getTime() < 24 * 3600 * 1000;
  })();

  const handleRewardClick = (tier, idx) => {
    if (idx === 0 && gems >= tier.cost && !bonusActive) {
      setModalVisible(true);
    }
  };

  const handleModalYes = async () => {
    setModalVisible(false);
    try {
      const resp = await axios.post(
        "/api/unlockBonus",
        { phaseId: currentPhase },  // Pass current phase
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setGems(resp.data.newGems);
      setBonusUnlockedAt(resp.data.bonus_unlocked_at || new Date().toISOString());
      setBonusUsed(false);
    } catch (err) {
      console.error("Unlock bonus error:", err);
      alert(err.response?.data?.error || "Could not unlock bonus");
    }
  };

  const handleModalNo = () => setModalVisible(false);

  return (
    <>
      <div className="gems-page-container">
        <header className="gritphase-header">
          <img
            src={logo}
            alt="Logo"
            className="logo-gritPhases-task"
            onClick={() => navigate("/cardView")}
          />
          <div
            className="gems-display"
            onClick={() => navigate("/gems")}
            style={{
              marginLeft: "auto",
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
            }}
          >
            <Gem size={30} color="#00bcd4" />
            <span
              style={{
                marginLeft: 8,
                fontWeight: "bold",
                fontSize: "1.2rem",
              }}
            >
              {gems}
            </span>
          </div>
        </header>

        <div className="communityhead" style={{ width: "100%" }}>
          <h2 className="community-title" style={{ gap: "0.5rem" }}>
            <Gem /> Gems
          </h2>
        </div>

        <div className="profile-options" style={{ padding: "0 1rem" }}>
          {rewardTiers.map((tier, i) => {
            const unlocked = gems >= tier.cost;
            return (
              <div
                key={i}
                className="profile-option"
                style={{
                  height: "4rem",
                  cursor:
                    i === 0 && unlocked && !bonusActive
                      ? "pointer"
                      : "default",
                  opacity: 1,
                }}
                onClick={() => handleRewardClick(tier, i)}
              >
                <div className="option-left">
                  <Gem
                    size={20}
                    color={unlocked ? "#28a745" : "#00bcd4"}
                  />
                  <span className="option-text">
                    {tier.cost} — {tier.name}
                  </span>
                </div>
                <div className="option-right">
                  {unlocked && !bonusActive ? <Unlock color={unlocked ? "#28a745" : "#00bcd4"}/> : <Lock />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {modalVisible && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Unlock Bonus Mission?</h3>
            <p>Spend 50 gems to unlock your bonus card for 24 hours.</p>
            <div className="modal-buttons">
              <button
                className="modal-btn yes-btn"
                onClick={handleModalYes}
              >
                Yes
                <div style={{ fontSize: "0.6rem"}}>*Look out for the Gift icon on the Main screen!</div>
              </button>
              <button
                className="modal-btn no-btn"
                onClick={handleModalNo}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      <TabBar />
    </>
  );
}
