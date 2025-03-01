import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Info, Menu } from "lucide-react";
import NavBar from "./navBar";
import logo from "../assets/logo1.png";
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
import "../css/contactUs.css";

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
        console.log("[GritPhases] Merged Data from server:", mergedData);


        const allTasksNotStarted = mergedData.every(
          (task) => task.taskstatus === "Not Started"
        );
        if (allTasksNotStarted && mergedData.length > 0) {
         
          await axios.post(
            "/api/userprogressStart",
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
          // console.log("Fetched Task Data:", mergedData);

          if (task.taskstatus === "Not Started" && task.task_activation_date) {
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
      return () =>
        scrollableElement.removeEventListener("scroll", handleScroll);
    }
  }, []);

  const mergeDuplicateTasks = (tasks) => {
    const statusPriority = {
      "Completed": 3,
      "In Progress": 2,  
      "Not Completed": 1,
      "Not Started": 0
    };
    const uniqueMap = {};

    for (const t of tasks) {
      const key = `${t.phaseid}-${t.taskid}`;
      if (!uniqueMap[key]) {
        uniqueMap[key] = t;
      } else {
        // Compare priorities
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

  // Utility function to group tasks by phase
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
    const [showModal, setShowModal] = useState(false);

    const handleFlip = () => {
        setIsFlipped((prev) => !prev);
    };

    const handleOpenModal = (e) => {
        e.stopPropagation();  // Prevent accidental flip while opening modal
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setIsFlipped(false);  // Reset to front side when modal closes
    };

    return (
        <div className={`flip-card ${isFlipped ? 'flipped' : ''}`} onClick={handleFlip}>
            <div className="flip-card-inner">
                {/* Front Side */}
                <div className="flip-card-front">
                    <img src={buttonImage} className="button-image" alt={`Task ${dayNumber}`} />
                    <div className="day-label">{dayNumber}</div>
                </div>

                {/* Back Side */}
                <div className="flip-card-back">
                    <img src={buttonImage} className="button-image" alt={`Task ${dayNumber}`} />
                    {/* Info button to open modal */}
                    <button className="info-button" onClick={handleOpenModal}>ℹ️</button>
                </div>
            </div>

            {/* Modal - Shows taskDesc */}
            {showModal && (
                <div className="popup-overlay" onClick={handleCloseModal}>
                    <div className="popup-content" onClick={(e) => e.stopPropagation()}>
                        <h3>Goal Details</h3>
                        <p>{taskDesc}</p>
                        <button onClick={handleCloseModal} className="close-button">
                          ✕
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

  // Render phases and their days
  const renderPhasesWithDays = (phases) => {
    const phaseKeys = Object.keys(phases); // Get all phase IDs
  
    return phaseKeys.map((phaseId) => {
      const tasks = phases[phaseId]; // Get tasks for the current phase
      
      // 1) Conditionally set the phase title
      let phaseTitle = tasks[0]?.title || `GritPhase ${phaseId}`;
      if (parseInt(phaseId, 10) === 3) {
        phaseTitle = "Mystery Phase ❓"; 
      }
  
      // 2) Conditionally set the phase description
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

  const handleRefresh = () => {
    caches.keys().then((names) => {
      names.forEach((name) => caches.delete(name));
    });
    localStorage.clear();
    sessionStorage.clear();
    setTimeout(() => {
      window.location.reload(true);
    }, 1000);
  };

  return (
    <div className="grit-phase-container">
      <NavBar isOpen={isNavOpen} onClose={handleNavClose} />

      <div className={`main-content ${isNavOpen ? "nav-open" : ""}`}>
        <header className="header">
        <div className="logo-container-task">

          <Menu
            className="hamburger-icon"
            size={24} // Adjust size as needed
            onClick={!isNavOpen ? handleNavOpen : undefined}
            style={{ cursor: "pointer", marginLeft: "10px", marginTop: "24px" }} // Adjust spacing
          />

          <img
            src={logo}
            alt="Logo"
            onClick={!isNavOpen ? handleNavOpen : undefined}
            className="logo-gritPhases-task"
          />
          
         

        </div>
          <div className="profile-button">
            {/* <button
              onClick={handleRefresh}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "transparent",
                color: "#007bff",
                borderRadius: "32px",
                fontSize: "25px",
                fontWeight: "500",
                cursor: "pointer",
                transition: "all 0.2s ease-in-out",
                marginTop: "38px",
                marginLeft: "92px",
              }}
            >
              🔄
            </button> */}
                      <button className="profile-button">
                        <Info size={24} />
                      </button>
          </div>
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
