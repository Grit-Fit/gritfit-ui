import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import "./gFitReport.css";

const Calendar = () => {
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

  const dayNames = ["M", "T", "W", "T", "F", "S"];

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <h2>
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
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
            >
              {day}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const PieChartComponent = () => {
  const data = [
    { name: "Feeling tired", value: 35 },
    { name: "Busy schedule", value: 25 },
    { name: "Weather conditions", value: 20 },
    { name: "Lack of motivation", value: 15 },
    { name: "Physical discomfort", value: 5 },
  ];

  const COLORS = ["#FF8042", "#00C49F", "#FFBB28", "#FF8042", "#0088FE"];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="pie-tooltip">
          <p className="pie-tooltip-title">{payload[0].name}</p>
          <p className="pie-tooltip-value">{`${payload[0].value}% of missed workouts`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="pie-chart-container">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={150}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      <div className="pie-legend">
        {data.map((entry, index) => (
          <div key={`legend-${index}`} className="legend-item">
            <div
              className="legend-color"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span className="legend-text">
              {entry.name} ({entry.value}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const GFitReport = () => {
  return (
    <div className="fullpage-report">
      <div className="report_header">
        <div className="report_header-text">
          Hello there,
          <br />
          This is your GFit Report
        </div>
      </div>
      <div className="body_page">
        <div className="calendar_section">
          <div className="heading-calendar">Consistency Calendar</div>
          <div className="header_line">
            Are you team Green or Red? Get a bird's eye view of your consistency
            this month!
          </div>
          <Calendar />
        </div>
        <div className="pie_section">
          <div className="pie-heading">Inconsistency Pie</div>
          <div className="pie-text">
            Discover what's been keeping you from hitting your daily goals.
            Hover over each part of the pie to see which reasons have been the
            biggest and smallest hurdles on your journey to a healthier
            lifestyle!
          </div>
          <PieChartComponent />
        </div>
      </div>
    </div>
  );
};

export default GFitReport;
