import React, { useState, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/GritFit_Full.png";
import female_icon from "../assets/female.png";
import male_icon from "../assets/male.png";
import "../css/CalorieCalculator.css";
import "../css/NutritionTheory.css";

const CalorieCalculator = () => {
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("male");
  const [weight, setWeight] = useState(""); // Default weight in lbs
  const [weightUnit, setWeightUnit] = useState("lbs"); // Default unit for weight
  const [height, setHeight] = useState(""); // Default height in feet/inches
  const [heightUnit, setHeightUnit] = useState("feet"); // Default unit for height
  const [activity, setActivity] = useState(2);
  const [maintenanceCalories, setMaintenanceCalories] = useState(null);
  const [macros, setMacros] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  const { calGoal } = location.state || {};

  const genderIcons = {
    male: male_icon,
    female: female_icon,
  };

  useEffect(() => {
    // Load saved values (if any) from localStorage
    const savedAge = localStorage.getItem("cc_age");
    const savedGender = localStorage.getItem("cc_gender");
    const savedWeight = localStorage.getItem("cc_weight");
    const savedWeightUnit = localStorage.getItem("cc_weightUnit");
    const savedHeight = localStorage.getItem("cc_height");
    const savedHeightUnit = localStorage.getItem("cc_heightUnit");
    const savedActivity = localStorage.getItem("cc_activity");

    if (savedAge) setAge(savedAge);
    if (savedGender) setGender(savedGender);
    if (savedWeight) setWeight(savedWeight);
    if (savedWeightUnit) setWeightUnit(savedWeightUnit);
    if (savedHeight) setHeight(savedHeight);
    if (savedHeightUnit) setHeightUnit(savedHeightUnit);
    if (savedActivity) setActivity(parseInt(savedActivity, 10));
  }, []);


  const activityLabels = [
    "🛋️ Couch Potato",
    "🐢 Slow & Steady",
    "🚶‍♂️ Daily Walker",
    "🏋️ Gym Regular",
    "🏃‍♂️💨 Non-Stop Hustler",
  ];

  const handleActivityChange = (e) => {
    setActivity(parseInt(e.target.value, 10));
  };

  const handleCalculate = () => {
    if (!age || !gender || !weight || !height || !activity) {
      alert("Please fill in all fields");
      return;
    } else {
      console.log("Age:", age);
      console.log("Gender:", gender);
      console.log("Weight: ", weight);
      console.log("Height: ", height);
      console.log("activity: ", activity);

      const weightKg = weightUnit === "lbs" ? weight * 0.453592 : weight;

    let heightCm = 0;
    if (heightUnit === "feet") {
      const sanitized = height.replace(/['"]/g, ""); // remove ' and "
      const [feetStr, inchesStr] = sanitized.split(" ");
      const feet = parseFloat(feetStr) || 0;
      const inches = parseFloat(inchesStr) || 0;
      heightCm = feet * 30.48 + inches * 2.54;
    } else {
      // cm
      heightCm = parseFloat(height);
    }

      const bmr =
        gender === "male"
          ? 10 * weightKg + 6.25 * heightCm - 5 * age + 5
          : 10 * weightKg + 6.25 * heightCm - 5 * age - 161;

      const activityMultiplier = [1.2, 1.375, 1.55, 1.725, 1.9];
      const maintenanceCal = Math.round(bmr * activityMultiplier[activity - 1]);

      const proteinCalories = maintenanceCal * 0.25;
      const carbCalories = maintenanceCal * 0.5;
      const fatCalories = maintenanceCal * 0.25;

      const macrosData = {
        protein: Math.round(proteinCalories / 4),
        carbs: Math.round(carbCalories / 4),
        fats: Math.round(fatCalories / 9),
      };

      setMaintenanceCalories(maintenanceCal);
      setMacros(macrosData);
      console.log("Maintenance Calories: ", maintenanceCal);
      console.log("Macros: ", macrosData);
      navigate("/displayCalculation", {
        state: {
            maintenanceCal,
            macrosData,
            calGoal
        },
      });
      // setPage('maintenance'); // Navigate to MaintenanceCaloriesPage
    }
  };

  return (
    <div className="calculatorContainer">
      <div className="contentWrapper">
        <div className="theory-header">
          <div>
            <ChevronLeft
              className="chevron-left"
              onClick={() => window.history.back()} // Use your routing method for navigation
            />
          </div>
          <div className="logo-container-nut">
            <img src={logo} alt="Logo" className="logo-gritPhases-nut" />
          </div>
        </div>

        <h3 className="cal-title">Set Your Fuel!</h3>
        <p className="description">
        We’ll help you discover your daily target calorie , tailored just for you!
        </p>

        <div className="inputGrid">
          <div className="inputContainer">
            <div className="inputBox">
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                min="0"
                className="inputValue"
                aria-label="Age"
                placeholder="25"
              />
              <div className="unitWrapper">
                <div className="unitText">Years</div>
              </div>
            </div>
            <div className="inputLabel">Age</div>
          </div>
          {/* Gender Selector */}
          <div className="inputContainer">
            <div className="inputBox">
              <img
                src={genderIcons[gender || "male"]}
                alt="gender"
                className="genderImage"
              />
              <div className="genderWrapper">
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="selectGender"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>
            <div className="inputLabel">Gender</div>
          </div>
          <div className="inputContainer">
            <div className="inputBox">
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                min="0"
                className="inputValue"
                aria-label="Weight"
                placeholder="150"
              />
              <div className="unitWrapper">
                <select
                  value={weightUnit}
                  onChange={(e) => setWeightUnit(e.target.value)}
                  className="unitText"
                >
                  <option value="lbs">lbs</option>
                  <option value="kg">kg</option>
                </select>
              </div>
            </div>
            <div className="inputLabel">Weight</div>
          </div>
          <div className="inputContainer">
            <div className="inputBox">
              {heightUnit === "feet" ? (
                <input
                  type="text"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="inputValue"
                  aria-label="Height"
                  placeholder="5 7"
                />
              ) : (
                <input
                  type="text"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  min="0"
                  className="inputValue"
                  placeholder="170"
                  aria-label="Height"
                />
              )}
              <div className="unitWrapper">
                <select
                  value={heightUnit}
                  onChange={(e) => setHeightUnit(e.target.value)}
                  className="unitText"
                >
                  <option value="feet">feet</option>
                  <option value="cm">cm</option>
                </select>
              </div>
            </div>
            <div className="inputLabel">Height</div>
          </div>
        </div>

        {/* Activity Scale */}
        <div className="activity-scale">
          <h3 className="activityTitle">Activity Scale</h3>
          <p className="activityDescription">
            On a scale of 1-5, how active are you?
          </p>
          <input
            type="range"
            min="1"
            max="5"
            value={activity}
            onChange={handleActivityChange}
            className="activity-slider"
          />
          <div className="activity-labels">
            {activityLabels.map((label, index) => (
              <div
                // key={index}
                // // className={`label ${
                // //   activity === index + 1 ? "active-label" : ""
                // // }`}
              >
                {/* <span className="label-number">{index + 1}</span> <br /> */}
                <span className="label-text">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <button
          className="calculateButton"
          onClick={handleCalculate}
          aria-label="Calculate calories"
        >
          Calculate
        </button>
      </div>
    </div>
  );
};

export default CalorieCalculator;
