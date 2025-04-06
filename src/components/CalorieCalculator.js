// src/components/CalorieCalculator.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import logo from "../assets/logo1.png";
import female_icon from "../assets/female.png";
import male_icon from "../assets/male.png";
import { PieChart } from "react-minimal-pie-chart";
import axios from "../axios";
import { useAuth } from "../context/AuthContext";
import "../css/CalorieCalculator.css";
import "../css/CardView.css";
import calc from "../assets/calc.png";
import TabBar from "./TabBar";

export default function CalorieCalculator() {
  // 1) States for user inputs
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("male");
  const [weight, setWeight] = useState("");
  const [weightUnit, setWeightUnit] = useState("lbs");
  const [height, setHeight] = useState("");
  const [heightUnit, setHeightUnit] = useState("feet");
  const [activity, setActivity] = useState(2);

  // 2) Goal => "recomp", "bulk", "cut"
  const [goal, setGoal] = useState("recomp");

  // 3) "maintenance" for the base Mifflin-St Jeor cals, "theoryCals" for goal-adjusted cals
  const [maintenance, setMaintenance] = useState(0);    // raw Mifflin cals
  const [theoryCals, setTheoryCals] = useState(0);      // +500/-500 if needed

  // 4) Macros from the raw "maintenance"
  const [macros, setMacros] = useState({ protein: 0, fats: 0, carbs: 0 });

  const { accessToken, refreshAuthToken } = useAuth();
  const navigate = useNavigate();

  // If no token, try refreshing
  useEffect(() => {
    if (!accessToken) {
      refreshAuthToken();
    }
  }, [accessToken, refreshAuthToken]);

  // Optionally fetch user data from your DB
  useEffect(() => {
    const fetchNutritionData = async () => {
      try {
        const res = await axios.get("/api/getUserNutrition", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (res.data?.data) {
          const userData = res.data.data;
          setAge(userData.age ?? "");
          setGender(userData.gender ?? "male");
          setWeight(userData.weight ?? "");
          setWeightUnit(userData.weight_unit ?? "lbs");
          setHeight(userData.height ?? "");
          setHeightUnit(userData.height_unit ?? "feet");
          setActivity(userData.activity ?? 2);

          if (userData.maintenance_calories) {
            // For convenience, assume the DB only stored the base Mifflin. 
            // You can also store the "theory" if you want.
            setMaintenance(userData.maintenance_calories);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    if (accessToken) {
      fetchNutritionData();
    }
  }, [accessToken]);

  // 5) Calculation
  const handleCalculate = async () => {
    if (!age || !gender || !weight || !height || !activity) {
      alert("Please fill in all fields");
      return;
    }

    // Convert weight => kg if needed
    const weightKg = weightUnit === "lbs" ? weight * 0.453592 : weight;

    // Convert height => cm
    let heightCm = 0;
    if (heightUnit === "feet") {
      const sanitized = height.replace(/['"]/g, "");
      const [feetStr, inchesStr] = sanitized.split(" ");
      const feet = parseFloat(feetStr) || 0;
      const inches = parseFloat(inchesStr) || 0;
      heightCm = feet * 30.48 + inches * 2.54;
    } else {
      heightCm = parseFloat(height);
    }

    // Mifflin-St Jeor
    const bmr =
      gender === "male"
        ? 10 * weightKg + 6.25 * heightCm - 5 * age + 5
        : 10 * weightKg + 6.25 * heightCm - 5 * age - 161;

    // Activity factor array
    const actMultipliers = [1.2, 1.375, 1.55, 1.725, 1.9];
    const baseMaintenance = Math.round(bmr * actMultipliers[activity - 1]);

    // Adjust for goal => "theoryCals"
    let finalCals = baseMaintenance;
    if (goal === "bulk") {
      finalCals += 500;
    } else if (goal === "cut") {
      finalCals -= 500;
    }

    // The macros are from the raw "maintenance" only
    const proteinCal = baseMaintenance * 0.25;
    const carbCal = baseMaintenance * 0.5;
    const fatCal = baseMaintenance * 0.25;

    const macrosData = {
      protein: Math.round(proteinCal / 4),
      carbs: Math.round(carbCal / 4),
      fats: Math.round(fatCal / 9),
    };

    // Update state
    setMaintenance(baseMaintenance); 
    setTheoryCals(finalCals);       
    setMacros(macrosData);

    // Save data to DB if you want
    try {
      await axios.post(
        "/api/saveUserNutrition",
        {
          age,
          gender,
          weight,
          weightUnit,
          height,
          heightUnit,
          activity,
          maintenanceCalories: baseMaintenance,
          // If you want to store finalCals => add "goalCalories: finalCals"
        },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
    } catch (err) {
      console.error("Error saving user data:", err);
    }
  };

  // 6) Navigation
  const handleBack = () => {
    navigate(-1);
  };
  const handleBackProfile = () => {
    navigate("/UserProfile");
  };

  // Data for the "maintenance-based" pie chart
  const chartData = [
    { title: "Protein", value: macros.protein, color: "#4caf50" },
    { title: "Fats", value: macros.fats, color: "#ff9800" },
    { title: "Carbs", value: macros.carbs, color: "#2196f3" },
  ];

  return (
    <>
      <header className="gritphase-header">
        <ChevronLeft className="backIcon" onClick={handleBackProfile} />
        <img
          src={logo}
          alt="Logo"
          className="logo-gritPhases-header"
          style={{ marginRight: "18rem"}}
          onClick={handleBackProfile}
        />
      </header>
      
    <div className="calcContainer">
    <div className="report_header_cal">
            <div className="report_header-text"><img src = {calc} />Calorie Calculator</div>
          </div>
      <div className="calcContentWrapper">

        {/* 2x2 Grid => Age, Gender, Weight, Height */}
        <div className="inputsGrid">
          {/* Age */}
          <div className="infoBlock">
            <label className="infoLabel">Age</label>
            <input
              type="number"
              className="infoInput"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="25"
            />
            Years
          </div>
          {/* Gender */}
          <div className="infoBlock">
            <label className="infoLabel">Gender</label>
            <img
              src={gender === "male" ? male_icon : female_icon}
              alt="gender"
              className="genderImageCard"
            />
            <select
              className="infoSelect"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          {/* Weight */}
          <div className="infoBlock">
            <label className="infoLabel">Weight</label>
            <input
              type="number"
              className="infoInput"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="150"
            />
            <select
              className="infoSelect"
              value={weightUnit}
              onChange={(e) => setWeightUnit(e.target.value)}
            >
              <option value="lbs">lbs</option>
              <option value="kg">kg</option>
            </select>
          </div>
          {/* Height */}
          <div className="infoBlock">
            <label className="infoLabel">Height</label>
            {heightUnit === "feet" ? (
              <input
                type="text"
                className="infoInput"
                placeholder="5ft 7in"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
              />
            ) : (
              <input
                type="text"
                className="infoInput"
                placeholder="170"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
              />
            )}
            <select
              className="infoSelect"
              value={heightUnit}
              onChange={(e) => setHeightUnit(e.target.value)}
            >
              <option value="feet">feet</option>
              <option value="cm">cm</option>
            </select>
          </div>
        </div>

        {/* Activity slider */}
        <div className="activityContainer">
          <h3>Activity Scale</h3>
          <p>How active are you?</p>
          <input
            type="range"
            className="activitySlider"
            min="1"
            max="5"
            value={activity}
            onChange={(e) => setActivity(parseInt(e.target.value, 10))}
          />
          <div className="activityLabels">
            {["🛋️ Couch Potato", "🐢 Slow & Steady", "🚶‍♂️ Daily Walker", "🏋️ Gym Freak" , "🏃‍♂️ Hustler"].map((lbl) => (
              <div key={lbl}>{lbl}</div>
            ))}
          </div>
        </div>

        {/* Goal dropdown */}
        <div className="goalContainer">
          <h3>Goal</h3>
          <select
            className="goalSelect"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
          >
            <option value="recomp">Recomposition</option>
            <option value="bulk">Bulking</option>
            <option value="cut">Cutting</option>
          </select>

          {/* Explanation text based on current goal */}
          <p className="goalExplanation">
            {goal === "bulk" && (
              <>
                Bulking means adding about 500 extra calories daily to gain muscle mass
                gradually.
              </>
            )}
            {goal === "cut" && (
              <>
                Cutting means reducing about 500 calories daily to shed fat while
                preserving muscle.
              </>
            )}
            {goal === "recomp" && (
              <>
                Recomposition means eating roughly at maintenance while focusing on
                building muscle and losing fat simultaneously.
              </>
            )}
          </p>
        </div>


        {/* Calculate */}
        <button className="calcButton" onClick={handleCalculate}>
          Calculate
        </button>

        {/* RESULTS */}
        <div className="resultsContainer">
          {/* Always show maintenance */}
          <div className="caloriesBox">
            <h4>Maintenance/Recomposition</h4>
            <p>{maintenance > 0 ? `${maintenance} cal` : "----"}</p>
          </div>

          {/* Show "theory" cals if user picks something else */}
          <div className="caloriesBox">
            <h4>{goal.charAt(0).toUpperCase() + goal.slice(1)} Calories</h4>
            <p>{/* If goal=bulk => maintenance+500, etc. We stored in setTheoryCals. */}
              {goal === "bulk" ? `${maintenance + 500} cal`
               : goal === "cut" ? `${maintenance - 500} cal`
               : `${maintenance} cal`
              }
            </p>
          </div>

          {/* Pie chart => from maintenance macros */}
          <div className="pieBox">
          Now let's talk about your current macros split: to help you go through your day.
            <PieChart
              data={[
                { title: "Protein", value: macros.protein, color: "#4caf50" },
                { title: "Fats", value: macros.fats, color: "#ff9800" },
                { title: "Carbs", value: macros.carbs, color: "#2196f3" },
              ]}
              lineWidth={20}
              paddingAngle={5}
              rounded
              label={({ dataEntry }) => dataEntry.value}
              labelStyle={{ fontSize: "5px", fill: "#fff" }}
              labelPosition={60}
              style={{ height: "120px" }}
            />
            
            <div className="macroLegend">
              <div className="legendItem">
                <span className="legendColor" style={{ background: "#4caf50" }} />
                Protein: {macros.protein}g
              </div>
              <div className="legendItem">
                <span className="legendColor" style={{ background: "#ff9800" }} />
                Fats: {macros.fats}g
              </div>
              <div className="legendItem">
                <span className="legendColor" style={{ background: "#2196f3" }} />
                Carbs: {macros.carbs}g
              </div>
            </div>
          </div>
        </div>

        
      </div>
    </div>
    <TabBar />
    </>
  );
}
