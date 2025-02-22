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
import { AuthContext } from "./context/AuthContext";

function AppRoutes() {
  const { accessToken } = useContext(AuthContext);

  return (
    <Routes>
      {/* 1) Root path: if token => go to /gritPhases, else => Auth (landing) */}
      <Route
        path="/"
        element={
          accessToken ? <Navigate to="/gritPhases" replace /> : <Auth />
        }
      />

      {/* 2) /login => if token => /gritPhases, else => Auth */}
      <Route
        path="/login"
        element={
          accessToken ? <Navigate to="/gritPhases" replace /> : <Auth />
        }
      />

      {/* 3) /signup => if token => /welcome, else => Auth */}
      <Route
        path="/signup"
        element={
          accessToken ? <Navigate to="/welcome" replace /> : <Auth />
        }
      />

      {/* 4) /welcome => if token => WelcomePage, else => / */}
      <Route
        path="/welcome"
        element={
          accessToken ? <WelcomePage /> : <Navigate to="/" replace />
        }
      />

      {/* 5) /gritPhases => if token => GritPhases, else => / */}
      <Route
        path="/gritPhases"
        element={
          accessToken ? <GritPhases /> : <Navigate to="/" replace />
        }
      />

      {/* Additional protected routes */}
      <Route
        path="/selectTheory"
        element={
          accessToken ? <NutritionTheory /> : <Navigate to="/" replace />
        }
      />
      <Route
        path="/selectGoal"
        element={
          accessToken ? <GymGoal /> : <Navigate to="/" replace />
        }
      />
      <Route
        path="/calorieCalc"
        element={
          accessToken ? <CalorieCalculator /> : <Navigate to="/" replace />
        }
      />
      <Route
        path="/displayCalculation"
        element={
          accessToken ? <CalorieDisplay /> : <Navigate to="/" replace />
        }
      />
      <Route
        path="/displayTargetCalories"
        element={
          accessToken ? <CalorieTarget /> : <Navigate to="/" replace />
        }
      />
      <Route
        path="/macros"
        element={
          accessToken ? <CalorieMacro /> : <Navigate to="/" replace />
        }
      />
      <Route
        path="/nextSteps"
        element={
          accessToken ? <NextStepsCarousel /> : <Navigate to="/" replace />
        }
      />
      <Route
        path="/leftSwipe"
        element={
          accessToken ? <LeftSwipe /> : <Navigate to="/" replace />
        }
      />
      <Route
        path="/rightSwipe"
        element={
          accessToken ? <RightSwipe /> : <Navigate to="/" replace />
        }
      />
      <Route
        path="/gFitReport"
        element={
          accessToken ? <GFitReport /> : <Navigate to="/" replace />
        }
      />

      {/* 6) Catch-all => go home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

const App = () => (
  <Router>
    <AppRoutes />
  </Router>
);

export default App;
