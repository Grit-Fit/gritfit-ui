import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Info } from "lucide-react";
import NavBar from "./navBar";
import logo from "../assets/Logo.png";
import buttonImage from "../assets/Stepping_StoneBtn.png";
import rightSwipeButtonImage from "../assets/RightSwipe_SteppingStoneBtn.png";
import leftSwipeButtonImage from "../assets/LeftSwipe_SteppingStoneBtn.png";
import activeButtonImage from "../assets/Active_SteppingStoneBtn.png";
import "./GritPhases.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SwipeImageWithSpring from "./SwipeImageWithSpring";
import axios from "../axios";

const GritPhase = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [currentPhase, setCurrentPhase] = useState(1);
  const scrollableRef = useRef(null);
  const taskRefs = useRef({}); // Array of refs for each task button
  const navigate = useNavigate();
  const location = useLocation();
  const { accessToken, refreshAuthToken } = useAuth();
  const [taskData, setTaskData] = useState(null);
  const [phases, setPhases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [requestTime, setRequestTime] = useState(null); // Track request time

  useEffect(() => {
    // If there is no accessToken, try to refresh it by calling the backend refresh route
    if (!accessToken) {
      refreshAuthToken(); // Refresh token by making API call to the backend
    }
  }, [accessToken, refreshAuthToken]);
  const handleNavClose = () => {
    setIsNavOpen(false);
  };

  const handleNavOpen = () => {
    setIsNavOpen(true);
  };
  console.log("State Values: ", location.state);
  const { phase, day } = location.state || {};
  const nutritiontheoryRef = useRef(null);

  //Swipe logic:
  const handleSwipe = (direction, phaseNumber, dayNumber, e) => {
    // e.preventDefault();
    console.log("Navigating to Swipe with:", { phaseNumber, dayNumber });

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

  useEffect(() => {
    const fetchTaskData = async () => {
      setLoading(true);
      setError(null);
      setRequestTime(null);

      console.time("Fetch User Data"); // Start timing the request
      const startTime = Date.now(); // Alternative timing method

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
        // console.log("Merged Data: ", response.data.data)
        const elapsed = Date.now() - startTime; // Calculate elapsed time
        setRequestTime(elapsed); // Set request time in state

        console.timeEnd("Fetch User Data"); // End timing the request
        const mergedData = response.data.data;
        const allTasksNotStarted = !mergedData.some(
          (task) => task.taskstatus !== "Not Started"
        );
        if (allTasksNotStarted) {
          const startProgressResponse = await axios.post(
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
          console.log("Start Progress: ", startProgressResponse.data);
          fetchTaskData();
        } else {
          setTaskData(mergedData); // Set the user data
          nutritiontheoryRef.current = mergedData[0].nutritiontheory;
          const groupedByPhase = groupTasksByPhase(mergedData);
          setPhases(groupedByPhase);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch user data. Please try again later.");
      } finally {
        setLoading(false);
        console.log("Task Data: ", taskData);
      }
    };
    fetchTaskData();
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
        // clearTimeout(timer); // Cleanup timeout if the component unmounts
        scrollableElement.removeEventListener("scroll", handleScroll);
    }
  }, []);

  const handleTaskResets = async () => {
    const now = new Date();
    const currentDate = now.toLocaleDateString(); // Get current local date in local time zone
    if (taskData) {
      // Group tasks by phaseid and taskdetailid
      const groupedTasks = taskData.reduce((acc, task) => {
        const { phaseid, taskdetailid, taskstatus } = task;
        const groupKey = `${phaseid}-${taskdetailid}`;

        if (!acc[groupKey]) {
          acc[groupKey] = [];
        }

        acc[groupKey].push(task);
        return acc;
      }, {});

      // Process grouped tasks for reset logic
      for (const taskGroup of Object.values(groupedTasks)) {
        const phaseId = taskGroup[0]?.phaseid;
        const leftSwipes = taskGroup.filter(
          (task) => task.taskstatus === "Not Completed"
        );
        console.log("Left Swipes: ", leftSwipes);
        if (phaseId === 3 && leftSwipes.length > 0) {
          // Phase 3: No left swipes are allowed, reset immediately
          const lastSwipeDate =
            leftSwipes[leftSwipes.length - 1]?.lastswipedat || null;
          if (new Date(lastSwipeDate).toLocaleDateString() !== currentDate){
            const task = leftSwipes[leftSwipes.length - 1];
            try {
              await axios.post(
                "http://localhost:5050/api/userprogressStart",
                {
                  phaseId: task.phaseid,
                  taskId: task.taskid,
                },
                {
                  headers: {
                    Authorization: `Bearer ${accessToken}`,
                  },
                }
              );

              // Update local task data
              task.taskstatus = "Not Started";
              task.lastswipedat = new Date().toLocaleString();
            } catch (err) {
              console.error(
                `Failed to reset task ${task.taskid} for phase 3:`,
                err
              );
            }
          }
        } else if (leftSwipes.length > 1) {
          // Other phases: Handle swipes logic
          const lastSwipeDate =
            leftSwipes[leftSwipes.length - 1]?.lastswipedat || null;
          console.log("Last Swipe Date: ", new Date(lastSwipeDate).toLocaleDateString(), "\n Current Date: ", currentDate);
          if (new Date(lastSwipeDate).toLocaleDateString() !== currentDate) {
            // If swipes occurred on different days, reset the tasks
            const task = leftSwipes[leftSwipes.length - 1];
            try {
              await axios.post(
                "http://localhost:5050/api/userprogressStart",
                {
                  phaseId: task.phaseid,
                  taskId: task.taskid,
                },
                {
                  headers: {
                    Authorization: `Bearer ${accessToken}`,
                  },
                }
              );

              // Update local task data
              task.taskstatus = "Not Started";
              task.lastswipedat = new Date().toLocaleString();
            } catch (err) {
              console.error(`Failed to reset task ${task.taskid}:`, err);
            }
          }
        }
      }
    }
  };

  // Function to scroll to the active task
  const scrollToActiveTask = () => {
    if (taskData) {
      // Group tasks by phase
      const groupedTasks = groupTasksByPhase(taskData);

      let activeTaskIndex = -1;
      let activeTaskFound = false;
      // Loop through each phase and find the active task
      Object.keys(groupedTasks).forEach((phaseId) => {
        if (activeTaskFound) return;
        const tasksInPhase = groupedTasks[phaseId];
        const inProgressIndex = tasksInPhase.findIndex(
          (task) => task.taskstatus === "In Progress"
        );

        // If no task is "In Progress", find the first "Not Started" task
        if (inProgressIndex !== -1) {
          activeTaskIndex = inProgressIndex; // Task found in this phase
        } else {
          const notStartedIndex = tasksInPhase.findIndex(
            (task) => task.taskstatus === "Not Started"
          );
          activeTaskIndex = notStartedIndex;
        }

        // If an active task is found in this phase, scroll to it
        if (activeTaskIndex !== -1) {
          const activeTask = tasksInPhase[activeTaskIndex];
          const taskRefKey = `${activeTask.phaseid}-${activeTask.taskid}`;
          if (taskRefs.current[taskRefKey]) {
            taskRefs.current[taskRefKey].scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          }
          activeTaskFound = true;
        }
      });
    }
  };

  const activateNextTask = async () => {
    const now = new Date();
    const currentLocalDate = now.toLocaleDateString(); // Get current local date in local time zone
    if (taskData) {
      // Find the first task with "Not Started" status
      const notStartedTaskIndex = taskData.findIndex(
        (task) => task.taskstatus === "Not Started"
      );

      const inProgressIndex = taskData.findIndex(
        (task) => task.taskstatus === "In Progress"
      );

      if (inProgressIndex !== -1) {
        console.log("The required task is already active.");
        return;
      }

      if (notStartedTaskIndex === -1) {
        console.log("All tasks are either completed.");
        return;
      }

      const previousTask = taskData[notStartedTaskIndex - 1];
      const notStartedTask = taskData[notStartedTaskIndex];

      // Check if the task has been swiped today
      const lastSwipeDate = previousTask.lastswipedat
        ? new Date(previousTask.lastswipedat).toLocaleDateString()
        : null;

      // If the task was swiped today, don't activate it
      if (lastSwipeDate === currentLocalDate) {
        console.log(
          "This task was already swiped today, waiting for the next day."
        );
        return;
      }

      // It is after midnight, activate the task
      console.log("Activating next task...");

      // Set task status to "In Progress"
      notStartedTask.taskstatus = "In Progress";

      try {
        // Update backend to set task status as "In Progress"
        await axios.post(
          "http://localhost:5050/api/userprogressStart",
          {
            phaseId: notStartedTask.phaseid,
            taskId: notStartedTask.taskid,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        // Update frontend state
        const updatedTasks = [...taskData];
        updatedTasks[notStartedTaskIndex] = notStartedTask; // Update the specific task
        setTaskData(updatedTasks);

        console.log("Task activated successfully.");
      } catch (err) {
        console.error("Failed to activate the task:", err);
      }
    }
  };

  useEffect(() => {
    if (taskData !== undefined) {
      console.log("Updated Task Data: ", taskData);
      handleTaskResets();
      activateNextTask();
      setTimeout(scrollToActiveTask, 1000);
    }
  }, [taskData]); // Logs whenever taskData changes

  const groupTasksByPhase = (tasks) => {
    return tasks.reduce((acc, task) => {
      // If the phase does not exist, create an empty array for that phaseid
      if (!acc[task.phaseid]) {
        acc[task.phaseid] = [];
      }
      acc[task.phaseid].push(task);
      return acc;
    }, {});
  };

  // Flipable Button Component
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

  const renderPhasesWithDays = (phases) => {
    const phaseKeys = Object.keys(phases); // Get all phase IDs

    return phaseKeys.map((phaseId) => {
      const tasks = phases[phaseId]; // Get tasks for the current phase
      const phaseTitle = tasks[0]?.title || `GritPhase ${phaseId}`; // Use the title from the first task
      let phaseDescription =
        phaseId % 3 === 0 ? "Flip the Day to see the task!" : tasks[0].taskdesc; // Use the description from the first task
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
    // const days = phaseId % 3 === 0 ? [1, 2, 3, 4] : [1, 2, 3, 4, 5];
    const task_index = Object.keys(tasks);
    //index is the index of the tasks object.
    return (
      <div className="task-buttons">
        {task_index.map((index) => {
          const taskRefKey = `${tasks[index].phaseid}-${tasks[index].taskid}`;
          const dayNumber = tasks[index].taskid;
          const taskStatus = tasks[index].taskstatus;
          const taskDescription = tasks[index].taskdesc;
          // Default class for the button image
          let dayButton = buttonImage; // Default button image class

          // If rightSwipe is true, add the green button class
          if (taskStatus === "Completed") {
            dayButton = rightSwipeButtonImage; // Append green-button class
          }
          // If leftSwipe is true, add the red button class
          else if (taskStatus === "Not Completed") {
            dayButton = leftSwipeButtonImage; // Append red-button class
          } else if (taskStatus === "In Progress") {
            // If task is in progress add the active button.
            dayButton = activeButtonImage;
          }

          // Condition to decide whether to wrap with SwipeImageWithSpring
          const shouldWrapWithSpring = !(
            taskStatus === "Completed" ||
            taskStatus === "Not Completed" ||
            taskStatus !== "In Progress"
          );

          return (
            <div key={dayNumber} className="task-button-container">
              {shouldWrapWithSpring ? (
                <SwipeImageWithSpring
                  onSwipe={handleSwipe}
                  phaseNumber={phaseId}
                  dayNumber={dayNumber}
                >
                  {/* Check if phaseNumber is divisible by 3 */}
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
                    src={dayButton} // Keep your image source
                    className="button-image" // Apply dynamic CSS class
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
          <div className="logo-container">
            <img
              src={logo}
              alt="Logo"
              onClick={!isNavOpen ? handleNavOpen : undefined}
              className="logo-gritPhases"
            />
            <ChevronDown
              className={`chevron ${isNavOpen ? "rotated" : ""}`}
              size={24}
            />
          </div>

          <button className="profile-button">
            <Info size={24} />
          </button>
        </header>
        {loading && (
          <div>
            <h3>Loading...</h3>
          </div>
        )}

        {error && (
          <div style={{ color: "red" }}>
            <p>{error}</p>
          </div>
        )}

        {taskData && !loading && !error && (
          <div>
            <div className="fasting-header">{nutritiontheoryRef.current}</div>
            <div className="scrollable-content" ref={scrollableRef}>
              {renderPhasesWithDays(phases)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GritPhase;
