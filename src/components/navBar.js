import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../css/navBar.css";
import logo from "../assets/Logo.png";
import homeIcon from "../assets/home.png";
import gfitIcon from "../assets/gfit.png";
import signout from "../assets/singout.png";
import ContactUs from "./contactUs";
import { MessageSquare } from "lucide-react";

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
      onClose(); 
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

  // NEW: Back button handler
  const handleBackButton = (e) => {
    e.preventDefault();
    // 1) Close the navbar
    if (onClose) {
      onClose();
    }

    // 2) Optionally go back in history if you want:
    // navigate(-1);
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

          {/* Simple button with arrow text (no imports) */}
          <button className="back-button" onClick={handleBackButton}>
            ←
          </button>
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
              <img src={gfitIcon} alt="GFit" className="nav-icon" />
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
              <img src={signout} alt="Sign Out" className="nav-icon" />
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
