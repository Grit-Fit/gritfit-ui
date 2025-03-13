import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "../axios"; 
import { useAuth } from "../context/AuthContext";
import SwipeImageWithSpring from "./SwipeImageWithSpring";
import "../css/CardView.css";
import rightIcon from "../assets/rightf.png";
import leftIcon from "../assets/leftf.png";
import TabBar from "./TabBar";
import gritfitLogo from "../assets/logo1.png"; 
import logo from "../assets/logo1.png";
import { LayoutGrid, Undo2, Redo2 } from "lucide-react";

/* 
----------------------------------------------------------
 Left Swipe "Card" Content 
 (the old leftSwipe screen, but we ONLY show the card body)
----------------------------------------------------------
*/
function InternalLeftSwipeCard({
  phaseNumber,
  dayNumber,
  onClose,
  onUpdateStatus, 
}) {
  const { accessToken, refreshAuthToken } = useAuth();
  const [selectedButton, setSelectedButton] = useState(null);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [otherReason, setOtherReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const phaseId = parseInt(phaseNumber, 10);

  // Ensure token
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
      const requestData = {
        phaseId: phaseId,
        taskId: parseInt(dayNumber, 10),
        reasonForNonCompletion: reason,
        failedGoal: phaseId === 3 ? selectedGoal : null,
      };

      await axios.post("/api/userprogressNC", requestData, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

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
      style={{
        background: "linear-gradient(180deg, #EFB034FF 0%, #EF5634FF 47%)", left: "20px"
      }}
    >
      {/* "Undo" in the top-right corner of the card */}
      <div className="undo" onClick={onClose}>
        Undo Swipe<Redo2 style={{ width: "24px", height: "24px" }} />
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {phaseId === 3 && !selectedGoal ? (
        <>
          <h2 style={{ marginBottom: "4.5rem", marginTop: "4rem" }}>Which goal were you unable to achieve?</h2>
          <button className="goalBtn" onClick={() => handleGoalSelection("Protein Goal")}>Protein Goal</button>
          <h3> OR </h3>
          <button className="goalBtn" onClick={() => handleGoalSelection("Fat Goal")}>Water Goal</button>
        </>
      ) : (
        <>
          <h2 style={{ marginBottom: "1rem", marginTop: "3rem" }}>
            It's okay! What was your biggest hurdle today?
          </h2>

          {!selectedButton ? (
            <div className="body_images" style={{ marginTop: "1rem", gap:"15px" }}>
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
----------------------------------------------------------
 Right Swipe "Card" Content
 (the old rightSwipe, but only the big card content)
----------------------------------------------------------
*/
function InternalRightSwipeCard({
  phaseNumber,
  dayNumber,
  onClose,
  onUpdateStatus,
}) {
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
      style={{
        background: "linear-gradient(180deg, #1DD75BFF 0%, #D79D1DFF 100%)", left: "20px"
      }}
    >
      {/* Undo icon top-right */}
      <div className="undo" onClick={onClose}>
        Undo Swipe<Undo2 style={{ width: "24px", height: "24px" }} />
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

/* 
----------------------------------------------------------
 Main CardView 
 (header + footer remain; only the middle card changes)
----------------------------------------------------------
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
  const [phaseNumber, setPhaseNumber] = useState(null);
  const [dayNumber, setDayNumber] = useState(null);

  
  useEffect(() => {
    if (!accessToken) {
      refreshAuthToken().catch(() => navigate("/login"));
    }
  }, [accessToken, refreshAuthToken, navigate]);

 
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

  // Fetch tasks
  useEffect(() => {
    fetchTasks();
    const interval = setInterval(fetchTasks, 600000); 
    return () => clearInterval(interval);
  }, [accessToken]);

  const [isFirstLoad, setIsFirstLoad] = useState(true);

  async function fetchTasks() {
    if (!accessToken) return;
    setLoading(true);
    if (isFirstLoad) {
      setLoading(true);
    }
    setError(null);

    try {
      const resp = await axios.post("/api/getTaskData", {}, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const allTasks = resp.data.data || [];
      const now = new Date();

      // auto-activate
      const updated = allTasks.map(t => {
        if (t.taskstatus === "Not Started" && t.task_activation_date) {
          const act = new Date(t.task_activation_date);
          if (now >= act) {
            return { ...t, taskstatus: "In Progress" };
          }
        }
        return t;
      });
      setTasks(updated);

      // Find next in-progress or not-started
      let nextTask = updated.find(t => t.taskstatus === "In Progress");
      if (!nextTask) {
        const notStarted = updated
          .filter(t => t.taskstatus === "Not Started")
          .sort((a, b) => new Date(a.task_activation_date) - new Date(b.task_activation_date));
        if (notStarted.length > 0) nextTask = notStarted[0];
      }
      setCurrentTask(nextTask || null);

    } catch (err) {
      console.error("Failed to fetch tasks:", err);
      setError("Failed to load tasks. Please try again later.");
    } finally {
      setLoading(false);
      setIsFirstLoad(false);
    }
  }

  // Phase progress
  useEffect(() => {
    if (!currentTask || tasks.length === 0) {
      setPhaseProgress(0);
      return;
    }
    const ph = currentTask.phaseid;
    const tasksInPhase = tasks.filter(t => t.phaseid === ph);
    const completed = tasksInPhase.filter(t => t.taskstatus === "Completed").length;
    const total = tasksInPhase.length;

    if (total === 0) {
      setPhaseProgress(0);
      return;
    }
    setPhaseProgress(Math.round((completed / total) * 100));
  }, [currentTask, tasks]);

  // Called from the main "blue card" swipe
  function handleSwipe(direction, ph, d) {
    if (!ph || !d) return;
    if (direction === "right") {
      setShowRightCard(true);
      setShowLeftCard(false);
      setPhaseNumber(ph);
      setDayNumber(d);
    } else {
      setShowLeftCard(true);
      setShowRightCard(false);
      setPhaseNumber(ph);
      setDayNumber(d);
    }
  }


  function closeSubCard() {
    setShowLeftCard(false);
    setShowRightCard(false);
    fetchTasks();
  }

  function goToGritPhase() {
    navigate("/gritPhases");
  }


  if (showLeftCard) {
    return (
      <div className="cardview-container">
        <header className="gritphase-header">
          <img src={logo} alt="Logo" className="logo-gritPhases-task" />
          <div className="phase-row">
            <span className="phase-title">GritPhase {currentTask ? currentTask.phaseid : "?"}</span>
            <div className="progress-bar-container">
              <div className="progress-bar-fill" style={{ width: `${phaseProgress}%` }} />
            </div>
          </div>
          <LayoutGrid size={24} onClick={goToGritPhase} className="grid-icon" />
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
      </div>
    );
  }


  if (showRightCard) {
    return (
      <div className="cardview-container">
        <header className="gritphase-header">
          <img src={logo} alt="Logo" className="logo-gritPhases-task" />
          <div className="phase-row">
            <span className="phase-title">GritPhase {currentTask ? currentTask.phaseid : "?"}</span>
            <div className="progress-bar-container">
              <div className="progress-bar-fill" style={{ width: `${phaseProgress}%` }} />
            </div>
          </div>
          <LayoutGrid size={24} onClick={goToGritPhase} className="grid-icon" />
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
      </div>
    );
  }

  // Otherwise, show the main "blue" card with normal logic
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
          <div className="big-card" style={{ background: "linear-gradient(180deg, #00bfff, #5ec8f2)" }}>
            <h2 className="task-date">{now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</h2>
            <p className="task-descrip">{task.taskdesc}</p>
            <div className="swipe-hints">
              <div className="left-hint">
                <img src={leftIcon} alt="Swipe Left" className="swipe-left" />
                Couldn't do it
              </div>
              <div className="right-hint">
                Crushed it!
                <img src={rightIcon} alt="Swipe Right" className="swipe-right" />
              </div>
            </div>
          </div>
        </SwipeImageWithSpring>
      );
    }
    // Completed or Not Completed
    const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);

      // Format tomorrow’s date as a string
      const tomorrowStr = tomorrow.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      });

    return (
      <div className="big-card" style={{ background: "linear-gradient(180deg, #a2d3f2, #769fd1)", left: "20px" }}>
        <h2 className="task-date">{tomorrowStr}</h2>
        <img src={gritfitLogo} alt="Logo" className="placeholder-logo" style={{marginTop: "4rem", marginBottom: "6rem"}} />
        <h2 className="task-date" style={{fontWeight:"normal"}}>Gear up for tomorrow's task! 🚀</h2>
      </div>
    );
  }

  return (
    <div className="cardview-container">
      <header className="gritphase-header">
        <img src={logo} alt="Logo" className="logo-gritPhases-task" />
        <div className="phase-row">
          <span className="phase-title">
            GritPhase {currentTask ? currentTask.phaseid : "?"}
          </span>
          <div className="progress-bar-container">
            <div className="progress-bar-fill" style={{ width: `${phaseProgress}%` }} />
          </div>
        </div>
        <LayoutGrid size={24} onClick={goToGritPhase} className="grid-icon" />
      </header>

      {loading && <p className="loading-text">Loading tasks...</p>}
      {error && <p className="error-text">{error}</p>}

      <div className="card-wrapper">
        {renderMainCard(currentTask)}
      </div>

      <TabBar />
    </div>
  );
}
