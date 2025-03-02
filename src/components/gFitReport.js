import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import NavBar from "./navBar";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/GritFit_Full.png";
import "../css/gFitReport.css";
import axios from "../axios";
import nutritionPdf from "../assets/Nutrition101PDF.pdf";
import GeneratePdf from "./GeneratePdfButton";
import { ChevronDown, Info, Menu } from "lucide-react";

const Calendar = ({ userProgress }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState([]);

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  useEffect(() => {
    generateCalendarDays();
  }, [currentDate]);

  const generateCalendarDays = () => {
    if (!currentDate) return;

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const startBlanks = firstDay.getDay();
    const blanksArray = Array(startBlanks).fill(null);

    const daysArray = [];
    for (let d = 1; d <= lastDay.getDate(); d++) {
      daysArray.push(d);
    }

    setCalendarDays([...blanksArray, ...daysArray]);
  };

  // 🔴 **Fix: Ensure Proper Date Matching**
  function getDayClass(day) {
    if (!day || !currentDate) return "";
  
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const dayStr = String(day).padStart(2, "0");
    const dateString = `${year}-${month}-${dayStr}`;
  
    console.log("Checking date:", dateString);
    console.log("userProgress:", userProgress);
  
    if (userProgress && Array.isArray(userProgress)) {
      const matchingTasks = userProgress.filter((task) => {
        if (!task.completion_date) return false;
        const taskDate = task.completion_date.split("T")[0];
        return taskDate === dateString;
      });
  
      if (matchingTasks.length > 0) {
        // Prioritize "Completed" > "Not Completed" > "In Progress"
        if (matchingTasks.some((t) => t.taskstatus === "Completed")) return "green";
        if (matchingTasks.some((t) => t.taskstatus === "Not Completed")) return "red";
        if (matchingTasks.some((t) => t.taskstatus === "In Progress")) return "blue";
      }
    }
  
    return ""; // Default if no task matches
  }

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button
          className="arrow-button"
          onClick={() =>
            setCurrentDate(
              new Date(
                currentDate.getFullYear(),
                currentDate.getMonth() - 1,
                1
              )
            )
          }
        >
          &lt;
        </button>
        <h2>
          {currentDate.toLocaleString("default", { month: "long" })}{" "}
          {currentDate.getFullYear()}
        </h2>
        <button
          className="arrow-button"
          onClick={() =>
            setCurrentDate(
              new Date(
                currentDate.getFullYear(),
                currentDate.getMonth() + 1,
                1
              )
            )
          }
        >
          &gt;
        </button>
      </div>

      <div className="days-header">
        {dayNames.map((day) => (
          <div key={day} className="day-name">
            {day}
          </div>
        ))}
      </div>

      <div className="calendar-grid">
        {[...Array(6)].map((_, weekIndex) => (
          <div key={weekIndex} className="days-grid">
            {calendarDays
              .slice(weekIndex * 7, (weekIndex + 1) * 7)
              .map((day, idx) => (
                <div key={idx} className={`calendar-day ${getDayClass(day)}`}>
                  {day || ""}
                </div>
              ))}
          </div>
        ))}
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
  const [taskData, setTaskData] = useState([]); // Ensure it's an empty array initially
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (!accessToken) refreshAuthToken();
  }, [accessToken, refreshAuthToken]);

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const response = await axios.get("/api/getUserProfile", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setUsername(response.data.username || "");
      } catch (error) {
        console.error("Error fetching username:", error);
      }
    };
    if (accessToken) fetchUsername();
  }, [accessToken]);

  const [maintenance, setMaintenance] = useState(null);
  const [macros, setMacros] = useState(null);

  useEffect(() => {
    const fetchUserNutrition = async () => {
      try {
        const response = await axios.get("/api/getUserNutrition", {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        if (response.data?.data) {
          const userData = response.data.data;

          // Suppose userData has userData.maintenance_calories, etc.
          const m = userData.maintenance_calories;
          setMaintenance(m);

          
          if (m) {
            const proteinCalories = m * 0.25;
            const carbCalories = m * 0.5;
            const fatCalories = m * 0.25;
            setMacros({
              protein: Math.round(proteinCalories / 4),
              carbs: Math.round(carbCalories / 4),
              fats: Math.round(fatCalories / 9),
            });
          }
        }
      } catch (error) {
        console.error("Error fetching user data for carousel:", error);
      }
    };

    if (accessToken) {
      fetchUserNutrition();
    }
  }, [accessToken]);

  useEffect(() => {
    const fetchTaskData = async () => {
      setLoading(true);
      try {
        const response = await axios.post("/api/getUserProgress", {}, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setTaskData(response.data.data || []); // Ensure it's never null
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    if (accessToken) fetchTaskData();
  }, [accessToken]);

  return (
    <div>
      <NavBar isOpen={isNavOpen} onClose={() => setIsNavOpen(false)} />
      <div className="main-content">
        <header className="gfit-report-header">
          <div className="logo-container1">
          <Menu
                        className="hamburger-icon"
                        size={24} // Adjust size as needed
                        onClick={() => setIsNavOpen(!isNavOpen)} 
                        style={{cursor: "pointer", marginLeft: "-16px", marginTop: "10px", marginRight: "8px" }} // Adjust spacing
            />
            <img src={logo} alt="Logo" onClick={() => setIsNavOpen(!isNavOpen)} />
          </div>
        </header>
        <div className="fullpage-report">
          <div className="report_header">
            <div className="report_header-text">Hello there, {username}!<br />This is your GFit Report</div>
          </div>
          <div className="body_page">
            {loading ? <div className="loading-message">Loading data...</div> : (
              <>
                <div className="calendar_section">
                  <h3>Consistency Calendar</h3>
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
                  <h3>Fitness Guide</h3>
                  <p>
                   Ready to dive deeper into your nutrition? Download our comprehensive "Nutrition 101" guide to learn all you need to start eating healthier today!
                  </p>
                  {/* <a href={nutritionPdf} download className="downloadButton">Nutrition 101 PDF ⬇️</a> */}

                  <div>
                    {maintenance && macros && (
                      <GeneratePdf
                        userName={username} // Or fetch username from DB as well
                        maintenanceCalories={maintenance}
                        macros={macros}
                      />
                    )}
                  </div>
                  
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
