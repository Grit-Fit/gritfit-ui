
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "../axios";
import "../css/CardView.css"; 
import SwipeImageWithSpring from "./SwipeImageWithSpring";
import logo from "../assets/logo1.png";
import { Gem, Undo2, Redo2, ChartNoAxesColumn } from "lucide-react";
import TabBar from "./TabBar";

// LEFT SWIPE: Subtract 50 gems (but not below 0)
function BonusLeftSwipeCard({ currentGems, onClose, onUpdateGems, accessToken }) {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  async function confirmLeftSwipe() {
    setIsLoading(true);
    try {
      const newGemCount = Math.max(0, currentGems - 50);
      // Update the gem count in the database
      await axios.post(
        "/api/updateUserGems",
        { newGemCount },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      onUpdateGems(newGemCount);
      // Log the bonus mission outcome ("reset")
      await axios.post(
        "/api/logBonusMission",
        { result: "reset" },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      onClose();
      navigate("/cardView");
    } catch (err) {
      console.error("Left swipe bonus error:", err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="big-card fade-in" style={{ background: "linear-gradient(180deg, #FF6934, #FF3413)", left: "20px" }}>
      <div className="undo" onClick={onClose}>
        Undo Swipe <Redo2 style={{ width: "24px", height: "24px" }} />
      </div>
      <h2 style={{ marginTop: "4rem", marginBottom: "2rem" }}>You swiped left!</h2>
      <p>
        Your gem count will decrease from {currentGems} to {Math.max(0, currentGems - 50)}.
        Are you sure?
      </p>
      <button className="doneBtn pulse-button" onClick={confirmLeftSwipe} disabled={isLoading} style={{ marginTop: "2rem" }}>
        {isLoading ? "Updating..." : "Yes, reduce gems"}
      </button>
    </div>
  );
}

// RIGHT SWIPE: Add 100 gems
function BonusRightSwipeCard({ currentGems, onClose, onUpdateGems, accessToken }) {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  async function confirmRightSwipe() {
    setIsLoading(true);
    try {
      const newGemCount = currentGems + 100;
      // Update the gem count
      await axios.post(
        "/api/updateUserGems",
        { newGemCount },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      onUpdateGems(newGemCount);
      // Log the bonus mission outcome ("tripled")
      await axios.post(
        "/api/logBonusMission",
        { result: "tripled" },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      onClose();
      navigate("/cardView");
    } catch (err) {
      console.error("Right swipe bonus error:", err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="big-card fade-in" style={{ background: "linear-gradient(180deg, #1DD75BFF 0%, #D79D1DFF 100%)", left: "20px" }}>
      <div className="undo" onClick={onClose}>
        Undo Swipe <Undo2 style={{ width: "24px", height: "24px" }} />
      </div>
      <h2 style={{ marginTop: "4rem", marginBottom: "2rem" }}>You swiped right!</h2>
      <p>
        Your gem count will increase from {currentGems} to {currentGems + 100}! 
      </p>
      <button className="doneBtnRight pulse-button" onClick={confirmRightSwipe} disabled={isLoading} style={{ marginTop: "2rem" }}>
        {isLoading ? "Updating..." : "Yes, add 100"}
      </button>
    </div>
  );
}


function LockedBonusCard() {
  return (
    <div className="big-card fade-in" style={{ background: "linear-gradient(180deg, #aaa, #666)", left: "20px" }}>
      <h2 style={{ marginTop: "3rem", marginBottom: "2rem" }}>Bonus Mission Locked</h2>
      <p>You have already used your bonus mission.</p>
    </div>
  );
}

export default function BonusCardView() {
  const { accessToken, refreshAuthToken } = useAuth();
  const navigate = useNavigate();
  const [gems, setGems] = useState(0);
  const [bonusUsed, setBonusUsed] = useState(false);
  const [showLeftCard, setShowLeftCard] = useState(false);
  const [showRightCard, setShowRightCard] = useState(false);
  const [bonusTask, setBonusTask] = useState(null);


  const bonusTasks = [
    { id: 1, description: "Try hitting 30g protein before 2pm today" }
  ];


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
        console.error("Error fetching gems in BonusCardView:", error);
        setGems(0);
      }
    }
    if (accessToken) {
      fetchGems();
    }
  }, [accessToken]);


  useEffect(() => {
    async function fetchBonusUsage() {
      try {
        const resp = await axios.get("/api/getUserProfile", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (resp.data && typeof resp.data.bonus_used === "boolean") {
          setBonusUsed(resp.data.bonus_used);
        }
        if (resp.data && !resp.data.bonus_used) {
          const randomTask = bonusTasks[Math.floor(Math.random() * bonusTasks.length)];
          setBonusTask(randomTask);
        } else {
          setBonusTask(null);
        }
      } catch (err) {
        console.error("Error fetching bonus usage in BonusCardView:", err);
      }
    }
    if (accessToken) {
      fetchBonusUsage();
    }
  }, [accessToken]);

  function goToCardView() {
    navigate("/cardView");
  }
  function goToGems() {
    navigate("/gems");
  }
  function goToGFitReport() {
    navigate("/gFitReport");
  }

  function handleSwipe(direction) {
    if (bonusUsed || !bonusTask) return; 
    if (direction === "left") {
      setShowLeftCard(true);
      setShowRightCard(false);
    } else if (direction === "right") {
      setShowRightCard(true);
      setShowLeftCard(false);
    }
  }

  function closeSubCard() {
    setShowLeftCard(false);
    setShowRightCard(false);
    async function refreshData() {
      try {
        const gemResp = await axios.get("/api/getUserGems", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (gemResp.data && typeof gemResp.data.gems === "number") {
          setGems(gemResp.data.gems);
        }
      } catch (error) {
        console.error("Error refreshing gems:", error);
      }
      try {
        const profileResp = await axios.get("/api/getUserProfile", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (profileResp.data && typeof profileResp.data.bonus_used === "boolean") {
          setBonusUsed(profileResp.data.bonus_used);
        }
      } catch (error) {
        console.error("Error refreshing bonus usage:", error);
      }
    }
    refreshData();
  }

  function handleUpdateGems(newAmount) {
    setGems(newAmount);
  }

  function renderMainBonusCard() {
    if (bonusUsed) {
      return <LockedBonusCard />;
    }
    return (
      <SwipeImageWithSpring onSwipe={handleSwipe}>
        <div className="big-card" style={{ background: "linear-gradient(180deg, #7F7FD5 0%, #86A8E7 50%, #91EAE4 100%)" }}>
          <h2 style={{ marginTop: "3rem", marginBottom: "2rem", fontSize: "1.5rem" }}>Bonus Card</h2>
          {bonusTask && (
            <p>
              {bonusTask.description}
            </p>
          )}
          <p>
            Swipe left to decrease gems by 50, or swipe right to add 100 gems.<br />
            Dare to try?
          </p>
        </div>
      </SwipeImageWithSpring>
    );
  }

  if (showLeftCard) {
    return (
      <div className="cardview-container">
        <header className="gritphase-header">
          <img src={logo} alt="Logo" className="logo-gritPhases-task" onClick={goToCardView} />
          <div className="phase-row">
            <span className="phase-title">Bonus Card</span>
            <div className="progress-bar-container">
              <div className="progress-bar-fill" style={{ width: "0%" }} />
            </div>
          </div>
          <div className="gems-display" onClick={goToGems} style={{ display: "flex", alignItems: "center", cursor: "pointer", position: "absolute", right: "60px" }}>
            <Gem size={30} color="#00bcd4" />
            <span style={{ marginLeft: "0.5rem", fontWeight: "bold", fontSize: "1.2rem" }}>{gems}</span>
          </div>
          <ChartNoAxesColumn size={36} onClick={goToGFitReport} className="grid-icon" />
        </header>
        <div className="card-wrapper">
          <BonusLeftSwipeCard
            currentGems={gems}
            onClose={closeSubCard}
            onUpdateGems={handleUpdateGems}
            accessToken={accessToken}
          />
        </div>
        <TabBar />
      </div>
    );
  }

  if (showRightCard) {
    return (
      <div className="cardview-container">
        <header className="gritphase-header">
          <img src={logo} alt="Logo" className="logo-gritPhases-task" onClick={goToCardView} />
          <div className="phase-row">
            <span className="phase-title">Bonus Card</span>
            <div className="progress-bar-container">
              <div className="progress-bar-fill" style={{ width: "0%" }} />
            </div>
          </div>
          <div className="gems-display" onClick={goToGems} style={{ display: "flex", alignItems: "center", cursor: "pointer", position: "absolute", right: "60px" }}>
            <Gem size={30} color="#00bcd4" />
            <span style={{ marginLeft: "0.5rem", fontWeight: "bold", fontSize: "1.2rem" }}>{gems}</span>
          </div>
          <ChartNoAxesColumn size={36} onClick={goToGFitReport} className="grid-icon" />
        </header>
        <div className="card-wrapper">
          <BonusRightSwipeCard
            currentGems={gems}
            onClose={closeSubCard}
            onUpdateGems={handleUpdateGems}
            accessToken={accessToken}
          />
        </div>
        <TabBar />
      </div>
    );
  }

  // Render main bonus card
  return (
    <div className="cardview-container">
      <header className="gritphase-header">
        <img src={logo} alt="Logo" className="logo-gritPhases-task" onClick={goToCardView} />
        <div className="phase-row">
          <span className="phase-title">Bonus Card</span>
        </div>
        <div className="gems-display" onClick={goToGems} style={{ display: "flex", alignItems: "center", cursor: "pointer", position: "absolute", right: "60px" }}>
          <Gem size={30} color="#00bcd4" />
          <span style={{ marginLeft: "0.5rem", fontWeight: "bold", fontSize: "1.2rem" }}>{gems}</span>
        </div>
        <ChartNoAxesColumn size={36} onClick={goToGFitReport} className="grid-icon" />
      </header>
      <div className="card-wrapper">
        {renderMainBonusCard()}
      </div>
      <TabBar />
    </div>
  );
}
