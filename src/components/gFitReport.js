import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo1.png";
import trend from "../assets/trend.png";
import "../css/gFitReport.css";
import "../css/CardView.css";
import axios from "../axios";
import TabBar from "./TabBar";
import { useNavigate } from "react-router-dom";
import FeedbackPrompt from "../components/FeedbackPrompt";

const Calendar = ({ userProgress }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState([]);
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  useEffect(() => {
    generateCalendarDays();
  }, [currentDate]);

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startBlanks = firstDay.getDay();
    const blanksArray = Array(startBlanks).fill(null);
    const daysArray = Array.from({ length: lastDay.getDate() }, (_, i) => i + 1);
    setCalendarDays([...blanksArray, ...daysArray]);
  };

  const getDayClass = (day) => {
    if (!day) return "";
    const y = currentDate.getFullYear();
    const m = String(currentDate.getMonth() + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    const cellDate = `${y}-${m}-${d}`;

    const matches = userProgress.filter((t) => {
      if (!t.completion_date) return false;
      const dt = new Date(t.completion_date);
      const loc = [
        dt.getFullYear(),
        String(dt.getMonth() + 1).padStart(2, "0"),
        String(dt.getDate()).padStart(2, "0"),
      ].join("-");
      return loc === cellDate;
    });

    if (matches.some((t) => t.taskstatus === "Completed")) return "green";
    if (matches.some((t) => t.taskstatus === "Not Completed")) return "red";
    if (matches.some((t) => t.taskstatus === "In Progress")) return "blue";
    return "";
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button
          className="arrow-button"
          onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}
        >
          &lt;
        </button>
        <h2>
          {currentDate.toLocaleString("default", { month: "long" })} {currentDate.getFullYear()}
        </h2>
        <button
          className="arrow-button"
          onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}
        >
          &gt;
        </button>
      </div>
      <div className="days-header">
        {dayNames.map((n) => (
          <div key={n} className="day-name">{n}</div>
        ))}
      </div>
      <div className="calendar-grid">
        {[...Array(6)].map((_, week) => (
          <div key={week} className="days-grid">
            {calendarDays.slice(week * 7, (week + 1) * 7).map((day, idx) => (
              <div key={idx} className={`calendar-day ${getDayClass(day)}`}>{day || ""}</div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

const PieChartComponent = ({ userProgress, shadowSwipes }) => {
  const predefined = ["Feeling unwell", "Lack of motivation", "Cheat day", "Too busy"];
  const COLORS = ["#1f32c0", "#6577fb", "#000d6b", "#3b4489", "#1991f8"];

  const allReasons = [
    ...(userProgress?.filter(t => t.notcompletionreason).map(t => t.notcompletionreason) || []),
    ...(shadowSwipes?.map(s => s.reason) || [])
  ];

  const counts = allReasons.reduce((acc, reason) => {
    const r = predefined.includes(reason) ? reason : "Other";
    acc[r] = (acc[r] || 0) + 1;
    return acc;
  }, {});

  const data = Object.entries(counts || {}).map(([name, value]) => ({ name, value }));

  if (!data.length) {
    return (
      <div className="pie-chart-empty">
        <p>No incomplete tasks yet!<br />Keep up the great work!</p>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }) =>
    active && payload?.length ? (
      <div className="pie-tooltip">
        <p className="pie-tooltip-title">{payload[0].name}</p>
        <p className="pie-tooltip-value">{`${payload[0].value} times`}</p>
      </div>
    ) : null;

  return (
    <div>
      <div className="pie-chart-container">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={100}
              dataKey="value"
              labelLine={false}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="pie-legend">
        {data.map((e, i) => (
          <div key={i} className="legend-item">
            <div className="legend-color" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
            <span className="legend-text">{e.name} ({e.value})</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function GFitReport() {
  const { accessToken, refreshAuthToken } = useAuth();
  const navigate = useNavigate();

  const [taskData, setTaskData] = useState([]);
  const [shadowSwipes, setShadowSwipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFB, setShowFB] = useState(false);

  useEffect(() => {
    const keyViews = "analyticsViews";
    const keyAsked = "trendsFb";
    const views = parseInt(localStorage.getItem(keyViews) || "0", 10) + 1;
    localStorage.setItem(keyViews, views);
    if (views >= 2 && !localStorage.getItem(keyAsked)) {
      setShowFB(true);
    }
  }, []);

  useEffect(() => {
    if (!accessToken) refreshAuthToken();
  }, [accessToken, refreshAuthToken]);

  useEffect(() => {
    if (!accessToken) return;
    setLoading(true);
    axios
      .post("/api/getUserProgress", {}, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then((r) => {
        setTaskData(r.data.data || []);
        setShadowSwipes(r.data.shadowSwipes || []);
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, [accessToken]);

  const goHome = () => navigate("/cardView");

  return (
    <>
      <header className="gritphase-header">
        <img src={logo} alt="Logo" className="logo-gritPhases-task" onClick={goHome} />
      </header>

      <div className="main-content">
        <div className="fullpage-report">
          <div className="report_header">
            <div className="report_header-text">
              <img src={trend} alt="trend" />
              GFit Report
            </div>
          </div>

          <div className="body_page">
            {loading ? (
              <div className="loading-message">Loading data…</div>
            ) : (
              <>
                <div className="calendar_section">
                  <div className="pie-heading">Consistency Calendar</div>
                  <div className="header_line">
                    Are you team Green or Red? Get a bird's‑eye view of your consistency this month!
                  </div>
                  <Calendar userProgress={taskData} />
                </div>

                <div className="pie_section">
                  <div className="pie-heading">Inconsistency Pie</div>
                  <div className="pie-text">
                    Discover what's been keeping you from hitting your daily goals. Hover over each part of the pie to see which reasons have been the biggest and smallest hurdles on your journey to a healthier lifestyle!
                  </div>
                  <PieChartComponent userProgress={taskData} shadowSwipes={shadowSwipes} />
                </div>
              </>
            )}
          </div>

          <div style={{ marginTop: "1rem", marginRight: "auto", marginLeft: "auto", display: "flex", flexDirection: "column", width: "70%" }}>
            <button
              className="px-4 py-2 rounded bg-black text-white text-sm"
              onClick={() => setShowFB(true)}
            >
              Give feedback
            </button>
          </div>
        </div>
      </div>

      {showFB && (
        <FeedbackPrompt
          feature="GFIT_TRENDS"
          question="Was this page helpful?"
          placeholder="What would make it more useful?"
          onClose={() => {
            localStorage.setItem("trendsFb", "1");
            setShowFB(false);
          }}
        />
      )}

      <TabBar />
    </>
  );
}
