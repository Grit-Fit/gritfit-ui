// src/components/CalorieCalculator.js
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import logo      from "../assets/logo1.png";
import female    from "../assets/female.png";
import male      from "../assets/male.png";
import { PieChart } from "react-minimal-pie-chart";
import axios from "../axios";
import { AuthContext, useAuth } from "../context/AuthContext";
import "../css/CalorieCalculator.css";
import "../css/CardView.css";
import calcIcon from "../assets/calc.png";
import TabBar from "./TabBar";
import { markFeatureOpen, markFeatureClose } from "../utils/featureLogger";
import FeedbackPrompt from "./FeedbackPrompt";

export default function CalorieCalculator() {
  /* ───────────── basic setup ───────────── */
  const { user } = useContext(AuthContext);
  const userId   = user?.userid || user?.id;
  const feedbackKey = `tdeeFeedback_${userId}`;            // localStorage flag
  const askedBefore = !!localStorage.getItem(feedbackKey);

  const { accessToken, refreshAuthToken } = useAuth();
  const navigate = useNavigate();

  /* ───────────── inputs & state ───────────── */
  const [age, setAge]               = useState("");
  const [gender, setGender]         = useState("male");
  const [weight, setWeight]         = useState("");
  const [weightUnit, setWeightUnit] = useState("lbs");
  const [height, setHeight]         = useState("");
  const [heightUnit, setHeightUnit] = useState("feet");
  const [activity, setActivity]     = useState(2);
  const [goal, setGoal]             = useState("recomp");

  const [maintenance, setMaintenance] = useState(0);
  const [macros, setMacros]           = useState({ protein:0,fats:0,carbs:0 });

  const [showFB, setShowFB]       = useState(false);
  const [hasCalculated, setHasCalculated] = useState(false);  // NEW

  /* ───────────── feature tracking ───────────── */
  useEffect(() => {
    markFeatureOpen("Calorie Calculator");
    return () => markFeatureClose("Calorie Calculator", userId);
  }, [userId]);

  /* ───────────── ensure token ───────────── */
  useEffect(() => {
    if (!accessToken) refreshAuthToken();
  }, [accessToken, refreshAuthToken]);

  /* ───────────── preload saved data ───────────── */
  useEffect(() => {
    const preload = async () => {
      try {
        const { data } = await axios.get("/api/getUserNutrition", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (data?.data) {
          const u=data.data;
          setAge(u.age ?? "");
          setGender(u.gender ?? "male");
          setWeight(u.weight ?? "");
          setWeightUnit(u.weight_unit ?? "lbs");
          setHeight(u.height ?? "");
          setHeightUnit(u.height_unit ?? "feet");
          setActivity(u.activity ?? 2);
          if (u.maintenance_calories) setMaintenance(u.maintenance_calories);
        }
      } catch(err){ console.error(err); }
    };
    if (accessToken) preload();
  }, [accessToken]);

  /* ───────────── calculate handler ───────────── */
  const handleCalculate = async () => {
    if (!age || !weight || !height) { alert("Please fill in all fields"); return;}

    /* convert units */
    const weightKg = weightUnit==="lbs" ? weight*0.453592 : +weight;
    const heightCm = heightUnit==="feet"
      ? ((+height.split(" ")[0]||0)*30.48)+((+height.split(" ")[1]||0)*2.54)
      : +height;

    const bmr = gender==="male"
      ? 10*weightKg + 6.25*heightCm - 5*age + 5
      : 10*weightKg + 6.25*heightCm - 5*age - 161;

    const factors=[1.2,1.375,1.55,1.725,1.9];
    const base = Math.round(bmr*factors[activity-1]);

    setMaintenance(base);
    setMacros({
      protein:Math.round(base*0.25/4),
      fats:   Math.round(base*0.25/9),
      carbs:  Math.round(base*0.5/4)
    });
    setHasCalculated(true);                               // flag we computed

    try {
      await axios.post("/api/saveUserNutrition",
        { age,gender,weight,weightUnit,height,heightUnit,activity,
          maintenanceCalories:base },
        { headers:{ Authorization:`Bearer ${accessToken}` } });
      /* prompt immediately if not asked before */
      // if (!askedBefore) setShowFB(true);
    } catch(err){ console.error(err); }
  };

  /* ───────────── back navigation ───────────── */
  const leave = () => navigate(-1);
  const handleBack = () => {
    if (!askedBefore && hasCalculated && !showFB) {
      setShowFB(true);
    } else {
      leave();
    }
  };
  const closeFeedback = () => {
    localStorage.setItem(feedbackKey,"1");
    setShowFB(false);
    leave();
  };

  /* ───────────── ui helpers ───────────── */
  const activityLabels=[
    "🛋️ Couch Potato","🐢 Slow & Steady",
    "🚶‍♂️ Daily Walker","🏋️ Gym Freak","🏃‍♂️ Hustler"
  ];
  const chartData=[
    {title:"Protein",value:macros.protein,color:"#4caf50"},
    {title:"Fats",   value:macros.fats,   color:"#ff9800"},
    {title:"Carbs",  value:macros.carbs,  color:"#2196f3"}
  ];

  /* ───────────── render ───────────── */
  return (
    <>
      {/* top nav */}
      <header className="gritphase-header">
        <ChevronLeft className="backIcon" onClick={handleBack}/>
        <img src={logo} alt="logo" className="logo-gritPhases-header"
             style={{marginRight:"18rem"}} onClick={handleBack}/>
      </header>

      {/* header & inputs */}
      <div className="calcContainer">
        <div className="report_header_cal">
          <div className="report_header-text">
            <img src={calcIcon} alt="calc"/>Calorie Calculator
          </div>
        </div>

        <div className="calcContentWrapper">
          {/* inputs grid */}
          <div className="inputsGrid">
            {/* Age */}
            <div className="infoBlock">
              <label className="infoLabel">Age</label>
              <input type="number" className="infoInput" placeholder="25"
                     value={age} onChange={e=>setAge(e.target.value)}/> Years
            </div>
            {/* Gender */}
            <div className="infoBlock">
              <label className="infoLabel">Gender</label>
              <img src={gender==="male"?male:female} alt="g" className="genderImageCard"/>
              <select className="infoSelect" value={gender}
                      onChange={e=>setGender(e.target.value)}>
                <option value="male">Male</option><option value="female">Female</option>
              </select>
            </div>
            {/* Weight */}
            <div className="infoBlock">
              <label className="infoLabel">Weight</label>
              <input type="number" className="infoInput" placeholder="150"
                     value={weight} onChange={e=>setWeight(e.target.value)}/>
              <select className="infoSelect" value={weightUnit}
                      onChange={e=>setWeightUnit(e.target.value)}>
                <option value="lbs">lbs</option><option value="kg">kg</option>
              </select>
            </div>
            {/* Height */}
            <div className="infoBlock">
              <label className="infoLabel">Height</label>
              {heightUnit==="feet"?(
                <input className="infoInput" placeholder="5ft 7in"
                       value={height} onChange={e=>setHeight(e.target.value)}/>
              ):(
                <input className="infoInput" placeholder="170"
                       value={height} onChange={e=>setHeight(e.target.value)}/>
              )}
              <select className="infoSelect" value={heightUnit}
                      onChange={e=>setHeightUnit(e.target.value)}>
                <option value="feet">feet</option><option value="cm">cm</option>
              </select>
            </div>
          </div>

          {/* activity slider */}
          <div className="activityContainer">
            <h3>Activity Scale</h3><p>How active are you?</p>
            <input type="range" min="1" max="5" value={activity}
                   onChange={e=>setActivity(+e.target.value)}
                   className="activitySlider"/>
            <div className="activityLabels">
              {activityLabels.map(lbl=><div key={lbl}>{lbl}</div>)}
            </div>
          </div>

          {/* goal */}
          <div className="goalContainer">
            <h3>Goal</h3>
            <select className="goalSelect" value={goal}
                    onChange={e=>setGoal(e.target.value)}>
              <option value="recomp">Recomposition</option>
              <option value="bulk">Bulking</option>
              <option value="cut">Cutting</option>
            </select>
            <p className="goalExplanation">
              {goal==="bulk"   && "Bulking adds ~500 cal to gain muscle gradually."}
              {goal==="cut"    && "Cutting removes ~500 cal to lose fat steadily."}
              {goal==="recomp" && "Recomposition eats at maintenance to build muscle & lose fat."}
            </p>
          </div>

          {/* calculate */}
          <button className="calcButton" onClick={handleCalculate}>
            Calculate
          </button>

          {/* results */}
          <div className="resultsContainer">
            <div className="caloriesBox">
              <h4>Maintenance / Recomp</h4>
              <p>{maintenance?`${maintenance} cal`:"----"}</p>
            </div>
            <div className="caloriesBox">
              <h4>{goal.charAt(0).toUpperCase()+goal.slice(1)} Calories</h4>
              <p>
                {maintenance
                  ? goal==="bulk" ? `${maintenance+500} cal`
                  : goal==="cut"  ? `${maintenance-500} cal`
                  : `${maintenance} cal`
                  : "----"}
              </p>
            </div>
            <div className="pieBox">
              <PieChart data={chartData} lineWidth={20} paddingAngle={4} rounded
                        label={({dataEntry})=>dataEntry.value}
                        labelStyle={{fontSize:"5px",fill:"#fff"}}
                        labelPosition={62} style={{height:120}}/>
              <div className="macroLegend">
                <div className="legendItem"><span style={{background:"#4caf50"}}/>Protein: {macros.protein} g</div>
                <div className="legendItem"><span style={{background:"#ff9800"}}/>Fats: {macros.fats} g</div>
                <div className="legendItem"><span style={{background:"#2196f3"}}/>Carbs: {macros.carbs} g</div>
              </div>
            </div>
          </div>
          <button
          className="px-4 py-2 rounded bg-black text-white text-sm"
          onClick={() => setShowFB(true)}  
          style={{marginRight: "auto", marginLeft: "auto", width:"80%", display:"flex", marginTop: "1.5rem", flexDirection: "column"}}
        >
          Give feedback
        </button>
        </div>

      </div>

        {/* feedback modal */}
      {showFB && (
        <div style={{ opacity: 0.95, zIndex: 9999 }}>
        <FeedbackPrompt
          feature="TDEE_CALC"
          question="Was this calorie calculation helpful?"
          placeholder="Any confusion we should fix?"
          onClose={closeFeedback}
        />
        </div>
      )}

      <TabBar/>


      
    </>
  );
}
