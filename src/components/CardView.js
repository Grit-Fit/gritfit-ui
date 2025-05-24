import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "../axios";
import { useAuth } from "../context/AuthContext";
import SwipeImageWithSpring from "./SwipeImageWithSpring";
import "../css/CardView.css";
import rightIcon from "../assets/rightf.png";
import leftIcon from "../assets/leftf.png";
import upIcon from "../assets/upflick.png";
import TabBar from "./TabBar";
import gritfitLogo from "../assets/logo1.png";
import logo from "../assets/logo1.png";
import { Gem, Undo2, ClipboardCheck, Redo2,MoveDown, Gift , Flame, Bell} from "lucide-react";
import FeedbackPrompt from "../components/FeedbackPrompt";
import confetti from "canvas-confetti";
import SupportButton from "./SupportButton";
import WhatsNewBanner from "./WhatsNewBanner";
import FeedbackWizard from "../components/FeedbackWizard";


/* 
----------------------------------
 Left Swipe Sub-Component
----------------------------------
*/
function InternalLeftSwipeCard({ phaseNumber, dayNumber, onClose, onUpdateStatus }) {
  const { accessToken, refreshAuthToken } = useAuth();
  const [selectedButton, setSelectedButton] = useState(null);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [otherReason, setOtherReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const phaseId = parseInt(phaseNumber, 10);

  useEffect(() => {
    if (!accessToken) {
      refreshAuthToken();
    }
  }, [accessToken, refreshAuthToken]);

  const getReasonText = (buttonName) => {
    switch (buttonName) {
      case "sick":            return "Feeling unwell";
      case "less_motivation": return "Lack of motivation";
      case "cheatDay":        return "Cheat day";
      case "busy":            return "Too busy";
      case "other":           return otherReason.trim();
      default:                return "";
    }
  };

  async function doneBtnClick(e) {
    e.preventDefault();
    if (!phaseNumber || !dayNumber) {
      setError("Missing required information");
      return;
    }
    if (phaseId === 3 && !selectedGoal) {
      setError("Please select a goal you were unable to achieve.");
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      const reason = getReasonText(selectedButton?.name || "");
      await axios.post(
        "/api/userprogressNC",
        {
          phaseId: phaseId,
          taskId: parseInt(dayNumber, 10),
          reasonForNonCompletion: reason,
          failedGoal: phaseId === 3 ? selectedGoal : null,
        },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      // Refresh tasks, close card
      if (onUpdateStatus) onUpdateStatus();
      if (onClose) onClose(true);
    } catch (err) {
      console.error("LeftSwipe error:", err);
      setError("Failed to update. Please try again!");
    } finally {
      setIsLoading(false);
    }
  }

  function handleGoalSelection(g) {
    setSelectedGoal(g);
  }
  function handleButtonClick(name, img) {
    setSelectedButton({ name, image: img });
  }

  return (
    <div
      className="big-card fade-in"
      style={{ background: "linear-gradient(180deg, #EFB034FF 0%, #EF5634FF 47%)", left: "20px" }}
    >
      <div className="undo-left" onClick={() => onClose(false)}>
        Undo Swipe <Redo2 style={{ width: "24px", height: "24px" }} />
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {phaseId === 3 && !selectedGoal ? (
        <>
          <h2 style={{ marginBottom: "4.5rem", marginTop: "4rem" }}>
            Which goal were you unable to achieve?
          </h2>
          <button className="goalBtn" onClick={() => handleGoalSelection("Protein Goal")}>
            Protein Goal
          </button>
          <h3> OR </h3>
          <button className="goalBtn" onClick={() => handleGoalSelection("Fat Goal")}>
            Water Goal
          </button>
        </>
      ) : (
        <>
          <h2 style={{ marginBottom: "1rem", marginTop: "3rem" }}>
            It's okay! What was your biggest hurdle today?
          </h2>

          {!selectedButton ? (
            <div className="body_images" style={{ marginTop: "1rem", gap: "15px" }}>
              <div className="reason-card" onClick={() => handleButtonClick("sick", require("../assets/sickk.png"))}>
                <img src={require("../assets/sickk.png")} alt="Sick" className="reason-icon" />
                <span className="reason-label">Sick</span>
              </div>
              <div className="reason-card" onClick={() => handleButtonClick("less_motivation", require("../assets/loww.png"))}>
                <img src={require("../assets/loww.png")} alt="Low Motivation" className="reason-icon" />
                <span className="reason-label">Low Motivation</span>
              </div>
              <div className="reason-card" onClick={() => handleButtonClick("cheatDay", require("../assets/cheatt.png"))}>
                <img src={require("../assets/cheatt.png")} alt="Cheat Day" className="reason-icon" />
                <span className="reason-label">CheatDay</span>
              </div>
              <div className="reason-card" onClick={() => handleButtonClick("busy", require("../assets/busyy.png"))}>
                <img src={require("../assets/busyy.png")} alt="Busy" className="reason-icon" />
                <span className="reason-label">Busy</span>
              </div>
              <div className="reason-card" onClick={() => handleButtonClick("other", require("../assets/otherr.png"))}>
                <img src={require("../assets/otherr.png")} alt="Other" className="reason-icon" />
                <span className="reason-label">Other</span>
              </div>
            </div>
          ) : (
            <div className="selected-button-container" style={{ marginTop: "1rem", marginBottom: "1.5rem" }}>
              {selectedButton.name !== "other" && (
                <img
                  src={selectedButton.image}
                  alt={selectedButton.name}
                  className="selected-button"
                  style={{ marginBottom: "1rem" }}
                />
              )}
              {selectedButton.name === "other" ? (
                <div className="other-reason-container">
                  <input
                    type="text"
                    value={otherReason}
                    onChange={(e) => setOtherReason(e.target.value)}
                    placeholder="Please specify your reason..."
                    className="other-reason-input"
                    autoFocus
                  />
                </div>
              ) : (
                <p>That's OK! Let us try again tomorrow!</p>
              )}
            </div>
          )}
        </>
      )}

      <button
        className="doneBtn pulse-button"
        onClick={doneBtnClick}
        disabled={isLoading}
        style={{ marginTop: "2rem" }}
      >
        {isLoading ? "Updating..." : "Done"}
      </button>
    </div>
  );
}

/* 
----------------------------------
 Right Swipe Sub-Component
----------------------------------
*/
function InternalRightSwipeCard({ phaseNumber, dayNumber, onClose, onUpdateStatus,  onStreakChange }) {
  const { accessToken, refreshAuthToken } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentStreak, setCurrentStreak] = useState(null);
  const [filled, setFilled] = useState(false);  
  const prev = useRef(null);

  useEffect(() => {
    if (!accessToken) {
      refreshAuthToken();
    }
  }, [accessToken, refreshAuthToken]);


useEffect(() => {
  if (!accessToken) return;
  (async () => {    
    try {
      const { data } = await axios.get("/userStats", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const db = data.current_streak ?? 0;
      setCurrentStreak(db);          
      setTimeout(() => {
        setCurrentStreak(db + 1);    
      }, 1200);
    } catch (err) {
      console.error("Failed to fetch streak:", err);
    }
  })();
}, [accessToken]);

useEffect(() => {
  if (prev.current !== null && currentStreak !== prev.current) {
    setFilled(true);               // stays true
  }
  prev.current = currentStreak;
}, [currentStreak]);

  

  async function doneBtnClick(e) {
    e.preventDefault();
    if (!phaseNumber || !dayNumber) {
      setError("Missing required information");
      return;
    }
  
    setIsLoading(true);
    setError(null);
  
    try {
      /* 1️⃣  Call the API */
      const { data } = await axios.post(
        "/api/userprogressC",
        {
          phaseId: parseInt(phaseNumber, 10),
          taskId : parseInt(dayNumber, 10),
        },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
  
      /* 2️⃣  Update UI/state while we’re still in-scope */
      if (onUpdateStatus)  onUpdateStatus();

  
      if (onClose) onClose(true);                  // close the card
    } catch (err) {
      console.error("RightSwipe error:", err);
      setError("Failed to update progress. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }
  

  return (
    <div
      className="big-card fade-in"
      style={{ background: "linear-gradient(180deg, #1DD75BFF 0%, #D79D1DFF 100%)", left: "20px" }}
    >
      <div className="undo" onClick={() => onClose(false)}>
        Undo Swipe <Undo2 style={{ width: "24px", height: "24px" }} />
      </div>

      <div className="body-text" style={{ marginTop: "0px", textAlign: "center" }}>
        <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
          Yayy! You did it!
        </h2>
        <br></br>
        <div className="streak-counter">
        {/* <AnimatedStreak value={currentStreak} /> */}
        <Flame size={80} color="#ff5722" className={filled ? "flame-filled-perm" : ""}/>
        {currentStreak}
        </div>
        
      </div>

      {error && (
        <div className="error-message" style={{ color: "red", marginTop: "1rem" }}>
          {error}
        </div>
      )}

      <button
        className="doneBtnRight pulse-button"
        onClick={doneBtnClick}
        disabled={isLoading}
        style={{ marginTop: "2rem", position: "absolute", top: "22rem" }}
      >
        {isLoading ? "Updating..." : "🎯 Done"}
      </button>
    </div>
  );
}

function IntroCard({ onClose }) {
  function handleSwipe(direction) {
    onClose();
  }

  return (
    <div className="intro-card-container">
      {/* The background dimming, optional */}
      <div className="intro-dim-background" />

      <SwipeImageWithSpring onSwipe={handleSwipe}>
      <div className="intro-card">
      <h2 className="intro-card-title">Swipe right if you did the task</h2>
        <p className="intro-card-text">
          See your GritPhase task everyday - your goal for the day. Swipe right if you did it!
          <img src={rightIcon} alt="Swipe Right" className="swipe-right" />
        </p>

        <hr style={{width: "18rem", position: "relative", top: "4px"}} />
        <h2 className="intro-card-title">Swipe up if you want Help!</h2>
        <p className="intro-card-text">
        <img src={upIcon} alt="Swipe Left" className="swipe-left" />
        Aren't able to do the task? Swipe up to get help! 
        </p>

        <hr style={{width: "18rem", position: "relative", top: "4px"}} />
        <h2 className="intro-card-title">Swipe left if you didn't</h2>
        <p className="intro-card-text">
        <img src={leftIcon} alt="Swipe Left" className="swipe-left" />
        Weren't able to do the task, no problem! Swipe left to make a very personalized habit roadmap. It's that easy!
        </p>
      </div>
      </SwipeImageWithSpring>
    </div>
  );
}


/* 
----------------------------------
 Up Swipe Sub-Component
----------------------------------
*/
function InternalHelpSwipeCard({ phaseNumber, dayNumber, onClose, onHelpSent }) {
  const { accessToken } = useAuth();
  const [helpMessage, setHelpMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  async function sendHelpRequest() {
    if (!helpMessage.trim()) {
      setError("Please enter your issue or question.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      await axios.post(
        "/api/sendHelpRequest",
        {
          phaseNumber: Number(phaseNumber),
          dayNumber: Number(dayNumber),
          message: helpMessage.trim(),
        },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      alert("Your help request was sent to friends!");
      onHelpSent && onHelpSent(); 
      setHelpMessage("");
      if (onClose) onClose();
    } catch (err) {
      console.error("HelpSwipe error:", err);
      setError("Either your friends list is empty, or you have already requested help for this task.");
    } finally {
      setIsLoading(false);
    }
  }
  

  return (
    <div
      className="big-card fade-in"
      style={{ background: "linear-gradient(180deg, #13D7E9FF 34%, #98EB24FF 100%)", left: "20px" }}
    >
      <div
        className="undo"
        onClick={onClose}
        style={{ position: "absolute", top: "20px", right: "10px" }}
      >
       <MoveDown style={{ width: "24px", height: "24px" }} />Undo Swipe
      </div>

      <h2 style={{ marginTop: "4rem" , fontWeight: "700", fontSize: "1.2rem", }}>Help is one text away!</h2>
      <p style={{ marginBottom: "1rem" }}>
      </p>

      {error && <p style={{ color: "red", marginBottom: "1rem" }}>{error}</p>}

      <textarea
        value={helpMessage}
        onChange={(e) => setHelpMessage(e.target.value)}
        placeholder="Write here how do you exactly need help in this task, and that's it!"
        style={{
          width: "85%",
          minHeight: "90px",
          borderRadius: "6px",
          padding: "0.5rem",
          marginBottom: "1rem",
          color: "black"
        }}
      />

      <button
        className="doneBtn pulse-button"
        onClick={sendHelpRequest}
        disabled={isLoading}
        style={{ marginTop: "1rem" }}
      >
        {isLoading ? "Sending..." : "Send Help Request"}
      </button>
    </div>
  );
}

/* --------------------------------------------------------
   SHADOW  RIGHT  SWIPE  CARD   (analytics only)
---------------------------------------------------------*/
function ShadowRightSwipeCard({ taskObj, onClose }) {
  const { accessToken } = useAuth();
  const [saving, setSaving] = useState(false);
  const [filled, setFilled] = useState(false);

  async function done(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.post("/api/logShadowSwipe",
        { taskdetailsId: taskObj.taskdetailsid, swipeDirection: "right" },
        { headers:{ Authorization:`Bearer ${accessToken}` } }
      );

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#00bcd4", "#ffffff", "#91f1ff"],
        zIndex: 9999
      });

      onClose(true);          
    } catch (err) {
      console.error("shadow right log err:", err);
    } finally { setSaving(false); }
  }

  useEffect(() => {
  const timer = setTimeout(() => setFilled(true), 1200);
  return () => clearTimeout(timer);
}, []);

  return (
    <div className="big-card fade-in"
         style={{ background:"linear-gradient(180deg,#1DD75B,#D79D1D)", left:"20px" }}>
      <div className="undo" onClick={() => onClose(false)}> Undo Swipe <Undo2 style={{ width: "24px", height: "24px" }} /></div>

    <div className="body-text" style={{ marginTop: "0px", textAlign: "center" }}>
      <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Awesome!</h2>
      </div>
      <div style={{ textAlign: "center", marginTop: "2.5rem" , position:"relative", top:"-4rem"}}>
  <Gem
    size={90}
    color="#00bcd4"
    className={filled ? "gem-filled-pulse" : ""}
  />
</div>
      <button className="doneBtnRight pulse-button"
              disabled={saving}
              onClick={done}
              style={{ marginTop: "2rem", position: "absolute", top: "22rem" }}>
        {saving ? "Saving…" : "🎯 Done"}
      </button>

            {/* <button
        className="doneBtnRight pulse-button"
        onClick={doneBtnClick}
        disabled={isLoading}
        style={{ marginTop: "2rem", position: "absolute", top: "22rem" }}
      >
        {isLoading ? "Updating..." : "🎯 Done"}
      </button> */}

            {/* <div className="body-text" style={{ marginTop: "0px", textAlign: "center" }}>
        <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
          Yayy! You did it!
        </h2> */}
    </div>
  );
}

/* --------------------------------------------------------
   SHADOW  LEFT  SWIPE  CARD   (analytics only, Phase-1)
---------------------------------------------------------*/
function ShadowLeftSwipeCard({ taskObj, onClose }) {
  const { accessToken } = useAuth();

  /* same local state as your main card */
  const [selectedButton, setSelectedButton] = useState(null);
  const [otherReason,   setOtherReason]   = useState("");
  const [isLoading,     setIsLoading]     = useState(false);
  const [error,         setError]         = useState(null);

  const getReasonText = () =>
    selectedButton?.name === "sick"            ? "Feeling unwell" :
    selectedButton?.name === "less_motivation" ? "Lack of motivation" :
    selectedButton?.name === "cheatDay"        ? "Cheat day" :
    selectedButton?.name === "busy"            ? "Too busy" :
    selectedButton?.name === "other"           ? otherReason.trim() :
    "";

  async function doneBtnClick(e) {
    e.preventDefault();
    if (!selectedButton) { setError("Pick a reason first."); return; }
    if (selectedButton.name === "other" && !otherReason.trim()) {
      setError("Please enter your reason.");
      return;
    }
    setIsLoading(true); setError(null);
    try {
      await axios.post(
        "/api/logShadowSwipe",
        {
          taskdetailsId : taskObj.taskdetailsid,
          swipeDirection: "left",
          reason        : getReasonText(),
        },
        { headers:{ Authorization:`Bearer ${accessToken}` } }
      );
      onClose(true);              // saved
    } catch(err) {
      console.error("shadow left log err:", err);
      setError("Couldn’t save. Try again.");
    } finally { setIsLoading(false); }
  }

  /* identical markup copied from your main left-card */
  return (
    <div className="big-card fade-in"
         style={{ background:"linear-gradient(180deg,#EFB034,#EF5634)", left:"20px" }}>
      {/* Undo button */}
      <div className="undo-left" onClick={() => onClose(false)}>
        Undo Swipe <Redo2 style={{ width: "24px", height: "24px" }} />
      </div>

      {error && <p style={{ color:"red" }}>{error}</p>}

      {/* Phase-1 never asks goal; jump straight to reasons */}
      <h2 style={{ marginBottom:"1rem", marginTop:"3rem" }}>
        It's okay! What was your biggest hurdle today?
      </h2>

      {!selectedButton ? (
        <div className="body_images" style={{ marginTop:"1rem", gap:"15px" }}>
          <div className="reason-card"
               onClick={()=>setSelectedButton({ name:"sick", image:require("../assets/sickk.png") })}>
            <img src={require("../assets/sickk.png")} alt="Sick" className="reason-icon"/>
            <span className="reason-label">Sick</span>
          </div>
          <div className="reason-card"
               onClick={()=>setSelectedButton({ name:"less_motivation", image:require("../assets/loww.png") })}>
            <img src={require("../assets/loww.png")} alt="Low Motivation" className="reason-icon"/>
            <span className="reason-label">Low Motivation</span>
          </div>
          <div className="reason-card"
               onClick={()=>setSelectedButton({ name:"cheatDay", image:require("../assets/cheatt.png") })}>
            <img src={require("../assets/cheatt.png")} alt="Cheat Day" className="reason-icon"/>
            <span className="reason-label">CheatDay</span>
          </div>
          <div className="reason-card"
               onClick={()=>setSelectedButton({ name:"busy", image:require("../assets/busyy.png") })}>
            <img src={require("../assets/busyy.png")} alt="Busy" className="reason-icon"/>
            <span className="reason-label">Busy</span>
          </div>
          <div className="reason-card"
               onClick={()=>setSelectedButton({ name:"other", image:require("../assets/otherr.png") })}>
            <img src={require("../assets/otherr.png")} alt="Other" className="reason-icon"/>
            <span className="reason-label">Other</span>
          </div>
        </div>
      ) : (
        <div className="selected-button-container"
             style={{ marginTop:"1rem", marginBottom:"1.5rem" }}>
          {selectedButton.name !== "other" && (
            <img src={selectedButton.image} alt={selectedButton.name}
                 className="selected-button" style={{ marginBottom:"1rem" }}/>
          )}
          {selectedButton.name === "other" ? (
            <div className="other-reason-container">
              <input type="text" value={otherReason}
                     onChange={e=>setOtherReason(e.target.value)}
                     placeholder="Please specify your reason..."
                     className="other-reason-input" autoFocus />
            </div>
          ) : (
            <p>That's OK! Let us try again tomorrow!</p>
          )}
        </div>
      )}

      <button className="doneBtn pulse-button"
              onClick={doneBtnClick}
              disabled={isLoading}
              style={{ marginTop:"2rem" }}>
        {isLoading ? "Saving…" : "Done"}
      </button>
    </div>
  );
}




/* 
----------------------------------
 Main CardView 
----------------------------------
*/
export default function CardView() {
  const navigate = useNavigate();
  const location = useLocation();
  const { accessToken, refreshAuthToken } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [currentTask, setCurrentTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [phaseProgress, setPhaseProgress] = useState(0);

  const [showLeftCard, setShowLeftCard] = useState(false);
  const [showRightCard, setShowRightCard] = useState(false);
  const [showHelpCard, setShowHelpCard] = useState(false);
  const [phaseNumber, setPhaseNumber] = useState(null);
  const [dayNumber, setDayNumber] = useState(null);
  const [gems, setGems] = useState(0);

  const [bonusAvailable, setBonusAvailable] = useState(false); //gem

  const [showIntro, setShowIntro] = useState(true);
  const [feedback, setFeedback] = useState({ rating: 0, comment: "", sent: false, isLoading: false, error: null });
  const [currentStreak, setCurrentStreak] = useState(0);

  const [showShadowCard, setShowShadowCard] = useState(false);
  const [shadowTask,     setShadowTask]     = useState(null);
  const [showShadowRight, setShowShadowRight] = useState(false);
const [showShadowLeft,  setShowShadowLeft]  = useState(false);

const userId = useAuth().user?.userid || "anon";
const phaseFbKey = `phase1to2Fb_${userId}`;
const weekFbKey  = `week1Fb_${userId}`;
const midP3Key   = `phase3midFb_${userId}`;
const npsFbKey   = `week1NpsFb_${userId}`;

const [showPhaseFB, setShowPhaseFB] = useState(false);
const [showWeekFB , setShowWeekFB ] = useState(false);
const [showMidP3FB,    setShowMidP3FB]    = useState(false);
const [showNPSFB, setShowNPSFB] = useState(false);
const [showHelpFB, setShowHelpFB] = useState(false); 
const [filled, setFilled] = useState(false);
const [latestUpdate, setLatestUpdate] = useState(null);
const [showBanner,   setShowBanner]   = useState(false);
const [showWizard, setShowWizard] = useState(false);



  // Ensure user is logged in
  useEffect(() => {
    if (!accessToken) {
      refreshAuthToken().catch(() => navigate("/login"));
    }
  }, [accessToken, refreshAuthToken, navigate]);

  // Check if user previously dismissed the intro
  useEffect(() => {
    const dismissed = localStorage.getItem("introDismissed");
    if (dismissed === "true") {
      setShowIntro(false);
    }
  }, []);

  // Possibly parse leftover navigation state for left/right swipes
  useEffect(() => {
    const s = location.state || {};
    if (s.rightSwipe && s.phase !== undefined && s.day !== undefined) {
      setShowRightCard(true);
      setShowLeftCard(false);
      setPhaseNumber(s.phase);
      setDayNumber(s.day);
    } else if (s.leftSwipe && s.phase !== undefined && s.day !== undefined) {
      setShowLeftCard(true);
      setShowRightCard(false);
      setPhaseNumber(s.phase);
      setDayNumber(s.day);
    }
  }, [location.state]);

  // Fetch tasks on mount + interval
  useEffect(() => {
    fetchTasks();
    const interval = setInterval(fetchTasks, 600000);
    return () => clearInterval(interval);
  }, [accessToken]);
  
  async function fetchTasks() {
    if (!accessToken) return;
    setLoading(true);
    setError(null);
  
// Inside fetchTasks():
try {
  const resp = await axios.post("/api/getTaskData", {}, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const mergedData = resp.data.data || [];

  // [A] If all tasks "Not Started," auto-start day1
  const allTasksNotStarted = mergedData.every((t) => t.taskstatus === "Not Started");
  if (allTasksNotStarted && mergedData.length > 0) {
    console.log("[CardView] Auto-starting Phase1, Day1...");
    await axios.post("/api/userprogressStart",
      { phaseId: 1, taskId: 1 },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    return fetchTasks(); // re-fetch
  }

  // [B] In-memory auto-activate if now >= activation_date
  const now = new Date();
  let updated = mergedData.map((t) => {
    if (t.taskstatus === "Not Started" && t.task_activation_date) {
      const act = new Date(t.task_activation_date);
      if (now >= act) {
        // Switch to "In Progress" in memory
        return { ...t, taskstatus: "In Progress" };
      }
    }
    return t;
  });

  // [C] (OPTIONAL) Persist "In Progress" changes to DB
  /*
  const tasksToActivate = updated.filter((task) =>
    task.taskstatus === "In Progress" &&
    mergedData.some((orig) => orig.taskid === task.taskid && orig.taskstatus === "Not Started")
  );

  if (tasksToActivate.length > 0) {
    await Promise.all(
      tasksToActivate.map(async (task) => {
        await axios.post("/api/updateTaskStatus", {
          phaseId: task.phaseid,
          taskId: task.taskid,
          status: "In Progress"
        }, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
      })
    );
    // No need to re-fetch, local state is already updated
  }
  */

  setTasks(updated);

  // [D] Find next in-progress or earliest not-started
  let nextTask = updated.find((t) => t.taskstatus === "In Progress");
  if (!nextTask) {
    const notStarted = updated
      .filter((t) => t.taskstatus === "Not Started")
      .sort((a, b) => new Date(a.task_activation_date) - new Date(b.task_activation_date));
    if (notStarted.length > 0) {
      nextTask = notStarted[0];
    }
  }
  setCurrentTask(nextTask || null);

  // [E] Phase progress
  if (nextTask) {
    const ph = nextTask.phaseid;
    const tasksInPhase = updated.filter((x) => x.phaseid === ph);
    const completed = tasksInPhase.filter((x) => x.taskstatus === "Completed").length;
    const total = tasksInPhase.length;
    const p = total === 0 ? 0 : Math.round((completed / total) * 100);
    setPhaseProgress(p);
  } else {
    setPhaseProgress(0);
  }
} catch (err) {
  console.error("Failed to fetch tasks:", err);
  setError("Failed to load tasks. Please try again later.");
} finally {
  setLoading(false);
}

  }
   
  // Handle swipe from main card
  function handleSwipe(direction, ph, d) {
    if (!ph || !d) return;
    if (direction === "right") {
      setShowRightCard(true);
      setShowLeftCard(false);
      setShowHelpCard(false);
      setPhaseNumber(ph);
      setDayNumber(d);
    } else if (direction === "left") {
      setShowLeftCard(true);
      setShowRightCard(false);
      setShowHelpCard(false);
      setPhaseNumber(ph);
      setDayNumber(d);
    } else if (direction === "up") {
      // NEW: Show the help request card
      setShowHelpCard(true);
      setShowLeftCard(false);
      setShowRightCard(false);
      setPhaseNumber(ph);
      setDayNumber(d);
    }
  }

  // Close sub-cards
  function closeSubCard(statusSaved) {
    setShowLeftCard(false);
    setShowRightCard(false);
    fetchTasks();                

    if (statusSaved && phaseNumber === 2 && dayNumber) {
      const p1 = tasks.find(
        (t) => t.phaseid === 1 && t.taskid === dayNumber
      );
      if (p1) {
        setShadowTask(p1);
        setShowShadowCard(true);  
      }
    }
  }
  

  function goToGFitReport() {
    navigate("/gFitReport");
  }

  function goToBirdView() {
    navigate("/gritphases");
  }

  function goToGems() {
    navigate("/gems");
  }

  async function handleShadowSwipe(direction, taskObj) {
    if (direction === "right") {
      setShowShadowCard(false);
      setShowShadowRight(true);
      setShadowTask(taskObj);
    } else if (direction === "left") {
      setShowShadowCard(false);
      setShowShadowLeft(true);
      setShadowTask(taskObj);
    } else {
      // Up-swipe: just log quickly
      try {
        await axios.post("/api/logShadowSwipe",
          { taskdetailsId: taskObj.taskdetailsid, swipeDirection:"up" },
          { headers:{ Authorization:`Bearer ${accessToken}` } });
      } catch(e){ console.error("shadow up log",e); }
      setShowShadowCard(false);
    }
  }
  
  

 
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

    fetchGems();
  }, []);

  useEffect(() => {
    if (!accessToken) return;                      
    (async () => {
      try {
        const { data } = await axios.get("/userStats", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setCurrentStreak(data.current_streak || 0);
      } catch (err) {
        console.error("Failed to fetch streak:", err);
      }
    })();
  }, [accessToken]);


  

  // async function fetchStats() {
  //   try {
  //     const { data } = await axios.get("/api/userStats", {
  //       headers:{ Authorization:`Bearer ${accessToken}` }
  //     });
  //     setStats(data);
  //   } catch (e) { console.error("Stats fetch failed", e); }
  // }
  
  // useEffect(() => { if (accessToken) fetchStats(); }, [accessToken]);
  

  //gem
  useEffect(() => {
    if (!accessToken) {
      return void refreshAuthToken();
    }
  
    (async () => {
      try {
        const { data } = await axios.get("/api/bonusStatus", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const validUntil = data.bonus_valid_until   ?? data.validUntil   ?? data.unlockedAt;
        const used       = data.bonus_used          ?? data.bonusUsed     ?? data.used;
  
        if (!validUntil || used) {
          setBonusAvailable(false);
          return;
        }
  
        // still inside the 24‑hour window?
        const expiresAt = new Date(validUntil).getTime();
        setBonusAvailable(Date.now() < expiresAt);
  
      } catch (err) {
        console.error("bonusStatus failed:", err);
        setBonusAvailable(false);
      }
    })();
  }, [accessToken, refreshAuthToken]);


  /* 
    If user hasn't dismissed intro => show the IntroCard 
    layered on top of everything 
  */
  function renderIntroCard() {
    if (!showIntro) return null;

    return (
      <IntroCard
        onClose={() => {
          setShowIntro(false);
          localStorage.setItem("introDismissed", "true");
        }}
      />
    );
  }

  const prevPhase = useRef(null);
  useEffect(() => {
    if (!currentTask) return;
    const nowPhase = currentTask.phaseid;
    if (prevPhase.current === 1 && nowPhase === 2 && !localStorage.getItem(phaseFbKey)) {
      setShowPhaseFB(true);
    }
    prevPhase.current = nowPhase;
}, [currentTask, phaseFbKey]);

useEffect(() => {
  if (!tasks.length || localStorage.getItem(midP3Key)) return;

  const completedP3 = tasks.filter(
    (t) => t.phaseid === 3 && t.taskstatus === "Completed"
  ).length;

  if (completedP3 >= 2) {
    setShowMidP3FB(true);
  }
}, [tasks, midP3Key]);

useEffect(() => {
  (async () => {
    try {
      const { data } = await axios.get("/api/whatsNew");
      if (data && data.key) {
        setLatestUpdate(data);
        const seen = localStorage.getItem(`whatsNewSeen_${data.key}`);
        if (!seen) {
          setShowBanner(true);
        }
      }
    } catch (err) {
      console.error("Failed to fetch whatsNew:", err);
    }
  })();
}, []);


function handleBannerClose() {
  if (latestUpdate && latestUpdate.key) {
    localStorage.setItem(
      `whatsNewSeen_${latestUpdate.key}`,
      "1"
    );
  }
  setShowBanner(false);
}


  // If left swipe sub-card
  if (showLeftCard) {
    return (
      <div className="cardview-container">
      <header className="gritphase-header">
        <img src={logo} alt="Logo" className="logo-gritPhases-task" onClick={goToBirdView} />
        <div className="phase-row">
          <span className="phase-title">
            GritPhase {currentTask ? currentTask.phaseid : "?"}
          </span>
          <div className="progress-bar-container">
            <div className="progress-bar-fill" style={{ width: `${phaseProgress}%` }} />
          </div>
        </div>
        <div
          className="gems-display"
          onClick={goToGems}
          style={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            position: "absolute",
            right: "60px",
            // marginLeft: "auto",
          }}
        >
          <Gem size={30} color="#00bcd4" />
          <span style={{ marginLeft: "0.5rem", fontWeight: "bold", fontSize: "1.2rem" }}>
            {gems}
          </span>
        </div>


       
          {/* <div onClick={goToGems} style={{ display:"flex", alignItems:"center", cursor:"pointer" }}>
            <Gem size={28} color="#00bcd4" />
            <span style={{ marginLeft:6, fontWeight:600 }}>{stats.gems}</span>
          </div>

         
          <div title="Current streak" style={{ display:"flex", alignItems:"center" }}>
            <Flame size={26} color="#ff5722" />
            <span style={{ marginLeft:4, fontWeight:600 }}>{stats.current_streak}</span>
          </div> */}


        <ClipboardCheck size={32} onClick={goToGFitReport} className="grid-icon" />
      </header>

        <div className="card-wrapper">
          <InternalLeftSwipeCard
            phaseNumber={phaseNumber}
            dayNumber={dayNumber}
            onClose={closeSubCard}
            onUpdateStatus={fetchTasks}
          />
        </div>
        <TabBar />

        {/* Render the intro card if still showing */}
        {renderIntroCard()}
      </div>
    );
  }

  // If right swipe sub-card
  if (showRightCard) {
    return (
      <div className="cardview-container">
      <header className="gritphase-header">
        <img src={logo} alt="Logo" className="logo-gritPhases-task" onClick={goToBirdView} />
        <div className="phase-row">
          <span className="phase-title">
            GritPhase {currentTask ? currentTask.phaseid : "?"}
          </span>
          <div className="progress-bar-container">
            <div className="progress-bar-fill" style={{ width: `${phaseProgress}%` }} />
          </div>
        </div>
        <div
          className="gems-display"
          onClick={goToGems}
          style={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            position: "absolute",
            right: "60px",
            // marginLeft: "auto",
          }}
        >
          <Gem size={30} color="#00bcd4" />
          <span style={{ marginLeft: "0.5rem", fontWeight: "bold", fontSize: "1.2rem" }}>
            {gems}
          </span>
        </div>
        <ClipboardCheck size={32} onClick={goToGFitReport} className="grid-icon" />
      </header>

        <div className="card-wrapper">
          <InternalRightSwipeCard
            phaseNumber={phaseNumber}
            dayNumber={dayNumber}
            onClose={closeSubCard}
            onUpdateStatus={fetchTasks}
            onStreakChange={setCurrentStreak} 
          />
        </div>
        <TabBar />

        {renderIntroCard()}
      </div>
    );
  }

  // If showHelpCard is true, render the up-swipe card
if (showHelpCard) {
  return (
    <div className="cardview-container">
      <header className="gritphase-header">
        <img src={logo} alt="Logo" className="logo-gritPhases-task" onClick={goToBirdView} />
        <div className="phase-row">
          <span className="phase-title">
            GritPhase {currentTask ? currentTask.phaseid : "?"}
          </span>
          <div className="progress-bar-container">
            <div className="progress-bar-fill" style={{ width: `${phaseProgress}%` }} />
          </div>
        </div>
        <div
          className="gems-display"
          onClick={goToGems}
          style={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            position: "absolute",
            right: "60px",
            // marginLeft: "auto",
          }}
        >
          <Gem size={30} color="#00bcd4" />
          <span style={{ marginLeft: "0.5rem", fontWeight: "bold", fontSize: "1.2rem" }}>
            {gems}
          </span>
        </div>
        <ClipboardCheck size={32} onClick={goToGFitReport} className="grid-icon" />
      </header>

      <div className="card-wrapper">
        <InternalHelpSwipeCard
          phaseNumber={phaseNumber}
          dayNumber={dayNumber}
          onHelpSent={() => setShowHelpFB(true)} 
          onClose={() => {
            setShowHelpCard(false);
            fetchTasks();
          }}
        />
      </div>

      <TabBar />
      {renderIntroCard()}
    </div>
  );
}

/* ========== SHADOW — RIGHT-SWIPE CONFIRMATION ========== */
if (showShadowRight && shadowTask) {
  return (
    <div className="cardview-container">
      {/*  same header block you use everywhere  */}
      <header className="gritphase-header">
        <img src={logo} alt="Logo" className="logo-gritPhases-task"
             onClick={goToBirdView} />
        <div className="phase-row">
          <span className="phase-title">
            GritPhase {currentTask ? currentTask.phaseid : "?"}
          </span>
          <div className="progress-bar-container">
            <div className="progress-bar-fill" style={{ width: `${phaseProgress}%` }} />
          </div>
        </div>
        <div className="gems-display" onClick={goToGems}
             style={{ display:"flex", alignItems:"center", cursor:"pointer",
                      position:"absolute", right:"60px" }}>
          <Gem size={30} color="#00bcd4" />
          <span style={{ marginLeft:"0.5rem", fontWeight:"bold",
                         fontSize:"1.2rem" }}>{gems}</span>
        </div>
        <ClipboardCheck size={32} onClick={goToGFitReport}
                           className="grid-icon" />
      </header>

      <div className="card-wrapper">
        <ShadowRightSwipeCard
          taskObj={shadowTask}
          onClose={(saved)=> {
            setShowShadowRight(false);
            /* 🔄  if user pressed Undo → restore the Phase-1 card */
            if (!saved) { setShowShadowCard(true); }
          }}
        />
      </div>
      <TabBar />
    </div>
  );
}

/* ========== SHADOW — LEFT-SWIPE CONFIRMATION ========== */
if (showShadowLeft && shadowTask) {
  return (
    <div className="cardview-container">
      <header className="gritphase-header">
        <img src={logo} alt="Logo" className="logo-gritPhases-task"
             onClick={goToBirdView} />
        <div className="phase-row">
          <span className="phase-title">
            GritPhase {currentTask ? currentTask.phaseid : "?"}
          </span>
          <div className="progress-bar-container">
            <div className="progress-bar-fill" style={{ width: `${phaseProgress}%` }} />
          </div>
        </div>
        <div className="gems-display" onClick={goToGems}
             style={{ display:"flex", alignItems:"center", cursor:"pointer",
                      position:"absolute", right:"60px" }}>
          <Gem size={30} color="#00bcd4" />
          <span style={{ marginLeft:"0.5rem", fontWeight:"bold",
                         fontSize:"1.2rem" }}>{gems}</span>
        </div>
        <ClipboardCheck size={32} onClick={goToGFitReport}
                           className="grid-icon" />
      </header>

      <div className="card-wrapper">
        <ShadowLeftSwipeCard
          taskObj={shadowTask}
          onClose={(saved)=> {
            setShowShadowLeft(false);
            if (!saved) { setShowShadowCard(true); }
          }}
        />
      </div>
      <TabBar />
    </div>
  );
}


if (showShadowCard && shadowTask) {
  return (
    <div className="cardview-container">
      <header className="gritphase-header">
        <img src={logo} alt="Logo" className="logo-gritPhases-task" onClick={goToBirdView} />
        <div className="phase-row">
          <span className="phase-title">
            GritPhase {currentTask ? currentTask.phaseid : "?"}
          </span>
          <div className="progress-bar-container">
            <div className="progress-bar-fill" style={{ width: `${phaseProgress}%` }} />
          </div>
        </div>
        <div
          className="gems-display"
          onClick={goToGems}
          style={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            position: "absolute",
            right: "60px",
            // marginLeft: "auto",
          }}
        >
          <Gem size={30} color="#00bcd4" />
          <span style={{ marginLeft: "0.5rem", fontWeight: "bold", fontSize: "1.2rem" }}>
            {gems}
          </span>
        </div>
        <ClipboardCheck size={32} onClick={goToGFitReport} className="grid-icon" />
      </header>

      <div className="card-wrapper">
        <SwipeImageWithSpring
          phaseNumber={1}
          dayNumber={shadowTask.taskid}
          onSwipe={(dir) => handleShadowSwipe(dir, shadowTask)}
        >
          <div className="big-card">
            <h2 className="task-date" style={{display:"flex", alignItems:"center"}}>
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month:   "long",
                day:     "numeric",
              })}
              <Bell size={26} style={{position:"relative", left:"6.5rem", fill:"#ffffff"}} />
            </h2>
            <div className="shadow-card" style={{ position: "relative", top: "3rem", fontSize: "24px", fontWeight: 600 }} >Reminder</div>
            <p className="task-descrip">{shadowTask.taskdesc}</p>
          </div>
        </SwipeImageWithSpring>
      </div>

      <TabBar />
    </div>
  );
}


function sendFeedback() {
  if (feedback.sent || feedback.isLoading) return;
  if (feedback.rating === 0) return setFeedback(f => ({ ...f, error: "Pick a rating first!" }));

  setFeedback(f => ({ ...f, isLoading: true, error: null }));
  axios.post("/api/submitFeedback", {
      rating: feedback.rating,
      comment: feedback.comment.trim()
    }, { headers: { Authorization: `Bearer ${accessToken}` } })
    .then(() => setFeedback(f => ({ ...f, sent: true, isLoading: false })))
    .catch(() => setFeedback(f => ({ ...f, error: "Couldn’t save—try again", isLoading: false })));
}

function Star({ filled, onClick }) {
  return (
    <svg onClick={onClick} width="28" height="28" style={{ cursor:"pointer", marginRight:4 }}>
      <polygon
        points="14,1 18,10 28,10 20,16 23,26 14,20 5,26 8,16 0,10 10,10"
        fill={filled ? "#ffb400" : "#e0e0e0"}
      />
    </svg>
  );
}


  // Normal main card
  function renderMainCard(task) {
    if (!task) {
      // return (
      //   <div className="placeholder-card" style={{ background:"linear-gradient(180deg,#a2d3f2,#769fd1)" }}>
      //     <img src={gritfitLogo} alt="Logo" className="placeholder-logo" />
      //     <h2 className="placeholder-title">No New Tasks</h2>
            
      //     {/* ⭐⭐⭐⭐⭐  rating row */}
      //     <div style={{ display:"flex", justifyContent:"center", marginTop:"1rem" }}>
      //       {[1,2,3,4,5].map(n => (
      //         <Star key={n}
      //               filled={feedback.rating >= n}
      //               onClick={() => setFeedback(f => ({ ...f, rating:n }))} />
      //       ))}
      //     </div>
    
      //     {/* comment box */}
      //     <textarea
      //       placeholder="Tell us what you think of the MVP…"
      //       value={feedback.comment}
      //       onChange={e => setFeedback(f => ({ ...f, comment:e.target.value }))}
      //       disabled={feedback.sent}
      //       style={{
      //         marginTop:"1rem", width:"80%", minHeight:70,
      //         borderRadius:6, padding:8, resize:"vertical", color: "black"
      //       }}
      //     />
    
      //     {/* submit button */}
      //     <button className="doneBtn"
      //             onClick={sendFeedback}
      //             disabled={feedback.isLoading || feedback.sent}
      //             style={{ marginTop:"0.8rem" }}>
      //       {feedback.sent ? "Thanks! 💜" :
      //        feedback.isLoading ? "Sending…" : "Submit Feedback"}
      //     </button>
    
      //     {/* tiny status */}
      //     {feedback.error && <p style={{ color:"red", marginTop:4 }}>{feedback.error}</p>}
      //   </div>
      // );
        return (
          <div className="placeholder-card"
              style={{ background:"linear-gradient(180deg,#a2d3f2,#769fd1)" }}>
            <img src={gritfitLogo} alt="Logo" className="placeholder-logo" />
            <h2 className="placeholder-title">That’s all for now! 🎉</h2>
            <p style={{ margin:"0 32px" }}>
               We’ve got&nbsp;<strong>three quick steps</strong>&nbsp;that help shape the
  future of&nbsp;GritFit – it takes less than a minute!
            </p>
            <button className="welcome-next-btn" style={{ marginTop:32, position:"relative", top:"-3rem" }}
                    onClick={() => navigate("/postJourney")}>
              Sure – let’s do it
            </button>
          </div>
        );

    }

    

    
    const now = new Date();
    const actDate = task.task_activation_date ? new Date(task.task_activation_date) : null;
    const locked = (task.taskstatus === "Not Started" && actDate && actDate > now);

    if (locked) {
      const actTime = actDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      const actDay = actDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

      return (
        <div className="placeholder-card" style={{ background: "linear-gradient(180deg, #a2d3f2, #769fd1)" }}>
          <img src={gritfitLogo} alt="Logo" className="placeholder-logo" />
          <h2 className="placeholder-title">Task Activates On</h2>
          <p className="placeholder-text">{actDay} at {actTime}</p>
          <p className="placeholder-text">Stay tuned! You're on track to success.</p>
        </div>
      );
    }

    if (task.taskstatus === "In Progress") {
      return (
        <SwipeImageWithSpring onSwipe={handleSwipe} phaseNumber={task.phaseid} dayNumber={task.taskid}>
          <div className="big-card">
            <h2 className="task-date">
              {now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            </h2>
            <div className="streak">
          <Flame size={26} color="#ff5722" />
          <span style={{ marginLeft: 4, fontWeight: 600, fontSize: "21px" }}>{currentStreak}</span>
        </div>
            <p className="task-descrip">{task.taskdesc}</p>
            {/* <div className="swipe-hints">
              <div className="left-hint">
                <img src={leftIcon} alt="Swipe Left" className="swipe-left" />
                Couldn't do it
              </div>
              <div className="right-hint">
                Crushed it!
                <img src={rightIcon} alt="Swipe Right" className="swipe-right" />
              </div>
            </div> */}
            <div style={{position: "relative", top: "1.5rem"}}>
              Swipe Up for Help!
            </div>
          </div>
        </SwipeImageWithSpring>
      );
    }

    // Completed or Not Completed fallback
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });


    return (
      <div className="big-card" style={{ background: "linear-gradient(180deg, #a2d3f2, #769fd1)", left: "20px" }}>
        <h2 className="task-date">{tomorrowStr}</h2>
        <div className="streak">
          <Flame size={26} color="#ff5722" style={{fill:  "#ff5722"}} />
          <span style={{ marginLeft: 4, fontWeight: 600, fontSize: "21px" }}>{currentStreak + 1}</span>
        </div>
        <img
          src={gritfitLogo}
          alt="Logo"
          className="placeholder-logo"
          style={{ marginTop: "4rem", marginBottom: "6rem" }}
        />
        <h2 className="task-next" style={{ fontWeight: "normal"}}>
          Gear up for tomorrow's task!
        </h2>
      </div>
    );
  }

  

  return (
    <div className="cardview-container">
<header className="gritphase-header">
  {/* Logo & Phase Title (unchanged) */}
  <img
    src={logo}
    alt="Logo"
    className="logo-gritPhases-task"
    onClick={goToBirdView}
  />
  <div className="phase-row">
    <span className="phase-title">
      GritPhase {currentTask ? currentTask.phaseid : "?"}
    </span>
    <div className="progress-bar-container">
      <div
        className="progress-bar-fill"
        style={{ width: `${phaseProgress}%` }}
      />
    </div>
  </div>

  {/* ← Here’s the swapper: gift replaces gem+count */}
  <div
    onClick={bonusAvailable ? () => navigate("/bonus") : goToGems}
    style={{
      position: "absolute",
      right: "60px",
      display: "flex",
      alignItems: "center",
      cursor: "pointer",
    }}
  >
    {bonusAvailable ? (
      /* Active bonus: only gift icon */
      <Gift size={35} color="#00bcd4" fill="#00bcd4" />
    ) : (
      /* No bonus: show gem and count */
      <>
        <Gem size={30} color="#00bcd4" />
        <span
          style={{
            marginLeft: "0.5rem",
            fontWeight: "bold",
            fontSize: "1.2rem",
          }}
        >
          {gems}
        </span>
      </>
    )}
  </div>


  <ClipboardCheck
    size={32}
    onClick={goToGFitReport}
    className="grid-icon"
  />

  <SupportButton token={accessToken} />
</header>



      {loading && <p className="loading-text">Loading tasks...</p>}
      {error && <p className="error-text">{error}</p>}

      <div className="card-wrapper">{renderMainCard(currentTask)}



      </div>
      {/* {bonusAvailable && (
          <Gift
            size={32}
            className="gift-icon"
            onClick={() => navigate("/bonus")}
            title="Bonus Mission"
       
          />
        )} */}
        



{showPhaseFB && (
  <div style={{ opacity: 0.95, zIndex: 9999 }}>
          <FeedbackPrompt
            feature="PHASE_GP1_GP2"
            question="How was your GritPhase 1 experience?"
            placeholder="What helped you succeed the most?"
            onClose={() => {
              localStorage.setItem(phaseFbKey, "1");
              setShowPhaseFB(false);
            }}
          />
          </div>
        )}

{showMidP3FB && (
  <div style={{ opacity: 0.95, zIndex: 9999 }}>
  <FeedbackPrompt
    feature="PHASE3_MID"
    question="You’re halfway through Phase 3! How’s it going so far?"
    placeholder="Any tweaks you’d like to see?"
    onClose={() => {
      localStorage.setItem(midP3Key, "1");  
      setShowMidP3FB(false);
    }}
  />
  </div>
)}

{showHelpFB && (
  <div style={{ opacity: 0.95, zIndex: 9999 }}>
    <FeedbackPrompt
      feature="HELP_REQUEST"
      question="Did this feature feel useful?"
      placeholder="What would make this better?"
      onClose={() => setShowHelpFB(false)}
    />
  </div>
)}

{showBanner && latestUpdate && (
  <WhatsNewBanner onClose={handleBannerClose}>
    <h3 style={{ marginTop: 0 }}>{latestUpdate.title}</h3>
    <ul style={{ paddingLeft: 20 }}>
      {latestUpdate.bullets.map((b, i) => (
        <li key={i}>{b}</li>
      ))}
    </ul>
  </WhatsNewBanner>
)}


      <TabBar />
      

      {/* Render the intro card if user hasn't dismissed yet */}
      {showIntro && <IntroCard onClose={() => {
        setShowIntro(false);
        localStorage.setItem("introDismissed", "true");
      }} />}
    </div>
  );
}
