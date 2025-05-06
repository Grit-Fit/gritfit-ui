// src/pages/GemsPage.js
import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { Lock, Unlock, Gem } from "lucide-react";
import "../css/GemsPage.css";
import { useNavigate } from "react-router-dom";
import axios from "../axios";
import logo from "../assets/logo1.png";
import TabBar from "./TabBar";
import FeedbackPrompt from "../components/FeedbackPrompt";          // ★ new

export default function GemsPage() {
  /* ───────── auth & nav ───────── */
  const { accessToken, user } = useAuth();
  const navigate = useNavigate();
  const userId = user?.userid || user?.id || "anon";

  /* one‑time feedback flag */
  const fbKey = `gemsFeedback_${userId}`;
  const askedBefore = !!localStorage.getItem(fbKey);

  /* ───────── state ───────── */
  const [gems, setGems]                 = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [bonusUnlockedAt, setBonusUnlockedAt] = useState(null);
  const [bonusUsed, setBonusUsed]       = useState(false);
  const [currentPhase, setCurrentPhase] = useState(1);
  const [showFB, setShowFB]             = useState(false);       // ★ new

  const rewardTiers = [
    { cost:50, name:"Get a Bonus Mission" },
    { cost:500, name:"Custom Habit Tracker Slot" },
    { cost:1500, name:"Swipe Multiplier (Double XP for a Day)" },
    { cost:2500, name:"Mini Challenge Unlock" },
    { cost:5000, name:"GritFit Pro Sneak Peek" },
  ];

  /* ───────── load user gems & profile ───────── */
  const loadData = useCallback(async () => {
    if (!accessToken) return;
    try {
      const g = await axios.get("/api/getUserGems",
        { headers:{ Authorization:`Bearer ${accessToken}` }});
      setGems(typeof g.data.gems==="number" ? g.data.gems : 0);

      const p = await axios.get("/api/getUserProfile",
        { headers:{ Authorization:`Bearer ${accessToken}` }});
      setBonusUnlockedAt(p.data.bonus_unlocked_at || null);
      setBonusUsed(!!p.data.bonus_used);
      setCurrentPhase(p.data.current_phase || 1);
    } catch(err){ console.error(err); }
  }, [accessToken]);

  useEffect(()=>{ loadData(); }, [loadData]);

  /* bonus unlocked window checker */
  const bonusActive = (() => {
    if (!bonusUnlockedAt || bonusUsed) return false;
    return Date.now()-new Date(bonusUnlockedAt).getTime() < 24*3600*1000;
  })();

  /* ───────── click handlers ───────── */
  const handleRewardClick = (tier, idx) => {
    // only tier 0 (50 gems) is interactive
    if (idx===0 && gems>=tier.cost && !bonusActive) setModalVisible(true);
  };

  const handleModalYes = async () => {
    setModalVisible(false);
    try {
      const r = await axios.post("/api/unlockBonus",
        { phaseId:currentPhase },
        { headers:{ Authorization:`Bearer ${accessToken}` }});
      setGems(r.data.newGems);
      setBonusUnlockedAt(r.data.bonus_unlocked_at || new Date().toISOString());
      setBonusUsed(false);

      /* prompt feedback once ‑‑ immediately after spending gems */
      if (!askedBefore) setShowFB(true);
    } catch(err){
      console.error("unlockBonus err:", err);
      alert(err.response?.data?.error || "Could not unlock bonus");
    }
  };
  const handleModalNo = () => setModalVisible(false);

  /* ───────── feedback close ───────── */
  const closeFeedback = () => {
    localStorage.setItem(fbKey,"1");      // mark as asked
    setShowFB(false);
  };

  /* ───────── UI ───────── */
  return (
    <>
      <div className="gems-page-container">
        {/* header */}
        <header className="gritphase-header">
          <img src={logo} alt="Logo" className="logo-gritPhases-task"
               onClick={()=>navigate("/cardView")}/>
          <div className="gems-display" style={{
                marginLeft:"auto",display:"flex",alignItems:"center",cursor:"pointer"}}
               onClick={()=>navigate("/gems")}>
            <Gem size={30} color="#00bcd4"/><span style={{marginLeft:8,fontWeight:700}}>
              {gems}</span>
          </div>
        </header>

        {/* title */}
        <div className="communityhead" style={{ width: "100%" }}>
          <h2 className="community-title" style={{ gap: "0.5rem" }}>
            <Gem /> Gems
          </h2>
        </div>

        {/* reward list */}
        <div className="profile-options" style={{padding:"0 1rem"}}>
          {rewardTiers.map((tier,i)=>{
            const unlocked = gems >= tier.cost;
            return (
              <div key={i} className="profile-option" style={{
                    height:"4rem",
                    cursor:i===0&&unlocked&&!bonusActive?"pointer":"default"}}
                   onClick={()=>handleRewardClick(tier,i)}>
                <div className="option-left">
                  <Gem size={20} color={unlocked?"#28a745":"#00bcd4"}/>
                  <span className="option-text">{tier.cost} — {tier.name}</span>
                </div>
                <div className="option-right">
                  {unlocked && !bonusActive ? <Unlock color="#28a745"/> : <Lock/>}
                </div>
              </div>
            );
          })}
        </div>

        {/* OPTIONAL manual feedback button (paste where you like) */}
        <div style={{textAlign:"center",marginTop:"1.5rem"}}>
          <button
            className="px-4 py-2 rounded bg-black text-white text-sm"
            onClick={()=>setShowFB(true)}>
            Give feedback
          </button>
        </div>
      </div>

      {/* unlock confirmation modal */}
      {modalVisible && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Unlock Bonus Mission?</h3>
            <p>Spend 50 gems to unlock your bonus card for 24 hours.</p>
            <div className="modal-buttons">
              <button className="modal-btn yes-btn" onClick={handleModalYes}>
                Yes
                <div style={{fontSize:"0.6rem"}}>
                  *Look out for the Gift icon on the Main screen!
                </div>
              </button>
              <button className="modal-btn no-btn" onClick={handleModalNo}>No</button>
            </div>
          </div>
        </div>
      )}

      <TabBar/>

      {/* feedback modal */}
      {showFB && (
        <FeedbackPrompt
          feature="GEMS_REWARD"
          question="How valuable was this reward to you?"
          placeholder="Any feedback on the reward system?"
          onClose={closeFeedback}
        />
      )}
    </>
  );
}
