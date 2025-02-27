import React, { useState, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/GritFit_Full.png";
import female_icon from "../assets/female.png";
import male_icon from "../assets/male.png";
import "../css/CalorieCalculator.css";
import "../css/NutritionTheory.css";
// axios is assumed to be pre-configured in ../axios (with baseURL, interceptors, etc.)
import axios from "../axios";
import { useAuth } from "../context/AuthContext";
import GeneratePdf from "./GeneratePdfButton";

const CalorieCalculator = () => {
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("male");
  const [weight, setWeight] = useState(""); // Default weight in lbs
  const [weightUnit, setWeightUnit] = useState("lbs"); // Default unit for weight

  // Height states:
  const [heightUnit, setHeightUnit] = useState("feet"); // "feet" or "cm"
  const [feet, setFeet] = useState("");     // separate state for feet
  const [inches, setInches] = useState(""); // separate state for inches
  const [heightCm, setHeightCm] = useState(""); // state for cm

  const [activity, setActivity] = useState(2);
  const { accessToken, refreshAuthToken } = useAuth();

  // Example states for final calculation
  const [maintenance, setMaintenance] = useState(2500);
  const [macros, setMacros] = useState({ protein: 150, carbs: 300, fats: 70 });

  const navigate = useNavigate();
  const location = useLocation();
  const { calGoal } = location.state || {};

  const genderIcons = {
    male: male_icon,
    female: female_icon,
  };

  // Attempt to refresh token if missing
  useEffect(() => {
    if (!accessToken) refreshAuthToken();
  }, [accessToken, refreshAuthToken]);

  // 1) On mount, fetch user data from DB (if any)
  useEffect(() => {
    const fetchNutritionData = async () => {
      try {
        const response = await axios.get("/api/getUserNutrition", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (response.data?.data) {
          const userData = response.data.data;

          setAge(userData.age ?? "");
          setGender(userData.gender ?? "male");
          setWeight(userData.weight ?? "");
          setWeightUnit(userData.weight_unit ?? "lbs");

          // If the DB stores height in feet/inches vs cm
          const dbUnit = userData.height_unit ?? "feet";
          setHeightUnit(dbUnit);

          if (dbUnit === "feet") {
            // If your DB stores them as userData.feet, userData.inches, for example
            if (userData.feet) setFeet(userData.feet);
            if (userData.inches) setInches(userData.inches);
          } else {
            // If DB stores centimeters in userData.height_cm
            if (userData.height_cm) setHeightCm(userData.height_cm);
          }

          setActivity(userData.activity ?? 2);

          if (userData.maintenance_calories) {
            setMaintenance(userData.maintenance_calories);
          }
        }
      } catch (error) {
        console.error("Error fetching user nutrition data:", error);
      }
    };
    if (accessToken) {
      fetchNutritionData();
    }
  }, [accessToken]);

  // 2) For user convenience, also read from localStorage
  useEffect(() => {
    const savedAge = localStorage.getItem("cc_age");
    const savedGender = localStorage.getItem("cc_gender");
    const savedWeight = localStorage.getItem("cc_weight");
    const savedWeightUnit = localStorage.getItem("cc_weightUnit");

    // For height:
    const savedHeightUnit = localStorage.getItem("cc_heightUnit");
    const savedFeet = localStorage.getItem("cc_feet");
    const savedInches = localStorage.getItem("cc_inches");
    const savedHeightCm = localStorage.getItem("cc_heightCm");

    const savedActivity = localStorage.getItem("cc_activity");

    if (savedAge) setAge(savedAge);
    if (savedGender) setGender(savedGender);
    if (savedWeight) setWeight(savedWeight);
    if (savedWeightUnit) setWeightUnit(savedWeightUnit);

    // Restore height data
    if (savedHeightUnit) setHeightUnit(savedHeightUnit);
    if (savedFeet) setFeet(savedFeet);
    if (savedInches) setInches(savedInches);
    if (savedHeightCm) setHeightCm(savedHeightCm);

    if (savedActivity) setActivity(parseInt(savedActivity, 10));
  }, []);

  // 3) Whenever user changes a field, store in localStorage
  useEffect(() => {
    localStorage.setItem("cc_age", age);
    localStorage.setItem("cc_gender", gender);
    localStorage.setItem("cc_weight", weight);
    localStorage.setItem("cc_weightUnit", weightUnit);

    // Save height info
    localStorage.setItem("cc_heightUnit", heightUnit);
    localStorage.setItem("cc_feet", feet);
    localStorage.setItem("cc_inches", inches);
    localStorage.setItem("cc_heightCm", heightCm);

    localStorage.setItem("cc_activity", activity.toString());
  }, [age, gender, weight, weightUnit, heightUnit, feet, inches, heightCm, activity]);

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

  // 4) Convert user’s height input => cm
  const getHeightInCm = () => {
    if (heightUnit === "feet") {
      const ft = parseFloat(feet || "0");
      const inch = parseFloat(inches || "0");
      const totalInches = ft * 12 + inch;
      return totalInches * 2.54;
    } else {
      // user typed directly in cm
      return parseFloat(heightCm || "0");
    }
  };

  // 5) Calculate the user’s maintenance & macros, then navigate or store
  const handleCalculate = async () => {
    // Basic validation
    if (!age || !gender || !weight || !activity) {
      alert("Please fill in all fields");
      return;
    }

    // Convert weight => kg if needed
    const weightKg =
      weightUnit === "lbs" ? parseFloat(weight || "0") * 0.453592 : parseFloat(weight || "0");

    // Convert height => cm
    const finalHeightCm = getHeightInCm();

    // Basic BMR
    const bmr =
      gender === "male"
        ? 10 * weightKg + 6.25 * finalHeightCm - 5 * age + 5
        : 10 * weightKg + 6.25 * finalHeightCm - 5 * age - 161;

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

    setMaintenance(maintenanceCal);
    setMacros(macrosData);

    // Save data to DB
    try {
      await axios.post(
        "/api/saveUserNutrition",
        {
          age,
          gender,
          weight,
          weight_unit: weightUnit,

          // Store whichever height approach we used:
          height_unit: heightUnit,
          feet,
          inches,
          height_cm: heightCm,

          activity,
          maintenanceCalories: maintenanceCal,
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      console.log("Saved user nutrition data to DB!");
    } catch (error) {
      console.error("Error saving user data:", error);
    }

    // Navigate to next page or show results
    navigate("/displayCalculation", {
      state: {
        maintenanceCal,
        macrosData,
        calGoal,
      },
    });
  };

  // 6) (Optional) Generate PDF from doc template
  const handleGeneratePdf = async () => {
    if (!maintenance || !macros) {
      alert("Please calculate your maintenance first!");
      return;
    }

    try {
      const response = await axios.post(
        "/api/generatePdf",
        {
          userName: "John Doe", // or get from user profile
          age,
          gender,
          weight,
          weightUnit,
          height_unit: heightUnit,
          feet,
          inches,
          height_cm: heightCm,
          activity,
          maintenanceCals: maintenance,
          proteinGrams: macros.protein,
          carbGrams: macros.carbs,
          fatGrams: macros.fats,
        },
        { responseType: "blob" }
      );

      const file = new Blob([response.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);
      const link = document.createElement("a");
      link.href = fileURL;
      link.setAttribute("download", "Nutrition101.pdf");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  return (
    <div className="calculatorContainer">
      <div className="contentWrapper">
        <div className="theory-header">
          <div>
            <ChevronLeft
              className="chevron-left"
              onClick={() => window.history.back()}
            />
          </div>
          <div className="logo-container-nut">
            <img src={logo} alt="Logo" className="logo-gritPhases-nut" />
          </div>
        </div>

        <h3 className="cal-title">Set Your Fuel!</h3>
        <p className="description">
          We’ll help you discover your daily target calorie, tailored just for you!
        </p>

        <div className="inputGrid">
          {/* Age */}
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

          {/* Gender */}
          <div className="inputContainer">
            <div className="inputBox">
              <img
                src={gender === "male" ? male_icon : female_icon}
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

          {/* Weight */}
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

          {/* Height */}
          <div className="inputContainer">
            <div className="inputBox">
              {heightUnit === "feet" ? (
                <>
                  {/* Let user type something like 5 for feet and 7 for inches */}
                  <input
                    type="number"
                    value={feet}
                    onChange={(e) => setFeet(e.target.value)}
                    className="inputValue"
                    aria-label="Feet"
                    placeholder="5"
                    style={{ width: "45px", marginRight: "4px" }}
                  />
                  <input
                    type="number"
                    value={inches}
                    onChange={(e) => setInches(e.target.value)}
                    min="0"
                    max="11"
                    className="inputValue"
                    aria-label="Inches"
                    placeholder="7"
                    style={{ width: "45px" }}
                  />
                </>
              ) : (
                <input
                  type="number"
                  value={heightCm}
                  onChange={(e) => setHeightCm(e.target.value)}
                  min="0"
                  className="inputValue"
                  placeholder="170"
                  aria-label="Height (cm)"
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
            {[
              "🛋️ Couch Potato",
              "🐢 Slow & Steady",
              "🚶‍♂️ Daily Walker",
              "🏋️ Gym Regular",
              "🏃‍♂️💨 Non-Stop Hustler",
            ].map((label) => {
              const parts = label.split(" ");
              const emoji = parts[0];
              const text = parts.slice(1).join(" ");
              return (
                <div key={label} style={{ textAlign: "center" }}>
                  <span className="label-text">{emoji}</span>
                  <br />
                  <span className="label-text">{text}</span>
                </div>
              );
            })}
          </div>
        </div>

        <button
          className="calculateButton"
          onClick={handleCalculate}
          aria-label="Calculate calories"
        >
          Calculate
        </button>

        {/* Example PDF generation button (optional) */}
        {/* <GeneratePdf
          userName="John Doe"
          maintenanceCalories={maintenance}
          macros={macros}
        /> */}
      </div>
    </div>
  );
};

export default CalorieCalculator;
