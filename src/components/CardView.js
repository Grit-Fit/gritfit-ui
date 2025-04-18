import React, { useState, useEffect } from "react";
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
import { Gem, Undo2, ChartNoAxesColumn, Redo2,MoveDown, Gift } from "lucide-react";

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
      if (onClose) onClose();
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
      <div className="undo-left" onClick={onClose}>
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
function InternalRightSwipeCard({ phaseNumber, dayNumber, onClose, onUpdateStatus }) {
  const { accessToken, refreshAuthToken } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!accessToken) {
      refreshAuthToken();
    }
  }, [accessToken, refreshAuthToken]);

  async function doneBtnClick(e) {
    e.preventDefault();
    if (!phaseNumber || !dayNumber) {
      setError("Missing required information");
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      await axios.post("/api/userprogressC", {
        phaseId: parseInt(phaseNumber, 10),
        taskId: parseInt(dayNumber, 10),
      }, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (onUpdateStatus) onUpdateStatus();
      if (onClose) onClose();
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
      <div className="undo" onClick={onClose}>
        Undo Swipe <Undo2 style={{ width: "24px", height: "24px" }} />
      </div>

      <div className="body-text" style={{ marginTop: "80px", textAlign: "center" }}>
        <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
          Yayy! You did it!
        </h2>
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
        style={{ marginTop: "2rem" }}
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
function InternalHelpSwipeCard({ phaseNumber, dayNumber, onClose }) {
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
  function closeSubCard() {
    setShowLeftCard(false);
    setShowRightCard(false);
    fetchTasks();
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
        <ChartNoAxesColumn size={36} onClick={goToGFitReport} className="grid-icon" />
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
        <ChartNoAxesColumn size={36} onClick={goToGFitReport} className="grid-icon" />
      </header>

        <div className="card-wrapper">
          <InternalRightSwipeCard
            phaseNumber={phaseNumber}
            dayNumber={dayNumber}
            onClose={closeSubCard}
            onUpdateStatus={fetchTasks}
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
        <ChartNoAxesColumn size={36} onClick={goToGFitReport} className="grid-icon" />
      </header>

      <div className="card-wrapper">
        <InternalHelpSwipeCard
          phaseNumber={phaseNumber}
          dayNumber={dayNumber}
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


  // Normal main card
  function renderMainCard(task) {
    if (!task) {
      return (
        <div className="placeholder-card" style={{ background: "linear-gradient(180deg, #a2d3f2, #769fd1)" }}>
          <img src={gritfitLogo} alt="Logo" className="placeholder-logo" />
          <h2 className="placeholder-title">No New Tasks</h2>
          <p className="placeholder-text">All tasks completed or unavailable!</p>
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
        <img
          src={gritfitLogo}
          alt="Logo"
          className="placeholder-logo"
          style={{ marginTop: "4rem", marginBottom: "6rem" }}
        />
        <h2 className="task-date" style={{ fontWeight: "normal" }}>
          Gear up for tomorrow's task!
        </h2>
      </div>
    );
  }

  

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
        <ChartNoAxesColumn size={36} onClick={goToGFitReport} className="grid-icon" />
      </header>


      {loading && <p className="loading-text">Loading tasks...</p>}
      {error && <p className="error-text">{error}</p>}

      <div className="card-wrapper">{renderMainCard(currentTask)}

      </div>
      {bonusAvailable && (
          <Gift
            size={32}
            className="gift-icon"
            onClick={() => navigate("/bonus")}
            title="Bonus Mission"
          />
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
