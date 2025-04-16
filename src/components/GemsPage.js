import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";  
import { Lock, Unlock, Gem } from "lucide-react";
import "../css/GemsPage.css";
import { useNavigate } from "react-router-dom";
import axios from "../axios";
import logo from "../assets/logo1.png";
import TabBar from "./TabBar";

export default function GemsPage() {
  const [gems, setGems] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const { accessToken } = useAuth();
  const navigate = useNavigate();

  function goToCard() {
    navigate("/cardView");
  }

  function goToGems() {
    navigate("/gems");
  }

  // Fetch gem count
  useEffect(() => {
    async function fetchGems() {
      try {
        const response = await axios.get("/api/getUserGems", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (response.data && typeof response.data.gems === "number") {
          setGems(response.data.gems);
        } else {
          setGems(0);
        }
      } catch (error) {
        console.error("Error fetching gems:", error);
        setGems(0);
      }
    }
    if (accessToken) {
      fetchGems();
    }
  }, [accessToken]);

  const rewardTiers = [
    { cost: 50, name: "Get a Bonus Mission" },
    { cost: 500, name: "Streak Freeze" },
    { cost: 1500, name: "Streak Freeze" },
    { cost: 2500, name: "Streak Freeze" },
    { cost: 5000, name: "Streak Freeze" },
  ];

  // When a reward is clicked:
  // For the first reward (index 0) and if unlocked (gems >= 50), show modal.
  const handleRewardClick = (tier, index) => {
    if (index === 0 && gems >= tier.cost) {
      setModalVisible(true);
    }
    // For other rewards, you can optionally add other behavior.
  };

  // Modal handlers
  const handleModalYes = () => {
    setModalVisible(false);
    navigate("/bonus"); // Navigate to BonusCardPage (assumed route is "/bonus")
  };

  const handleModalNo = () => {
    setModalVisible(false);
    // Stay on GemsPage
  };

  return (
    <>
      <div className="gems-page-container">
        <header className="gritphase-header">
          <img
            src={logo}
            alt="Logo"
            className="logo-gritPhases-task"
            onClick={goToCard}
          />
          <div
            className="gems-display"
            onClick={goToGems}
            style={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              marginLeft: "auto",
            }}
          >
            <Gem size={30} color="#00bcd4" />
            <span style={{ marginLeft: "0.5rem", fontWeight: "bold", fontSize: "1.2rem" }}>
              {gems}
            </span>
          </div>
        </header>

        <div className="communityhead" style={{ width: "100%" }}>
          <h2 className="community-title" style={{ gap: "0.5rem" }}>
            <Gem />Gems
          </h2>
        </div>

        <div className="profile-options" style={{ paddingLeft: "1rem", paddingRight: "1rem" }}>
          {rewardTiers.map((tier, index) => {
            const isUnlocked = gems >= tier.cost;
            return (
              <div
                key={index}
                className="profile-option"
                style={{ height: "4rem", cursor: index === 0 && isUnlocked ? "pointer" : "default" }}
                onClick={() => handleRewardClick(tier, index)}
              >
                <div className="option-left">
                  {isUnlocked ? (
                    <Gem size={20} color="#28a745" />
                  ) : (
                    <Gem size={20} color="#00bcd4" />
                  )}
                  <span className="option-text">
                    {tier.cost} - {tier.name}
                  </span>
                </div>
                <div className="option-right">
                  {isUnlocked ? (
                    <span className="unlock-label">
                      <Unlock />
                    </span>
                  ) : (
                    <span className="lock-label">
                      <Lock />
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal for Bonus Card confirmation */}
      {modalVisible && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Unlock Bonus Mission?</h3>
            <p>Would you like to open the bonus card and attempt the bonus mission?</p>
            <div className="modal-buttons">
              <button className="modal-btn yes-btn" onClick={handleModalYes}>
                Yes
              </button>
              <button className="modal-btn no-btn" onClick={handleModalNo}>
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
