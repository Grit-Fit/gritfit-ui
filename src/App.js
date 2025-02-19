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

const AppRoutes = () => {
  const { accessToken } = useContext(AuthContext);
  const location = useLocation();
  const [redirectPath, setRedirectPath] = useState(null);
  const [signupRedirect, setSignupRedirect] = useState(false);

  useEffect(() => {
    // console.log("🚀 App Loaded! Current Path:", location.pathname);
    // console.log("✅ Access Token:", accessToken);
    // console.log("📌 Signup Status:", localStorage.getItem("justSignedUp"));

    if (accessToken) {
      const storedSignup = localStorage.getItem("justSignedUp") === "true";

      if (storedSignup) {
        // console.log("🟢 New signup detected, redirecting to /welcome...");
        setRedirectPath("/welcome");
        setSignupRedirect(true);

        // setTimeout(() => {
        //   localStorage.removeItem("justSignedUp");
        //   setSignupRedirect(false);
        // }, 3000);
      } else {
        // console.log("🔵 Regular login, redirecting to /gritPhases...");
        setRedirectPath("/gritPhases");
      }
    }
  }, [accessToken]);

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
      <Route
        path="/"
        element={
          signupRedirect
            ? <Navigate to="/welcome" replace />
            : <Navigate to={redirectPath || "/gritPhases"} replace />
        }
      />

      <Route path="/login" element={!accessToken ? <Auth /> : <Navigate to="/gritPhases" />} />
      <Route path="/signup" element={!accessToken ? <Auth /> : <Navigate to="/welcome" />} />
      <Route path="/logo" element={accessToken ? <LogoPage /> : <Navigate to="/welcome" />} />
      <Route path="/welcome" element={accessToken ? <WelcomePage /> : <Navigate to="/" />} />
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
      <Route path="*" element={<Navigate to="/" />} />
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
