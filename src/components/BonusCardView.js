// src/components/BonusCardView.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "../axios";
import "../css/CardView.css";
import SwipeImageWithSpring from "./SwipeImageWithSpring";
import logo from "../assets/logo1.png";
import { Gem, Undo2, Redo2, ChartNoAxesColumn, RectangleVertical } from "lucide-react";
import TabBar from "./TabBar";
import rightIcon from "../assets/rightf.png";
import leftIcon  from "../assets/leftf.png";
import posthog from "posthog-js";
import FeedbackPrompt from "./FeedbackPrompt";            // ★ NEW

export default function BonusCardView() {
  const { accessToken, refreshAuthToken, user } = useAuth();
  const navigate = useNavigate();

  /* ───── state ───── */
  const [gems, setGems]           = useState(0);
  const [bonusUsed, setBonusUsed] = useState(false);
  const [bonusTask, setBonusTask] = useState(null);
  const [bonusTaskId, setBonusTaskId] = useState(null);

  const [showLeft,  setShowLeft]  = useState(false);
  const [showRight, setShowRight] = useState(false);

  /* feedback modal */
  const [showFB,   setShowFB]   = useState(false);
  const [fbType,   setFbType]   = useState("");           // "bonus_left" | "bonus_right"
  const fbKey = `bonusFb_${bonusTaskId}_${user?.userid || "anon"}`;

  /* ───── initial load ───── */
  useEffect(() => {
    if (!accessToken) return void refreshAuthToken();

    posthog.identify(accessToken);        // optional analytics

    (async () => {
      try {
        const { data } = await axios.get("/api/bonusStatus", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setGems(data.gems);
        setBonusUsed(data.bonusUsed);
        if (data.bonusTaskDescription) {
          setBonusTask({ description: data.bonusTaskDescription });
          setBonusTaskId(data.bonusTaskId || "unknown");
        }
      } catch (err) {
        console.error("bonusStatus failed:", err);
        setBonusTask(null);
      }
    })();
  }, [accessToken, refreshAuthToken]);

  /* ───── helpers ───── */
  const Header = () => (
    <header className="gritphase-header">
      <img src={logo} alt="Logo" className="logo-gritPhases-task"
           onClick={() => navigate("/cardView")} />
      <div className="phase-row" style={{ marginTop: 84 }}>
        <span className="phase-title">Bonus Card</span>
      </div>
      <div className="gems-display" onClick={() => navigate("/gems")}
           style={{ position:"absolute", right:60, display:"flex", cursor:"pointer" }}>
        <Gem size={30} color="#00bcd4" />
        <span style={{ marginLeft:8,fontWeight:"bold",fontSize:"1.2rem" }}>{gems}</span>
      </div>
      <ChartNoAxesColumn size={36} onClick={() => navigate("/gFitReport")}
                         className="grid-icon" />
    </header>
  );

  /* ───── confirm actions ───── */
  async function confirmLeft() {
    try {
      posthog.capture("bonus_skipped", { taskId: bonusTaskId });
      await axios.post("/api/logBonusMission", { result:"reset" },{
        headers:{ Authorization:`Bearer ${accessToken}` }
      });
      setShowLeft(false);
      if (!localStorage.getItem(fbKey)) {
        setFbType("bonus_left");
        setShowFB(true);
      } else {
        navigate("/cardView");
      }
    } catch (e) { console.error(e); }
  }

  async function confirmRight() {
    try {
      const updated = gems + 100;
      posthog.capture("bonus_completed", { taskId: bonusTaskId, newGemCount:updated });

      await axios.post("/api/updateUserGems",
        { newGemCount: updated },
        { headers:{ Authorization:`Bearer ${accessToken}` } });

      await axios.post("/api/logBonusMission",
        { result:"tripled" },
        { headers:{ Authorization:`Bearer ${accessToken}` } });

      setGems(updated);
      setShowRight(false);
      if (!localStorage.getItem(fbKey)) {
        setFbType("bonus_right");
        setShowFB(true);
      } else {
        navigate("/cardView");
      }
    } catch (e) { console.error(e); }
  }

  /* ───── swipe handler ───── */
  function onSwipe(dir) {
    if (bonusUsed) return;
    if (dir==="left")  { setShowLeft(true);  posthog.capture("bonus_swipe",{direction:"left", taskId:bonusTaskId}); }
    if (dir==="right") { setShowRight(true); posthog.capture("bonus_swipe",{direction:"right",taskId:bonusTaskId}); }
  }

  /* ───── conditional screens ───── */
  if (showLeft || showRight) {
    const isLeft = showLeft;
    return (
      <div className="cardview-container">
        <Header />
        <div className="card-wrapper">
          <div className="big-card fade-in"
               style={{ background: isLeft
                        ? "linear-gradient(180deg,#FF6934,#FF3413)"
                        : "linear-gradient(180deg,#1DD75B,#D79D1D)",
                        left:20 }}>
            <div className={isLeft?"undo-left":"undo"}
                 onClick={() => isLeft ? setShowLeft(false) : setShowRight(false)}>
              Undo Swipe {isLeft ? <Redo2 size={24}/> : <Undo2 size={24}/> }
            </div>
            <p style={{ marginTop:"9rem",marginBottom:"9rem" }}>
              {isLeft
                ? "You stumbled today, but progress isn’t perfect. Reset. Refocus. You’ve got this."
                : "Let’s go! 100 Gems added to your stash"}
            </p>
            <button className="doneBtn pulse-button"
                    onClick={isLeft ? confirmLeft : confirmRight}>
              {isLeft ? "Not quitting!" : "Keep Going!"}
            </button>
          </div>
        </div>

        {/* feedback modal */}
        {showFB && (
          <div style={{ opacity:0.95, zIndex:9999 }}>
            <FeedbackPrompt
              feature={fbType}
              question="Was this bonus mission fun or frustrating?"
              placeholder="Do you want more like this?"
              onClose={() => {
                localStorage.setItem(fbKey,"1");
                setShowFB(false);
                navigate("/cardView");
              }}
            />
          </div>
        )}

        <TabBar />
      </div>
    );
  }

  /* ───── default (no confirm screen) ───── */
  return (
    <div className="cardview-container">
      <Header />
      <div className="card-wrapper">
        {!bonusUsed && bonusTask ? (
          <SwipeImageWithSpring onSwipe={onSwipe}>
            <div className="big-card fade-in"
                 style={{ background:"linear-gradient(180deg,#7F7FD5 0%,#86A8E7 50%,#91EAE4 100%)" }}>
              <p className="task-descrip">{bonusTask.description}</p>
              <div className="swipe-hints">
                <div className="left-hint">
                  <img src={leftIcon} alt="Swipe Left" className="swipe-left"/>Couldn't do it
                </div>
                <div className="right-hint">
                  Crushed it!<img src={rightIcon} alt="Swipe Right" className="swipe-right"/>
                </div>
              </div>
            </div>
          </SwipeImageWithSpring>
        ) : (
          <div className="big-card fade-in"
               style={{ background:"linear-gradient(180deg,#aaa,#666)" }}>
            <h2 style={{ marginTop:"3rem",marginBottom:"2rem" }}>Bonus Locked</h2>
            <p style={{ padding:"0 1rem" }}>
              You’ve already used your bonus. Spend 50 gems again on the Gems page.
            </p>
          </div>
        )}
      </div>

      <RectangleVertical className="gift-icon" size={32} fill="#00bcd4"
                         onClick={() => navigate("/cardView")} />

 
      {showFB && (
        <div style={{ opacity:0.95, zIndex:9999 }}>
          <FeedbackPrompt
            feature={fbType}
            question="Was this bonus mission fun or frustrating?"
            placeholder="Do you want more like this?"
            onClose={() => {
              localStorage.setItem(fbKey,"1");
              setShowFB(false);
              navigate("/cardView");
            }}
          />
        </div>
      )}

      <TabBar />
    </div>
  );
}
