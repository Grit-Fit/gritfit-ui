import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Auth from "./components/Auth";
import LogoPage from "./components/Logo";
import WelcomePage from "./components/Welcome";
import { AuthContext } from "./context/AuthContext";
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

const AppRoutes = () => {
  const { accessToken } = useContext(AuthContext);

  // If no token, show the authentication component
  

  // Once authenticated, display your routes.
  return (
    <Routes>
      {!accessToken ? (
          <>
            <Route path="/" element={<Auth />} />
            <Route path="/welcome" element={<WelcomePage />} />
          </>
        ) : (
          <>
            <Route path="/gritPhases" element={<GritPhases />} />
            <Route path="*" element={<Navigate to="/gritPhases" />} />
          </>
        )}
      <Route path="/" element={<Navigate to="/gritPhases" replace />} />
      <Route path="/login" element={<Navigate to="/gritPhases" replace />} />
      <Route path="/signup" element={<Navigate to="/gritPhases" replace />} />
      <Route path="/logo" element={<LogoPage />} />
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
      {/* Add any other routes as needed */}
    </Routes>
  );
};

// Wrap routes in Router
const App = () => (
  <Router>
    <AppRoutes />
  </Router>
);

export default App;
