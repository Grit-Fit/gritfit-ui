import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import NavBar from "./navBar";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/GritFit_Full.png";
import "../css/gFitReport.css";
import axios from "../axios";
import nutritionPdf from "../assets/Nutrition101PDF.pdf";

const Calendar = ({ userProgress }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState([]);

  // Day-of-week labels (Sunday start)
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // On mount or when currentDate changes, rebuild the array
  useEffect(() => {
    generateCalendarDays();
  }, [currentDate]);

  // EXACT changes to create a real grid:
  const generateCalendarDays = () => {
    if (!currentDate) return;

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // Number of blanks before day 1
    const startBlanks = firstDay.getDay(); // 0=Sunday, 1=Mon, etc.
    // Build an array of 'null' that many times
    const blanksArray = Array(startBlanks).fill(null);

    // Then the actual days for this month
    const daysArray = [];
    for (let d = 1; d <= lastDay.getDate(); d++) {
      daysArray.push(d);
    }

    // Final array => blank cells + real days
    setCalendarDays([...blanksArray, ...daysArray]);
  };

  // EXACT same getDayClass logic from your code, but not repeated
  function getDayClass(day) {
    if (!day) return "";
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const dayStr = String(day).padStart(2, "0");
    const dateString = `${year}-${month}-${dayStr}`;

    // From your code: searching userProgress for completion_date
    if (userProgress) {
      const tasksForDay = userProgress.filter((task) => {
        if (!task.created_at || !task.completion_date) return false;
        const creationDate = task.created_at.split("T")[0];
        return creationDate === dateString;
      });

      if (tasksForDay.length > 0) {
        const status = tasksForDay[0].taskstatus;
        if (status === "Completed") return "green";
        if (status === "Not Completed") return "red";
        if (status === "In Progress") return "blue";
      }
    }
    return "";
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

      {/* Day-of-week row */}
      <div className="day-names">
        {dayNames.map((dn) => (
          <div key={dn} className="day-name">
            {dn}
          </div>
        ))}
      </div>

      {/* We have at most 42 cells: (startBlanks + totalDays). If the month uses 31 days + offset = up to 35 or 36 etc. */}
      <div className="month-grid">
        {[...Array(6)].map((_, rowIndex) => (
          <div key={rowIndex} className="week-row">
            {calendarDays.slice(rowIndex * 7, (rowIndex + 1) * 7).map((day, i) => (
              <div key={i} className={`calendar-day ${getDayClass(day)}`}>
                {/* day might be null => show blank */}
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
                  <a href={nutritionPdf} download className="downloadButton">Nutrition 101 PDF ⬇️</a>
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
