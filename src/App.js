import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  // useLocation,
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
  const { accessToken } = useContext(AuthContext);
  // const location = useLocation();
  console.log("Token in APP: ", accessToken)
  return (
    <Router>
      <Routes>
        <Route path="/" element={!accessToken ? <Auth /> : <Navigate to="/gritPhases" />} />
        <Route
          path="/login"
          element={!accessToken ? <Auth /> : <Navigate to="/gritPhases" />}
        />
        <Route
          path="/signup"
          element={!accessToken ? <Auth /> : <Navigate to="/logo" />}
        />
        <Route
          path="/logo"
          element={accessToken ? <LogoPage /> : <Navigate to="/" />}
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
        {/* default for any other route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
