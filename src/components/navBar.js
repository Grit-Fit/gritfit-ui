import React, { useContext, useState } from "react";
import { MessageSquare } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../css/navBar.css";
import logo from "../assets/Logo.png";
import homeIcon from "../assets/home.png";
import gfitIcon from "../assets/gfit.png";
import signout from "../assets/singout.png";
import ContactUs from "./contactUs";

const NavBar = ({ isOpen, onClose }) => {
  const { accessToken, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showContactPopup, setShowContactPopup] = useState(false);

  const handleLogoClick = () => {
    if (onClose) {
      onClose();
    }
  };

  const handleHomeClick = (e) => {
    e.preventDefault();
    if (accessToken) {
      navigate("/gritPhases");
    } else {
      navigate("/");
    }
  };

  const handleGFitClick = (e) => {
    e.preventDefault();
    if (accessToken) {
      navigate("/gFitReport");
    }
  };

  const handleContactClick = (e) => {
    e.preventDefault();
    if (onClose) {
      onClose(); // Close the navbar when Contact Us is clicked
    }
    setShowContactPopup(true);
  };

  const handleSignOut = async (e) => {
    e.preventDefault();
    if (logout) {
      await logout();
    }
    navigate("/");
  };

  return (
    <>
      <nav className={`navbar ${isOpen ? "open" : ""}`}>
        <div className="navbar-header">
          <div className="logo-container-navbar">
            <img
              src={logo}
              alt="Logo"
              className="logo-image"
              onClick={handleLogoClick}
              style={{ cursor: "pointer" }}
            />
          </div>
        </div>

        <div className="navbar-separator" />

        <ul className="nav-items">
          <li>
            <a href="#home" onClick={handleHomeClick}>
              <img src={homeIcon} alt="Home" className="nav-icon" />
              Home
            </a>
          </li>
          <li>
            <a href="#gfit-report" onClick={handleGFitClick}>
              <img src={gfitIcon} alt="Home" className="nav-icon" />
              GFit Report
            </a>
          </li>
          <li>
            <a href="#contact-us" onClick={handleContactClick}>
              <MessageSquare size={20} className="nav-icon" />
              Contact Us
            </a>
          </li>
          <li>
            <a href="#sign-out" onClick={handleSignOut}>
              <img src={signout} alt="Home" className="nav-icon" />
              Sign Out
            </a>
          </li>
        </ul>
      </nav>

      <ContactUs
        isOpen={showContactPopup}
        onClose={() => setShowContactPopup(false)}
      />
    </>
  );
};

export default NavBar;
