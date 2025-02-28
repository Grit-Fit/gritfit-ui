import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Auth from "./components/Auth";
import WelcomePage from "./components/Welcome";
import GritPhases from "./components/GritPhases";

const AppRoutes = () => {
    const { accessToken } = useAuth();
    const location = useLocation();

    const isFromEmailVerification = location.state?.fromEmailVerification;

    return (
        <Routes>
            {!accessToken ? (
                <>
                    <Route path="/" element={<Auth />} />
                    <Route path="/signup" element={<Auth mode="signup" />} />
                    <Route path="/login" element={<Auth mode="login" />} />
                    <Route path="/welcome" element={<WelcomePage />} />
                    <Route path="*" element={<Navigate to="/" />} />
                </>
            ) : (
                <>
                    <Route path="/" element={<Navigate to={isFromEmailVerification ? "/welcome" : "/gritPhases"} />} />
                    <Route path="/gritPhases" element={<GritPhases />} />
                    <Route path="/welcome" element={<WelcomePage />} />
                    <Route path="*" element={<Navigate to="/gritPhases" />} />
                </>
            )}
        </Routes>
    );
};

const App = () => (
    <Router>
        <AppRoutes />
    </Router>
);

export default App;
