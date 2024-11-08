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
import { AuthContext } from "./context/AuthContext";
import GritPhases from "./components/GritPhases";
import LeftSwipe from "./components/leftSwipe";
import RightSwipe from "./components/rightSwipe";
import GFitReport from "./components/gFitReport";

const App = () => {
  const { token } = useContext(AuthContext);
  return (
    <Router>
      <Routes>
        <Route path="/" element={!token ? <Auth /> : <Navigate to="/logo" />} />
        <Route
          path="/login"
          element={!token ? <Auth /> : <Navigate to="/logo" />}
        />
        <Route
          path="/signup"
          element={!token ? <Auth /> : <Navigate to="/logo" />}
        />
        <Route
          path="/logo"
          element={token ? <LogoPage /> : <Navigate to="/" />}
        />
        <Route
          path="/welcome"
          element={token ? <WelcomePage /> : <Navigate to="/" />}
        />
        <Route
          path="/gritPhases"
          element={token ? <GritPhases /> : <Navigate to="/" />}
        />
        <Route
          path="/leftSwipe"
          element={token ? <LeftSwipe /> : <Navigate to="/" />}
        />
        <Route
          path="/rightSwipe"
          element={token ? <RightSwipe /> : <Navigate to="/" />}
        />
        <Route
          path="/gFitReport"
          element={token ? <GFitReport /> : <Navigate to="/" />}
        />
        {/* default for any other route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
