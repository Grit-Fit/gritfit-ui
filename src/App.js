import React, { useContext, useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
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
import Verified from "./components/verified.js";

const AppRoutes = () => {
  const { accessToken } = useContext(AuthContext);
  const location = useLocation();
  const [redirectPath, setRedirectPath] = useState(null);
  const [signupRedirect, setSignupRedirect] = useState(false);

//change 33-57

  useEffect(() => {
    if (accessToken) {
      const storedSignup = localStorage.getItem("justSignedUp") === "true";
      if (storedSignup) {
        setRedirectPath("/welcome");
        setSignupRedirect(true);
      } else {
        setRedirectPath("/gritPhases");
      }
    }
  }, [accessToken]);


  // 1) If route is "/verified", allow user to proceed without token
  if (location.pathname === "/verified") {
    return (
      <Routes>
        <Route path="/verified" element={<Verified />} />
        {/* Possibly other public routes */}
        {/* Fallback route to /verified */}
        <Route path="*" element={<Navigate to="/verified" />} />
      </Routes>
    );
  }


  if (!accessToken) {
    // console.log("⚠️ No access token, staying on Auth page.");
    return <Auth />;
  }

  if (!redirectPath) {
  //  console.log("⏳ Waiting for redirect to be determined...");
    return <div className="loading-screen">Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={<Auth />} />
      {/* <Route
        path="/"
        element={
          signupRedirect
            ? <Navigate to="/welcome" replace />
            : <Navigate to={redirectPath || "/gritPhases"} replace />
        }
      /> */}

      <Route path="/login" element={!accessToken ? <Auth /> : <Navigate to="/gritPhases"  />} />
      <Route path="/signup" element={!accessToken ? <Auth /> : <Navigate to="/welcome"  />} />
      <Route path="/logo" element={accessToken ? <LogoPage /> : <Navigate to="/welcome" />} />
      <Route path="/welcome" element={accessToken ? <WelcomePage /> : <Navigate to="/"  />} />
      <Route path="/gritPhases" element={accessToken ? <GritPhases /> : <Navigate to="/" />} />
      <Route path="/selectTheory" element={accessToken ? <NutritionTheory /> : <Navigate to="/" />} />
      <Route path="/selectGoal" element={accessToken ? <GymGoal /> : <Navigate to="/" />} />
      <Route path="/calorieCalc" element={accessToken ? <CalorieCalculator /> : <Navigate to="/" />} />
      <Route path="/displayCalculation" element={accessToken ? <CalorieDisplay /> : <Navigate to="/" />} />
      <Route path="/displayTargetCalories" element={accessToken ? <CalorieTarget /> : <Navigate to="/" />} />
      <Route path="/macros" element={accessToken ? <CalorieMacro /> : <Navigate to="/" />} />
      <Route path="/nextSteps" element={accessToken ? <NextStepsCarousel /> : <Navigate to="/" />} />
      <Route path="/leftSwipe" element={accessToken ? <LeftSwipe /> : <Navigate to="/" />} />
      <Route path="/rightSwipe" element={accessToken ? <RightSwipe /> : <Navigate to="/" />} />
      <Route path="/gFitReport" element={accessToken ? <GFitReport /> : <Navigate to="/" />} />

      {/* Default catch-all route */}
     {/* <Route path="/" element={<AppRoutes />} /> */}
      {/* <Route path="*" element={<Navigate to="/" />} /> */}
    </Routes>
  );
};

// ✅ Wrap Routes in Router
const App = () => (
  <Router>
    <AppRoutes />
  </Router>
);

export default App;
