import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './components/Auth';
import LogoPage from './components/Logo';
import WelcomePage from './components/Welcome';
import { AuthContext } from './context/AuthContext';

const App = () => {
    const { token } = useContext(AuthContext);
    return (
        <Router>
            <Routes>
                <Route path="/" element={!token ? <Auth /> : <Navigate to="/logo" />} />
                <Route path="/login" element={!token ? <Auth /> : <Navigate to="/logo" />} />
                <Route path="/signup" element={!token ? <Auth /> : <Navigate to="/logo" />} />
                <Route path="/logo" element={token ? <LogoPage /> : <Navigate to="/" />} />
                 <Route
                    path="/welcome"
                    element={token ? <WelcomePage /> : <Navigate to="/" />}
                />
                {/* default for any other route */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
};


export default App;
