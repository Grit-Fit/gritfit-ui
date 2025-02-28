import React from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import { useAuth } from "./context/AuthContext";
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

const AppRoutes = () => {
    const { accessToken } = useAuth();

    if (!accessToken) {
        return (
            <Routes>
                <Route path="/" element={<Auth />} />
                <Route path="/welcome" element={<WelcomePage />} />
                {/* Add other public routes like forgot password if needed */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        );
    }

    return (
        <Routes>
            <Route path="/" element={<Navigate to="/gritPhases" />} />
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
            <Route path="*" element={<Navigate to="/gritPhases" />} />
        </Routes>
    );
};

const App = () => (
    <Router>
        <AppRoutes />
    </Router>
);

export default App;
