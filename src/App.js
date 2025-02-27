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

// 1) Import your VerifyOtp component
import VerifyOtp from "./components/verifyOTP";

const AppRoutes = () => {
  const { accessToken } = useContext(AuthContext);
  const location = useLocation();
  const [redirectPath, setRedirectPath] = useState(null);
  const [signupRedirect, setSignupRedirect] = useState(false);

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

  // If no token, show Auth page (unless user is specifically going to /verify-otp)
  if (!accessToken) {
    // If the user is trying to go to /verify-otp, let them through:
    if (location.pathname === "/verify-otp") {
      return (
        <Routes>
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="*" element={<Navigate to="/verify-otp" />} />
        </Routes>
      );
    }
    // Otherwise, just show the Auth page
    return <Auth />;
  }

  // If we have a token but haven't decided where to redirect:
  if (!redirectPath) {
    return <div className="loading-screen">Loading...</div>;
  }

  // If we have a token, render protected routes
  return (
    <Routes>
      <Route path="/" element={<Auth />} />
      <Route
        path="/login"
        element={!accessToken ? <Auth /> : <Navigate to="/gritPhases" />}
      />
      <Route
        path="/signup"
        element={!accessToken ? <Auth /> : <Navigate to="/welcome" />}
      />
      {/* 2) Public route for VerifyOtp, in case user isn't logged in yet */}
      <Route path="/verify-otp" element={<VerifyOtp />} />

      <Route
        path="/logo"
        element={accessToken ? <LogoPage /> : <Navigate to="/welcome" />}
      />
      <Route
        path="/welcome"
        element={accessToken ? <WelcomePage /> : <Navigate to="/" />}
      />
      <Route
        path="/gritPhases"
        element={accessToken ? <GritPhases /> : <Navigate to="/" />}
      />
      <Route
        path="/selectTheory"
        element={accessToken ? <NutritionTheory /> : <Navigate to="/" />}
      />
      <Route
        path="/selectGoal"
        element={accessToken ? <GymGoal /> : <Navigate to="/" />}
      />
      <Route
        path="/calorieCalc"
        element={accessToken ? <CalorieCalculator /> : <Navigate to="/" />}
      />
      <Route
        path="/displayCalculation"
        element={accessToken ? <CalorieDisplay /> : <Navigate to="/" />}
      />
      <Route
        path="/displayTargetCalories"
        element={accessToken ? <CalorieTarget /> : <Navigate to="/" />}
      />
      <Route
        path="/macros"
        element={accessToken ? <CalorieMacro /> : <Navigate to="/" />}
      />
      <Route
        path="/nextSteps"
        element={accessToken ? <NextStepsCarousel /> : <Navigate to="/" />}
      />
      <Route
        path="/leftSwipe"
        element={accessToken ? <LeftSwipe /> : <Navigate to="/" />}
      />
      <Route
        path="/rightSwipe"
        element={accessToken ? <RightSwipe /> : <Navigate to="/" />}
      />
      <Route
        path="/gFitReport"
        element={accessToken ? <GFitReport /> : <Navigate to="/" />}
      />

      {/* Default catch-all route */}
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
