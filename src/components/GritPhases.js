import React, { useState, useRef, useEffect } from "react";
import NavBar from "./navBar";
import logo from "../assets/logo1.png";
import buttonImage from "../assets/Stepping_StoneBtn.png";
import rightSwipeButtonImage from "../assets/RightSwipe_SteppingStoneBtn.png";
import leftSwipeButtonImage from "../assets/LeftSwipe_SteppingStoneBtn.png";
import activeButtonImage from "../assets/Active_SteppingStoneBtn.png";
import "../css/GritPhases.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "../axios";
import "../css/NutritionTheory.css";
import "../css/contactUs.css";
import "../css/CardView.css";
import { ChartNoAxesColumn } from "lucide-react";
import TabBar from "./TabBar";

const GritPhase = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [currentPhase, setCurrentPhase] = useState(1);
  const [currentTask, setCurrentTask] = useState(null);
  const [phaseProgress, setPhaseProgress] = useState(0);
  const [taskData, setTaskData] = useState(null);
  const [phases, setPhases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [requestTime, setRequestTime] = useState(null);
  const scrollableRef = useRef(null);
  const taskRefs = useRef({});
  const navigate = useNavigate();
  const location = useLocation();
  const { accessToken, refreshAuthToken } = useAuth();
  const { phase, day } = location.state || {};
  const handleNavClose = () => setIsNavOpen(false);
  const handleNavOpen = () => setIsNavOpen(true);


  useEffect(() => {
    if (!accessToken) {
      refreshAuthToken();
    }
  }, [accessToken, refreshAuthToken]);


  useEffect(() => {
    const fetchTaskData = async () => {
      setLoading(true);
      setError(null);
      setRequestTime(null);

      const startTime = Date.now();

      try {
        const response = await axios.post(
          "/api/getTaskData",
          {},
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const elapsed = Date.now() - startTime;
        setRequestTime(elapsed);

        const mergedData = response.data.data;
        console.log("[GritPhases_NoSwipe] Data from server:", mergedData);

        // If all tasks are "Not Started", start from Phase1 Day1
        const allTasksNotStarted = mergedData.every(
          (task) => task.taskstatus === "Not Started"
        );
        if (allTasksNotStarted && mergedData.length > 0) {
          await axios.post(
            "/api/userprogressStart",
            { phaseId: 1, taskId: 1 },
            { headers: { Authorization: `Bearer ${accessToken}` } }
          );
          return fetchTaskData(); // re-fetch
        }

        // auto-activate tasks
        const now = new Date();
        const updatedData = mergedData.map((task) => {
          if (task.taskstatus === "Not Started" && task.task_activation_date) {
            const activationDate = new Date(task.task_activation_date);
            if (now >= activationDate) {
              return { ...task, taskstatus: "In Progress" };
            }
          }
          return task;
        });

        setTaskData(updatedData);

        // Optionally find in-progress for progress bar
        const inProgress = updatedData.find(
          (t) => t.taskstatus === "In Progress"
        );
        setCurrentTask(inProgress || null);

        if (inProgress) {
          const phId = inProgress.phaseid;
          const tasksInPhase = updatedData.filter((t) => t.phaseid === phId);
          const completedCount = tasksInPhase.filter(
            (t) => t.taskstatus === "Completed"
          ).length;
          const totalCount = tasksInPhase.length;
          const progress =
            totalCount === 0
              ? 0
              : Math.round((completedCount / totalCount) * 100);
          setPhaseProgress(progress);
        } else {
          setPhaseProgress(0);
        }

        // Group tasks by phase
        const groupedByPhase = groupTasksByPhase(updatedData);
        setPhases(groupedByPhase);

      } catch (err) {
        console.error("[GritPhases_NoSwipe] Error fetching data:", err);
        setError("Failed to fetch user data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTaskData();

    const interval = setInterval(fetchTaskData, 300000);
    return () => clearInterval(interval);
  }, [accessToken]);


  useEffect(() => {
    const handleScroll = () => {
      if (!scrollableRef.current) return;

      const sections = scrollableRef.current.getElementsByClassName("section");
      const scrollPosition = scrollableRef.current.scrollTop;
      const windowHeight = window.innerHeight;

      for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        const sectionTop = section.offsetTop;
        if (scrollPosition >= sectionTop - windowHeight / 3) {
          setCurrentPhase(i + 1);
        }
      }
    };

    const scrollableElement = scrollableRef.current;
    if (scrollableElement) {
      scrollableElement.addEventListener("scroll", handleScroll);
      return () => {
        scrollableElement.removeEventListener("scroll", handleScroll);
      };
    }
  }, []);

  // 7) Merge duplicates by highest priority
  const mergeDuplicateTasks = (tasks) => {
    const statusPriority = {
      Completed: 3,
      "In Progress": 2,
      "Not Completed": 1,
      "Not Started": 0,
    };
    const uniqueMap = {};

    for (const t of tasks) {
      const key = `${t.phaseid}-${t.taskid}`;
      if (!uniqueMap[key]) {
        uniqueMap[key] = t;
      } else {
        const existingTask = uniqueMap[key];
        if (
          statusPriority[t.taskstatus] >
          statusPriority[existingTask.taskstatus]
        ) {
          uniqueMap[key] = t;
        }
      }
    }
    return Object.values(uniqueMap);
  };

  // 8) Group tasks by phase
  const groupTasksByPhase = (tasks) => {
    const deduped = mergeDuplicateTasks(tasks);
    return deduped.reduce((acc, task) => {
      if (!acc[task.phaseid]) {
        acc[task.phaseid] = [];
      }
      acc[task.phaseid].push(task);
      return acc;
    }, {});
  };

  // 9) Render phases
  const renderPhasesWithDays = (phases) => {
    const phaseKeys = Object.keys(phases);

    return phaseKeys.map((phaseId) => {
      const tasks = phases[phaseId];

      let phaseTitle = tasks[0]?.title || `GritPhase ${phaseId}`;
      if (parseInt(phaseId, 10) === 3) {
        phaseTitle = "Mystery Phase ❓";
      }

      let phaseDescription =
        parseInt(phaseId, 10) % 3 === 0
          ? "Flip the Day to see the task!"
          : tasks[0].taskdesc;

      return (
        <section key={phaseId} className={`section section-${phaseId}`}>
          <div className="grit-phase-title">
            {phaseTitle}
            <p className="grit-phase-desc">{phaseDescription}</p>
          </div>
          {renderDayButtons(phaseId, tasks)}
        </section>
      );
    });
  };

  // 10) Render day buttons (non-swipeable)
  const renderDayButtons = (phaseId, tasks) => {
    return (
      <div className="task-buttons">
        {tasks.map((task) => {
          const taskRefKey = `${task.phaseid}-${task.taskid}`;
          const dayNumber = task.taskid;
          const taskStatus = task.taskstatus;

          let dayButton = buttonImage;
          if (taskStatus === "Completed") {
            dayButton = rightSwipeButtonImage;
          } else if (taskStatus === "Not Completed") {
            dayButton = leftSwipeButtonImage;
          } else if (taskStatus === "In Progress") {
            dayButton = activeButtonImage;
          }

          return (
            <div key={dayNumber} className="task-button-container">
              <button
                ref={(el) => (taskRefs.current[taskRefKey] = el)}
                className="task-button"
              >
                <img
                  src={dayButton}
                  className="button-image"
                  alt={`Task ${dayNumber}`}
                />
                <div className="day-label">{dayNumber}</div>
              </button>
            </div>
          );
        })}
      </div>
    );
  };


  function goToCard() {
    navigate("/cardView");
  }

  function goToGFitReport() {
    navigate("/gFitReport");
  }

  return (
    <>
      

      <div className="grit-phase-container">
      <header className="gritphase-header-bubble">
          <img src={logo} alt="Logo" className="logo-gritPhases-task" onClick={goToCard} />
          <div className="phase-row">
            <span className="phase-title">GritPhase {currentTask ? currentTask.phaseid : "?"}</span>
            <div className="progress-bar-container">
              <div className="progress-bar-fill" style={{ width: `${phaseProgress}%` }} />
            </div>
          </div>
          <ChartNoAxesColumn size={24} onClick={goToGFitReport} className="grid-icon" />
        </header>

        <div className={`main-content ${isNavOpen ? "nav-open" : ""}`}>
          {loading && <h3>Loading...</h3>}
          {error && <p style={{ color: "red" }}>{error}</p>}

          {taskData && !loading && !error && (
            <div className="scrollable-content" ref={scrollableRef}>
              {renderPhasesWithDays(phases)}
            </div>
          )}
        </div>
      </div>
      <TabBar />
    </>
  );
};

export default GritPhase;
