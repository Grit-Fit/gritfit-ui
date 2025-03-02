import React, { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../css/navBar.css";
import logo from "../assets/Logo.png";
import homeIcon from "../assets/home.png";
import gfitIcon from "../assets/gfit.png";
import signout from "../assets/singout.png";
import ContactUs from "./contactUs";
import { MessageSquare } from "lucide-react";
import nutritionData from "./nutritionData"; // Importing Nutrition Data

const NavBar = ({ isOpen, onClose }) => {
  const { accessToken, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showContactPopup, setShowContactPopup] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);
  const navbarRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleClickOutside = (event) => {
    console.log("Document clicked!", event.target);
    if (navbarRef.current && !navbarRef.current.contains(event.target)) {
      onClose(); // Close navbar if clicked outside
    }
  };

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
    if (onClose) {
      onClose();
    }
  };

  // Nutrition Section Handler
  const handleStoreClick = (store) => {
    setSelectedStore(selectedStore === store ? null : store);
  };

  return (
    <>
      <nav className={`navbar ${isOpen ? "open" : ""}`} ref={navbarRef}>
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

        {/* Nutrition Section - ADDED BELOW WITHOUT CHANGING ANYTHING ELSE */}
        <div className="navbar-separator" />
        <li className="nav-title">Nutrition</li>
        <ul className="nutrition-store-list">
          {Object.keys(nutritionData).map((store) => (
            <li
              key={store}
              className={`store-button ${selectedStore === store ? "active" : ""}`}
              onClick={() => handleStoreClick(store)}
            >
              {store}
            </li>
          ))}
        </ul>

        {selectedStore && (
          <div className="store-food-table">
            <h4>Available Foods at {selectedStore}</h4>

            {['Proteins', 'Carbohydrates', 'Fats'].map((category) => (
              <div key={category}>
                <h5>{category}</h5>
                <table>
                  <thead>
                    <tr>
                      <th>Food Item</th>
                      <th>Calories/100g</th>
                      <th>
                        {category === 'Proteins' ? 'Protein/100g' :
                          category === 'Carbohydrates' ? 'Carbs/100g' : 'Fat/100g'}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {nutritionData[selectedStore]?.[category]?.map((food, index) => (
                      <tr key={index}>
                        <td>{food.foodItem}</td>
                        <td>{food.calories}</td>
                        <td>
                          {category === 'Proteins' ? `${food.protein}g` :
                            category === 'Carbohydrates' ? `${food.carbs}g` :
                            `${food.fat}g`}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        )}
      </nav>

      <ContactUs isOpen={showContactPopup} onClose={() => setShowContactPopup(false)} />
    </>
  );
};

export default NavBar;
