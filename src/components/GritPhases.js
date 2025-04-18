import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Info } from "lucide-react";
import NavBar from "./navBar";
import logo from "../assets/Logo.png";
import buttonImage from "../assets/Stepping_StoneBtn.png";
import rightSwipeButtonImage from "../assets/RightSwipe_SteppingStoneBtn.png";
import leftSwipeButtonImage from "../assets/LeftSwipe_SteppingStoneBtn.png";
import activeButtonImage from "../assets/Active_SteppingStoneBtn.png";
import "../css/GritPhases.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SwipeImageWithSpring from "./SwipeImageWithSpring";
import axios from "../axios";
import "../css/NutritionTheory.css";

const GritPhase = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [currentPhase, setCurrentPhase] = useState(1);
  const scrollableRef = useRef(null);
  const taskRefs = useRef({}); 
  const navigate = useNavigate();
  const location = useLocation();
  const { accessToken, refreshAuthToken } = useAuth();
  const [taskData, setTaskData] = useState(null);
  const [phases, setPhases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [requestTime, setRequestTime] = useState(null); 

  const { phase, day } = location.state || {};

  // Toggle Nav
  const handleNavClose = () => setIsNavOpen(false);
  const handleNavOpen = () => setIsNavOpen(true);

  // Make sure we have an access token. If not, try to refresh.
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
          "http://localhost:5050/api/getTaskData",
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
        console.log("[GritPhases] Merged Data from server:", mergedData);


        const allTasksNotStarted = mergedData.every(
          (task) => task.taskstatus === "Not Started"
        );
        if (allTasksNotStarted && mergedData.length > 0) {
         
          await axios.post(
            "http://localhost:5050/api/userprogressStart",
            {
              phaseId: 1,
              taskId: 1,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          // Refetch to see the updated status
          return fetchTaskData();
        }

    
        const now = new Date();
        const updatedData = mergedData.map((task) => {
          console.log("Fetched Task Data:", mergedData);

          if (
            (task.taskstatus === "Not Started" || task.taskstatus === "Not Completed") &&
            task.task_activation_date
          ) {
            const activationDate = new Date(task.task_activation_date);
            if (now >= activationDate) {
              return { ...task, taskstatus: "In Progress" };
            }
          }
          return task;
        });
        

        setTaskData(updatedData);

       
        const groupedByPhase = groupTasksByPhase(updatedData);
        setPhases(groupedByPhase);
      } catch (err) {
        console.error("[GritPhases] Error fetching data:", err);
        setError("Failed to fetch user data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTaskData();

    
    const interval = setInterval(fetchTaskData, 60000);
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
      return () =>
        scrollableElement.removeEventListener("scroll", handleScroll);
    }
  }, []);

  // Utility function to group tasks by phase
  const groupTasksByPhase = (tasks) => {
    return tasks.reduce((acc, task) => {
      if (!acc[task.phaseid]) {
        acc[task.phaseid] = [];
      }
      acc[task.phaseid].push(task);
      return acc;
    }, {});
  };

  // On swipe or button press, we navigate to rightSwipe or leftSwipe
  const handleSwipe = (direction, phaseNumber, dayNumber) => {
    if (direction === "right") {
      
      navigate("/rightSwipe", {
        state: {
          phaseNumber,
          dayNumber,
        },
      });
    } else if (direction === "left") {
     
      navigate("/leftSwipe", {
        state: {
          phaseNumber,
          dayNumber,
        },
      });
    }
  };

  // Flipable Button (used for phases like 3, 6, etc.)
  const FlipableButton = ({ dayNumber, taskDesc, buttonImage, taskRefKey }) => {
    const [isFlipped, setIsFlipped] = useState(false);

    const handleFlip = () => {
      setIsFlipped((prev) => !prev);
    };

    return (
      <div
        className={`flip-card ${isFlipped ? "flipped" : ""}`}
        onClick={handleFlip}
      >
        <div className="flip-card-inner">
          {/* Front side */}
          <div
            ref={(el) => (taskRefs.current[taskRefKey] = el)}
            className="flip-card-front"
          >
            <img
              src={buttonImage}
              className="button-image"
              alt={`Task ${dayNumber}`}
            />
            <div className="day-label">{dayNumber}</div>
          </div>

          {/* Back side */}
          <div className="flip-card-back">
            <img
              src={buttonImage}
              className="button-image"
              alt={`Task ${dayNumber}`}
            />
            <div className="task-desc">{taskDesc}</div>
          </div>
        </div>
      </div>
    );
  };

  // Render phases and their days
  const renderPhasesWithDays = (phases) => {
    const phaseKeys = Object.keys(phases); // Get all phase IDs

    return phaseKeys.map((phaseId) => {
      const tasks = phases[phaseId]; // Get tasks for the current phase
      const phaseTitle = tasks[0]?.title || `GritPhase ${phaseId}`; // Use the title from the first task
      let phaseDescription =
        phaseId % 3 === 0 ? "Flip the Day to see the task!" : tasks[0].taskdesc; 
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

  
  const renderDayButtons = (phaseId, tasks) => {
    return (
      <div className="task-buttons">
        {tasks.map((task) => {
          const taskRefKey = `${task.phaseid}-${task.taskid}`;
          const dayNumber = task.taskid;
          const taskStatus = task.taskstatus;
          const taskDescription = task.taskdesc || "";

          
          let dayButton = buttonImage;
          if (taskStatus === "Completed") {
            dayButton = rightSwipeButtonImage; 
          } else if (taskStatus === "Not Completed") {
            dayButton = leftSwipeButtonImage; 
          } else if (taskStatus === "In Progress") {
            dayButton = activeButtonImage; 
          }

          const shouldEnableSwipe = taskStatus === "In Progress";

          return (
            <div key={dayNumber} className="task-button-container">
              {shouldEnableSwipe ? (
                <SwipeImageWithSpring
                  onSwipe={handleSwipe}
                  phaseNumber={phaseId}
                  dayNumber={dayNumber}
                >
                  {phaseId % 3 === 0 ? (
                    <FlipableButton
                      dayNumber={dayNumber}
                      taskDesc={taskDescription}
                      buttonImage={dayButton}
                      taskRefKey={taskRefKey}
                    />
                  ) : (
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
                  )}
                </SwipeImageWithSpring>
              ) : (
            
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
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="grit-phase-container">
      <NavBar isOpen={isNavOpen} onClose={handleNavClose} />

      <div className={`main-content ${isNavOpen ? "nav-open" : ""}`}>
        <header className="header">
          <div className="logo-container-task">
            <img
              src={logo}
              alt="Logo"
              onClick={!isNavOpen ? handleNavOpen : undefined}
              className="logo-gritPhases-task"
            />
            <ChevronDown
              className={`chevron-task ${isNavOpen ? "rotated" : ""}`}
              size={24}
            />
          </div>
          <button className="profile-button">
            <Info size={24} />
          </button>
        </header>

        {/* Show loading or errors */}
        {loading && <h3>Loading...</h3>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {/* Render phases + tasks if we have them */}
        {taskData && !loading && !error && (
          <div className="scrollable-content" ref={scrollableRef}>
            {renderPhasesWithDays(phases)}
          </div>
        )}
      </div>
    </div>
  );
};

export default GritPhase;
