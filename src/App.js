import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Auth from "./components/Auth";
import WelcomePage from "./components/Welcome";
import GritPhases from "./components/GritPhases";

const App = () => {
    const { accessToken } = useAuth();

    return (
        <Router>
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
                        <Route path="/" element={<Navigate to="/gritPhases" />} />
                        <Route path="/gritPhases" element={<GritPhases />} />
                        <Route path="/welcome" element={<WelcomePage />} />
                        <Route path="*" element={<Navigate to="/gritPhases" />} />
                    </>
                )}
            </Routes>
        </Router>
    );
};

export default App;
