import React, { useState, useEffect, useRef } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { ChevronDown, Info } from "lucide-react";
import NavBar from "./navBar";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/GritFit_Full.png";
import "../css/gFitReport.css";
import axios from "../axios";
import nutritionPdf from "../assets/Nutrition101PDF.pdf";

function Calendar({ userProgress }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState([]);

  // Generate the days for the current month
  useEffect(() => {
    generateCalendarDays();
  }, [currentDate]);

  function generateCalendarDays() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // 1) First day of the month
    const firstDay = new Date(year, month, 1);
    // 2) Last day of the month
    const lastDay = new Date(year, month + 1, 0);

    const days = [];
    // Add nulls for offset so the 1st day aligns with correct weekday
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }
    // Then add the actual days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(i);
    }
    setCalendarDays(days);
  }

  // Move to previous month
  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));
  };

  // Move to next month
  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));
  };

  // Decide which color class (green/red/blue) to apply to a day
  function getDayClass(day) {
    if (!day) return ""; // empty cell for offset

    // Build a YYYY-MM-DD to compare with userProgress
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const dayStr = String(day).padStart(2, "0");
    const dateString = `${year}-${month}-${dayStr}`;

    // Find all tasks that match this date
    const tasksForDay = userProgress.filter((task) => {
      // If you store the date in "completion_date" or "created_at"
      // Adjust the logic to match your real fields
      const compDate = task.completion_date
        ? task.completion_date.split("T")[0]
        : null;
      const createdDate = task.created_at
        ? task.created_at.split("T")[0]
        : null;

      // In some setups, "In Progress" might not have completion_date yet
      // so you might match on "created_at" or "task_activation_date"
      return (
        compDate === dateString ||
        createdDate === dateString
        // OR check activation date if needed
      );
    });

    if (tasksForDay.length === 0) {
      // No tasks found for this date => no color
      return "";
    }

    // If multiple tasks in one day, decide the color priority
    // e.g. if any are "Not Completed," we color red
    // else if all are "Completed," color green
    // else if any are "In Progress," color blue

    const hasNotCompleted = tasksForDay.some(
      (t) => t.taskstatus === "Not Completed"
    );
    const allCompleted = tasksForDay.every((t) => t.taskstatus === "Completed");
    const hasInProgress = tasksForDay.some((t) => t.taskstatus === "In Progress");

    if (hasNotCompleted) {
      return "red";
    } else if (allCompleted) {
      return "green";
    } else if (hasInProgress) {
      return "blue";
    }
    return ""; // no color if none match
  }

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
        <button className="arrow-button previous" onClick={handlePrevMonth}>
          &lt;
        </button>
        <h2>
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <button className="arrow-button next" onClick={handleNextMonth}>
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
          {calendarDays.map((day, index) => {
            const dayClass = getDayClass(day);
            return (
              <div
                key={index}
                className={`calendar-day ${dayClass}`}
              >
                {day}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

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
  const [username, setUsername] = useState(""); 

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
    const fetchUsername = async () => {
      try {
        const response = await axios.get("/api/getUserProfile", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setUsername(response.data.username || "");
      } catch (error) {
        console.error("Error fetching username:", error);
      }
    };

    if (accessToken) {
      fetchUsername();
    }
  }, [accessToken]);

  useEffect(() => {
    const fetchTaskData = async () => {
      setLoading(true);
      setError(null);

      console.time("Fetch User Data"); // Start timing the request
      const startTime = Date.now(); // Alternative timing method

      try {
        const response = await axios.post(
          "/api/getUserProgress",
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
          <div className="logo-container1">
            <img
              src={logo}
              alt="Logo"
              onClick={!isNavOpen ? handleNavOpen : undefined}
            />
            {/* <ChevronDown
              className={`chevron ${isNavOpen ? "rotated" : ""}`}
              size={24}
            /> */}
          </div>

          {/* <button className="profile-button">
            <Info size={24} />
          </button> */}
        </header>
        <div className="fullpage-report">
          <div className="report_header">
            <div className="report_header-text">
              Hello there, {username}!
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
                <div className="pie_section">
                  <div className="pie-heading">Fitness Guide</div>
                  <p>
                   Ready to dive deeper into your nutrition? Download our comprehensive "Nutrition 101" guide to learn all you need to start eating healthier today!
                  </p>
                        <a href={nutritionPdf} download className="downloadButton">
                          Nutrition 101 PDF ⬇️
                        </a>
                    
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
