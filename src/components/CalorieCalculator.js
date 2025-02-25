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
  const [height, setHeight] = useState(""); // Default height in feet/inches
  const [heightUnit, setHeightUnit] = useState("feet"); // Default unit for height
  const [activity, setActivity] = useState(2);
  const { accessToken, refreshAuthToken } = useAuth();

  const [bulkOffset] = useState(500);   // e.g. +300 for bulking
  const [cutOffset] = useState(-500);   

  const [maintenance, setMaintenance] = useState(2500);
  const [macros, setMacros] = useState({ protein: 150, carbs: 300, fats: 70 });

  const navigate = useNavigate();
  const location = useLocation();
  const { calGoal } = location.state || {};

  const genderIcons = {
    male: male_icon,
    female: female_icon,
  };

  useEffect(() => {
    if (!accessToken) refreshAuthToken();
  }, [accessToken, refreshAuthToken]);

  useEffect(() => {
    const fetchNutritionData = async () => {
      try {
        const response = await axios.get("/api/getUserNutrition", {
          // If your server requires a token, you might do:
           headers: { Authorization: `Bearer ${accessToken}` }
        });
        if (response.data?.data) {
          const userData = response.data.data;
          setAge(userData.age ?? "");
          setGender(userData.gender ?? "male");
          setWeight(userData.weight ?? "");
          setWeightUnit(userData.weight_unit ?? "lbs");
          setHeight(userData.height ?? "");
          setHeightUnit(userData.height_unit ?? "feet");
          setActivity(userData.activity ?? 2);

          // If you also saved maintenance_calories in DB, you can set it:
          if (userData.maintenance_calories) {
            setMaintenance(userData.maintenance_calories);
            // Optionally compute macros from that if you want
          }
        }
      } catch (error) {
        console.error("Error fetching user nutrition data:", error);
        // it's okay if user doesn't have data yet
      }
    };

    fetchNutritionData();
  }, []);

  // 2. For user convenience, also read from localStorage (optional)
  //    If you want to fallback on localStorage when DB is empty, or vice versa.
  useEffect(() => {
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

  // 3. Whenever user changes a field, store it in localStorage
  //    (so if they refresh mid-flow, they don't lose it)
  useEffect(() => {
    localStorage.setItem("cc_age", age);
    localStorage.setItem("cc_gender", gender);
    localStorage.setItem("cc_weight", weight);
    localStorage.setItem("cc_weightUnit", weightUnit);
    localStorage.setItem("cc_height", height);
    localStorage.setItem("cc_heightUnit", heightUnit);
    localStorage.setItem("cc_activity", activity.toString());
  }, [age, gender, weight, weightUnit, height, heightUnit, activity]);


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

  // 4. Calculate the user’s maintenance & macros, then navigate or store
  const handleCalculate = async () => {
    if (!age || !gender || !weight || !height || !activity) {
      alert("Please fill in all fields");
      return;
    }

    console.log("Age:", age);
    console.log("Gender:", gender);
    console.log("Weight:", weight);
    console.log("Height:", height);
    console.log("Activity:", activity);

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

    // Basic BMR
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

    setMaintenance(maintenanceCal);
    setMacros(macrosData);

    // 5. Save data to the DB (including new maintenanceCal, etc.)
    try {
      await axios.post("/api/saveUserNutrition", {
        age,
        gender,
        weight,
        weightUnit,
        height,
        heightUnit,
        activity,
        maintenanceCalories: maintenanceCal,
      }, {
         headers: { Authorization: `Bearer ${accessToken}` },
      });

      console.log("Saved user nutrition data to DB!");
    } catch (error) {
      console.error("Error saving user data:", error);
    }

    // Then navigate to the next page or show them the results
    navigate("/displayCalculation", {
      state: {
        maintenanceCal,
        macrosData,
        calGoal,
      },
    });
  };

  // 6. Optional: Generate a PDF from your Word doc template
  //    Replace your placeholders server-side with docxtemplater
  const handleGeneratePdf = async () => {
    if (!maintenance || !macros) {
      alert("Please calculate your maintenance first!");
      return;
    }

    try {
      const response = await axios.post(
        "/api/generatePdf",
        {
          // Provide all the data you need to fill placeholders, e.g.:
          userName: "John Doe", // or get from your profile
          age,
          gender,
          weight,
          weightUnit,
          height,
          heightUnit,
          activity,
          maintenanceCals: maintenance,
          proteinGrams: macros.protein,
          carbGrams: macros.carbs,
          fatGrams: macros.fats,
        },
        { responseType: "blob" } // Important for binary PDF
      );

      // Create a Blob from the PDF stream
      const file = new Blob([response.data], { type: "application/pdf" });
      // Build a URL from the file
      const fileURL = URL.createObjectURL(file);
      // Force download
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
              <div key={label}>
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

    <div>
      {/* Some UI for user to see or edit data */}
      {/* <h2>Maintenance: {maintenance} cals</h2> */}

      {/* Now, just place the PDF button */}
      {/* <GeneratePdf
        userName="John Doe"
        maintenanceCalories={maintenance}
        macros={macros}
      /> */}
    </div>

      </div>
    </div>
  );

  

};

export default CalorieCalculator;
