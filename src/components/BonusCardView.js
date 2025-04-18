import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "../axios";
import "../css/CardView.css";      
import SwipeImageWithSpring from "./SwipeImageWithSpring";
import logo from "../assets/logo1.png";
import { Gem, Undo2, Redo2, ChartNoAxesColumn, RectangleVertical } from "lucide-react";
import TabBar from "./TabBar";

// Database task list will be fetched based on phase (dynamic)
export default function BonusCardView() {
  const { accessToken, refreshAuthToken } = useAuth();
  const navigate = useNavigate();

  const [gems, setGems] = useState(0);
  const [bonusUsed, setBonusUsed] = useState(false);
  const [bonusTask, setBonusTask] = useState(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);
  const [bonusTaskId, setBonusTaskId] = useState(null); // Store the task ID

  useEffect(() => {
    if (!accessToken) return void refreshAuthToken();
  
    (async () => {
      try {
        const { data } = await axios.get("/api/bonusStatus", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
  
        setGems(data.gems);
        setBonusUsed(data.bonusUsed);
        setBonusTask(data.bonusTaskDescription ? { description: data.bonusTaskDescription } : null);
  
      } catch (err) {
        console.error("load bonusStatus failed:", err);
        setBonusTask(null);
      }
    })();
  }, [accessToken, refreshAuthToken]);
  

  const refreshAll = () => {
    setShowLeft(false);
    setShowRight(false);
    navigate("/bonus", { replace: true });
  };

  async function confirmLeft() {
    try {
      await axios.post("/api/logBonusMission", { result: "reset" }, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      refreshAll();
      navigate("/cardView");
    } catch (e) {
      console.error(e);
    }
  }

  async function confirmRight() {
    try {
      const updatedGems = gems + 100;
      await axios.post("/api/updateUserGems", { newGemCount: updatedGems }, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      await axios.post("/api/logBonusMission", { result: "tripled" }, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      setGems(updatedGems);
      refreshAll();
      navigate("/cardView");
    } catch (e) {
      console.error(e);
    }
  }

  function onSwipe(dir) {
    if (bonusUsed) return;
    if (dir === "left") setShowLeft(true);
    if (dir === "right") setShowRight(true);
  }

  const Header = () => (
    <header className="gritphase-header">
      <img
        src={logo}
        alt="Logo"
        className="logo-gritPhases-task"
        onClick={() => navigate("/cardView")}
      />
      <div className="phase-row">
        <span className="phase-title">Bonus Card</span>
      </div>
      <div
        className="gems-display"
        onClick={() => navigate("/gems")}
        style={{
          position: "absolute",
          right: "60px",
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
        }}
      >
        <Gem size={30} color="#00bcd4" />
        <span style={{ marginLeft: 8, fontWeight: "bold", fontSize: "1.2rem" }}>
          {gems}
        </span>
      </div>
      <ChartNoAxesColumn
        size={36}
        onClick={() => navigate("/gFitReport")}
        className="grid-icon"
      />
    </header>
  );

  if (showLeft || showRight) {
    const isLeft = showLeft;
    return (
      <div className="cardview-container">
        <Header />
        <div className="card-wrapper">
          <div
            className="big-card fade-in"
            style={{
              background: isLeft ? "linear-gradient(180deg, #FF6934, #FF3413)" : "linear-gradient(180deg, #1DD75B, #D79D1D)",
              left: 20
            }}
          >
            <div className={isLeft ? "undo-left" : "undo"} onClick={() => isLeft ? setShowLeft(false) : setShowRight(false)}>
              Undo Swipe {isLeft ? <Redo2 size={24} /> : <Undo2 size={24} />}
            </div>
            <p style={{ marginTop: "4rem", marginBottom: "2rem" }}>
              {isLeft ? "You stumbled today, but progress isn’t perfect. Reset. Refocus. You’ve got this." : "Let’s go! 100 Gems added to your stash"}
            </p>
            <button className="doneBtn pulse-button" onClick={isLeft ? confirmLeft : confirmRight}>
              {isLeft ? "Not quitting!" : "Keep Going!"}
            </button>
          </div>
        </div>
        <TabBar />
      </div>
    );
  }

  return (
    <div className="cardview-container">
      <Header />
      <div className="card-wrapper">
        {!bonusUsed && bonusTask ? (
          <SwipeImageWithSpring onSwipe={onSwipe}>
            <div
              className="big-card fade-in"
              style={{
                background: "linear-gradient(180deg, #7F7FD5 0%, #86A8E7 50%, #91EAE4 100%)"
              }}
            >
              <RectangleVertical className="gift-icon" size={32} color="#769fd1" fill="#769fd1" onClick={() => navigate("/cardView")} style={{position: "relative", top: "0rem", left: "8rem"}}/>
              <p style={{ padding: "0 1rem", fontSize: "1.6rem", marginTop: "2rem" }}>{bonusTask.description}</p>
              <div style={{ marginTop: "1rem", marginLeft: "7rem" }}>Swipe right if you did it!</div>
              <div style={{ marginTop: "1rem", marginRight: "7rem" }}>Swipe left if you didn’t</div>
            </div>
          </SwipeImageWithSpring>
        ) : (
          <div className="big-card fade-in" style={{ background: "linear-gradient(180deg, #aaa, #666)" }}>
            <h2 style={{ marginTop: "3rem", marginBottom: "2rem" }}>Bonus Locked</h2>
            <p style={{ padding: "0 1rem" }}>
              You’ve already used your bonus. Spend 50 gems again on the Gems page.
            </p>
          </div>
        )}
      </div>
      <TabBar />
    </div>
  );
}
