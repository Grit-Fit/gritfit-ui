// App.js
import React, { useContext, useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import Auth from "./components/Auth";
import Landing from "./components/Landing";   // <-- your new Landing page component

import LogoPage from "./components/Logo";
import WelcomePage from "./components/Welcome";
import GritPhases from "./components/GritPhases";
import LeftSwipe from "./components/leftSwipe";
import RightSwipe from "./components/rightSwipe";
import GFitReport from "./components/gFitReport";
import CalorieCalculator from "./components/CalorieCalculator";
import CalorieDisplay from "./components/CalorieDisplay";
import CalorieTarget from "./components/CalorieTarget";
import CalorieMacro from "./components/CalorieMacro";
import NextStepsCarousel from "./components/NextStepsCarousel";
import NutritionTheory from "./components/NutritionTheory";
import GymGoal from "./components/GymGoal";
import NutritionPage from "./components/NutritionPage";

function AppRoutes() {
  const { accessToken } = useContext(AuthContext);
  const location = useLocation();
  const [redirectPath, setRedirectPath] = useState(null);

  useEffect(() => {
    if (accessToken) {
      const storedSignup = localStorage.getItem("justSignedUp") === "true";
      setRedirectPath(storedSignup ? "/welcome" : "/gritPhases");
    }
  }, [accessToken]);

  // 1) If NOT logged in:
  if (!accessToken) {
    return (
      <Routes>
        {/* Show Landing at root */}
        <Route path="/" element={<Landing />} />

        {/* Existing Auth routes */}
        <Route path="/login" element={<Auth />} />
        <Route path="/signup" element={<Auth />} />

        {/* Catch-all: unrecognized paths go back to Landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  // 2) If logged in but haven't decided where to redirect yet
  if (!redirectPath) {
    return <div className="loading-screen">Loading...</div>;
  }

  // 3) If logged in, send them to their normal in-app routes
  return (
    <Routes>
      <Route path="/" element={<Navigate to={redirectPath} replace />} />

      <Route path="/welcome" element={<WelcomePage />} />
      <Route path="/gritPhases" element={<GritPhases />} />
      <Route path="/selectTheory" element={<NutritionTheory />} />
      <Route path="/selectGoal" element={<GymGoal />} />
      <Route path="/calorieCalc" element={<CalorieCalculator />} />
      <Route path="/displayCalculation" element={<CalorieDisplay />} />
      <Route path="/displayTargetCalories" element={<CalorieTarget />} />
      <Route path="/macros" element={<CalorieMacro />} />
      <Route path="/nextSteps" element={<NextStepsCarousel />} />
      <Route path="/leftSwipe" element={<LeftSwipe />} />
      <Route path="/rightSwipe" element={<RightSwipe />} />
      <Route path="/gFitReport" element={<GFitReport />} />
      <Route path="/nutrition" element={<NutritionPage />} />

      {/* Catch-all: if user is logged in but hits something weird, just go to redirectPath */}
      <Route path="*" element={<Navigate to={redirectPath} replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}
