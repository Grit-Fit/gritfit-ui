import React, { useState, useEffect, useRef } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { ChevronDown, Info } from "lucide-react";
import NavBar from "./navBar";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/Logo.png";
import "./gFitReport.css";
import axios from "../axios";

const Calendar = ({ userProgress }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState([]);

  useEffect(() => {
    generateCalendarDays();
  }, [currentDate]);

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];

    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(i);
    }

    setCalendarDays(days);
  };

  // const getDayStatus = (day) => {
  //   if (!day) return null;

  //   if (userProgress) {
  //     const matchingTask = userProgress.find((task) => {
  //       if (!task.created_at || !task.completion_date) return false; // Handle missing dates
  //       const creationDate = task.created_at.split("T")[0];
  //       const completionDate = task.completion_date.split("T")[0];
  //       return creationDate === completionDate;
  //     });
  //     if (matchingTask) {
  //       // Determine the color based on task status
  //       console.log("Matching Task", matchingTask)
  //       if (matchingTask.taskstatus === "Completed") {
  //         console.log("Conpleted");
  //         return "green"; // Completed
  //       } else if (matchingTask.taskstatus === "Not Completed") {
  //         return "red"; // Not Completed
  //       } else if (matchingTask.taskstatus === "In Progress") {
  //         return "blue"; // In Progress
  //       } else {
  //         return "transparent";
  //       }
  //     }
  //   }

  //   // Return no color if no matching task or status doesn't match
  //   return null;
  // };

  const getDayStatus = (day) => {
    if (!day) return null;
  
    if (userProgress) {
      // Find all tasks that were created on the same day
      const matchingTasks = userProgress.filter((task) => {
        if (!task.created_at || !task.completion_date) return false; // Handle missing dates
        const creationDate = task.created_at.split("T")[0]; // Get date part only (ignoring time)
        return creationDate === `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      });
  
      if (matchingTasks.length > 0) {
        // Check the status of the first matching task (or apply your custom logic for multiple tasks)
        const taskStatus = matchingTasks[0].taskstatus; // Use the first task for now or combine statuses as needed
  
        // Determine the color based on task status
        if (taskStatus === "Completed") {
          return "lightgreen"; // Completed
        } else if (taskStatus === "Not Completed") {
          return "lightsalmon"; // Not Completed
        } else if (taskStatus === "In Progress") {
          return "lightblue"; // In Progress
        } else {
          return "transparent";
        }
      }
    }
  
    return null; // No color if no matching task or status doesn't match
  };
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayNames = ["M", "T", "W", "T", "F", "S", "Su"];

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        {/* Left Arrow for Previous Month */}
        <button
          className="arrow-button previous"
          onClick={() =>
            setCurrentDate(
              new Date(currentDate.setMonth(currentDate.getMonth() - 1))
            )
          }
        >
          &lt;
        </button>

        {/* Month Name */}
        <h2>
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>

        {/* Right Arrow for Next Month */}
        <button
          className="arrow-button next"
          onClick={() =>
            setCurrentDate(
              new Date(currentDate.setMonth(currentDate.getMonth() + 1))
            )
          }
        >
          &gt;
        </button>
      </div>

      <div className="calendar-grid">
        <div className="days-header">
          {dayNames.map((day) => (
            <div key={day}>{day}</div>
          ))}
        </div>
        <div className="days-grid">
          {calendarDays.map((day, index) => (
            <div
              key={index}
              className={`calendar-day ${
                day === currentDate.getDate() ? "current-day" : ""
              }`}
              style={{
                backgroundColor: getDayStatus(day),
              }}
            >
              {day}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const PieChartComponent = ({ userProgress }) => {
  const predefinedCategories = [
    "Feeling unwell",
    "Lack of motivation",
    "Cheat day",
    "Too busy",
  ];

  const COLORS = ["#FF8042", "#00C49F", "#FFBB28", "#D0ED57", "#0088FE"];

  // Process the userProgress to calculate reasons
  const reasonCounts = userProgress
    ?.filter((task) => task.notcompletionreason) // Only consider tasks with a notcompletionreason
    .reduce((acc, task) => {
      const reason = predefinedCategories.includes(task.notcompletionreason)
        ? task.notcompletionreason
        : "Other"; // Categorize as "Other" if not in predefined categories
      acc[reason] = (acc[reason] || 0) + 1; // Increment count for the reason
      return acc;
    }, {});

  // Prepare data for the PieChart
  const chartData = Object.entries(reasonCounts || {}).map(([name, value]) => ({
    name,
    value,
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="pie-tooltip">
          <p className="pie-tooltip-title">{payload[0].name}</p>
          <p className="pie-tooltip-value">{`${payload[0].value} times`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <div className="pie-chart-container">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Legend */}
      <div className="pie-legend">
        {chartData.map((entry, index) => (
          <div key={`legend-${index}`} className="legend-item">
            <div
              className="legend-color"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span className="legend-text">
              {entry.name} ({entry.value})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const GFitReport = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const { accessToken, refreshAuthToken } = useAuth();
  const [taskData, setTaskData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    const fetchTaskData = async () => {
      setLoading(true);
      setError(null);

      console.time("Fetch User Data"); // Start timing the request
      const startTime = Date.now(); // Alternative timing method

      try {
        const response = await axios.post(
          "http://localhost:5050/api/getUserProgress",
          {},
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        // console.log("Merged Data: ", response.data.data)
        const elapsed = Date.now() - startTime; // Calculate elapsed time
        console.timeEnd("Fetch User Data"); // End timing the request
        const userProgressData = response.data.data;
        console.log("User Progress Data: ", userProgressData);
        setTaskData(userProgressData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch user data. Please try again later.");
      } finally {
        setLoading(false);
        console.log("Task Data: ", taskData);
      }
    };
    fetchTaskData();
  }, []);
  return (
    <div>
      <NavBar isOpen={isNavOpen} onClose={handleNavClose} />

      <div className={`main-content ${isNavOpen ? "nav-open" : ""}`}>
        <header className="gfit-report-header">
          <div className="logo-container">
            <img
              src={logo}
              alt="Logo"
              onClick={!isNavOpen ? handleNavOpen : undefined}
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
        <div className="fullpage-report">
          <div className="report_header">
            <div className="report_header-text">
              Hello there,
              <br />
              This is your GFit Report
            </div>
          </div>
          <div className="body_page">
            {loading ? (
              <div className="loading-message">Loading data...</div>
            ) : (
              <>
                <div className="calendar_section">
                  <div className="heading-calendar">Consistency Calendar</div>
                  <div className="header_line">
                    Are you team Green or Red? Get a bird's eye view of your
                    consistency this month!
                  </div>
                  <Calendar userProgress={taskData} />
                </div>
                <div className="pie_section">
                  <div className="pie-heading">Inconsistency Pie</div>
                  <div className="pie-text">
                    Discover what's been keeping you from hitting your daily
                    goals. Hover over each part of the pie to see which reasons
                    have been the biggest and smallest hurdles on your journey
                    to a healthier lifestyle!
                  </div>
                  <PieChartComponent userProgress={taskData} />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GFitReport;
