import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Auth from './components/Auth';
import LogoPage from './components/Logo';
import WelcomePage from './components/Welcome';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Auth />} />
                <Route path="/login" element={<Auth />} />
                <Route path="/signup" element={<Auth />} />
                <Route path="/logo" element={<LogoPage />} />
                <Route path="/welcome" element={<WelcomePage />} />
            </Routes>
        </Router>
    );
};


export default App;
