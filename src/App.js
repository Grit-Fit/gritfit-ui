// App.js
import React, { useContext, useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthContext } from "./context/AuthContext";


// Public components
import Landing from "./components/Landing";
import Auth from "./components/Auth";

// “Welcome” flow
import WelcomePage from "./components/Welcome";

// Old bubble-based GritPhases
import GritPhases from "./components/GritPhases";

// Left/Right swipes
import LeftSwipe from "./components/leftSwipe";
import RightSwipe from "./components/rightSwipe";

// Other pages
import GFitReport from "./components/gFitReport";
import CalorieCalculator from "./components/CalorieCalculator";
import CalorieDisplay from "./components/CalorieDisplay";
import CalorieTarget from "./components/CalorieTarget";
import CalorieMacro from "./components/CalorieMacro";
import NextStepsCarousel from "./components/NextStepsCarousel";
import NutritionTheory from "./components/NutritionTheory";
import GymGoal from "./components/GymGoal";
import NutritionPage from "./components/NutritionPage";
import UserProfile from "./components/UserProfile";
import SupportFaq from "./components/SupportFaq";
import Settings from "./components/Settings";
import IntroVideoPage from "./components/IntroVideoPage";
import FinalStepsPage from "./components/FinalStepsPage";
import TermsAndConditions from "./components/TermsAndConditions";
import BeamsSetup from "./BeamsSetup";

import OTPVerify from "./components/OTPVerify";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";

// New card-based UI
import CardView from "./components/CardView";

function AppRoutes() {
  const { accessToken } = useContext(AuthContext);
  const [redirectPath, setRedirectPath] = useState(null);

  // Decide redirect path based on login status
  useEffect(() => {
    if (accessToken) {
      const storedSignup = localStorage.getItem("justSignedUp") === "true";
      if (storedSignup) {
        setRedirectPath("/welcome");
        localStorage.removeItem("justSignedUp");
      } else {
        setRedirectPath("/cardView");
      }
    } else {
      setRedirectPath("/");
    }
  }, [accessToken]);


  // If we haven't decided on a path yet, show a loading indicator
  if (redirectPath === null) {
    return <div className="loading-screen">Loading...</div>;
  }

  // If user is NOT logged in
  if (!accessToken) {
    return (
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/signup" element={<Auth />} />
        <Route path="/otpVerify" element={<OTPVerify />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/resetPassword" element={<ResetPassword />} />
        {/* Catch-all goes back to landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  // If user IS logged in
  return (
    <Routes>
      {/* Automatically redirect root to the chosen path (cardView or welcome) */}
      <Route path="/" element={<Navigate to={redirectPath} replace />} />

      {/* New Card-based UI as main screen */}
      <Route path="/cardView" element={<CardView />} />

      {/* Welcome page for newly signed up users */}
      <Route path="/welcome" element={<WelcomePage />} />

      {/* Existing or old routes */}
      <Route path="/gritPhases" element={<GritPhases />} />
      <Route path="/leftSwipe" element={<LeftSwipe />} />
      <Route path="/rightSwipe" element={<RightSwipe />} />

      {/* Other pages */}
      <Route path="/selectTheory" element={<NutritionTheory />} />
      <Route path="/selectGoal" element={<GymGoal />} />
      <Route path="/calorieCalc" element={<CalorieCalculator />} />
      <Route path="/supportFaqs" element={<SupportFaq />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/displayCalculation" element={<CalorieDisplay />} />
      <Route path="/displayTargetCalories" element={<CalorieTarget />} />
      <Route path="/macros" element={<CalorieMacro />} />
      <Route path="/nextSteps" element={<NextStepsCarousel />} />
      <Route path="/gFitReport" element={<GFitReport />} />
      <Route path="/nutrition" element={<NutritionPage />} />
      <Route path="/UserProfile" element={<UserProfile />} />
      <Route path="/introVideo" element={<IntroVideoPage />} />
      <Route path="/finalSteps" element={<FinalStepsPage />} />
      <Route path="/terms" element={<TermsAndConditions />} />

              {/* OTP verification after sign-up */}
        

{/* Forgot password flow */}

      

      {/* Catch-all: if logged in but path not recognized, go to redirectPath */}
      <Route path="*" element={<Navigate to={redirectPath} replace />} />
    </Routes>
    
  );
}

export default function App() {
  return (
    <Router>
      <AppRoutes />
      <BeamsSetup />
    </Router>
  );
}
