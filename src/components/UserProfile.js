import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/UserProfile.css";
import settingsIcon from "../assets/setting.png";
import calorieIcon from "../assets/calculator.png";
import referIcon from "../assets/refer.png";
import rewardsIcon from "../assets/reward.png";
import supportIcon from "../assets/support.png";
import logo from "../assets/logo1.png";
import userImg from "../assets/user.png";
import "../css/CardView.css";
import TabBar from "./TabBar";
import { useAuth } from "../context/AuthContext";
import axios from "../axios";
import { Lock, ChevronRight, Edit2 } from "lucide-react";

export default function UserProfile() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [clickedIndex, setClickedIndex] = useState(null);
  const { accessToken, refreshAuthToken } = useAuth();


  const [editMode, setEditMode] = useState(false);
  const [tempUsername, setTempUsername] = useState("");

  
  const [avatarBackground, setAvatarBackground] = useState("#d8d8d8"); 

  
  const backgroundOptions = [
    "#d8d8d8", 
    "linear-gradient(45deg, #00bcd4, #4caf50)",
    "linear-gradient(45deg, #ff5722, #ffc107)",
    "linear-gradient(45deg, #9c27b0, #e91e63)",
    "linear-gradient(45deg, #2196f3, #00bcd4)",
    "linear-gradient(45deg, #4caf50, #8bc34a)"
  ];

  useEffect(() => {
    if (!accessToken) {
      refreshAuthToken();
    }
  }, [accessToken, refreshAuthToken]);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await axios.get("/api/getUserProfile", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setUserName(response.data.username || "User");
        setEmail(response.data.email || "");
        setAvatarBackground(response.data.avatar_color || "#d8d8d8");
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    }
    if (accessToken) {
      fetchUserData();
    }
  }, [accessToken]);

  const cardData = [
    { text: "Settings", locked: false, icon: settingsIcon },
    { text: "Custom Calorie Calculator", locked: false, icon: calorieIcon },
    { text: "Refer a Friend", locked: true, icon: referIcon },
    { text: "Rewards", locked: true, icon: rewardsIcon },
    { text: "FAQs", locked: false, icon: supportIcon },
  ];

  function StatusCard({ text, locked, isClicked, icon, onClick }) {
    const classNames = ["profile-option"];
    if (locked) classNames.push("locked");
    if (isClicked) classNames.push("clicked");
    return (
      <div className={classNames.join(" ")} onClick={onClick}>
        <div className="option-left">
          <img src={icon} alt={text} className="option-icon" />
          <span className="option-text">{text}</span>
        </div>
        <div className="option-right">
          {locked ? <Lock size={18} /> : <ChevronRight size={18} />}
        </div>
      </div>
    );
  }

  const handleCardClick = (index) => {
    setClickedIndex(index);
    const item = cardData[index];
    if (item.locked) {
      alert("This feature is locked!");
      return;
    }
    switch (item.text) {
      case "Settings":
        navigate("/settings");
        break;
      case "Custom Calorie Calculator":
        navigate("/calorieCalc");
        break;
      case "Refer a Friend":
        navigate("/referAFriend");
        break;
      case "Rewards":
        navigate("/rewards");
        break;
      case "FAQs":
        navigate("/supportFaqs");
        break;
      default:
        break;
    }
  };

  function goToCard() {
    navigate("/cardView");
  }

  
  function handleEditClick() {
    setTempUsername(userName);
    setEditMode(true);
  }

  async function handleSaveUsername() {
    try {
      await axios.post(
        "/api/updateUsername",
        { newUsername: tempUsername },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setUserName(tempUsername);
      setEditMode(false);
    } catch (error) {
      console.error("Error updating username:", error);
      alert("Failed to update username. Please try again.");
    }
  }

  function handleCancelEdit() {
    setEditMode(false);
  }

  
  async function updateAvatarBackground(newBackground) {
    try {
      await axios.post(
        "/api/updateAvatarColor",
        { newAvatarColor: newBackground },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setAvatarBackground(newBackground);
    } catch (error) {
      console.error("Error updating avatar background:", error);
      alert("Failed to update avatar background. Please try again.");
    }
  }

  return (
    <>
      <header className="gritphase-header">
        <img
          src={logo}
          alt="Logo"
          className="logo-gritPhases-task"
          onClick={goToCard}
        />
        <div className="phase-row" />
      </header>

      <div className="userprofile-container">
        <div className="profile-header" style={{ position: "relative" }}>
         
          {!editMode && (
            <div className="edit-icon-container" onClick={handleEditClick}>
              <Edit2 size={20} />
            </div>
          )}

         
          <div
            className="profile-avatar"
            style={{ background: avatarBackground }}
          >
            <img src={userImg} alt="Profile Avatar" />
          </div>

         
          {editMode ? (
            <div className="username-edit-container">
              <input
                type="text"
                value={tempUsername}
                onChange={(e) => setTempUsername(e.target.value)}
                className="username-edit-input"
              />
             
              <div className="color-palette">
                {backgroundOptions.map((bg, idx) => (
                  <div
                    key={idx}
                    className="color-swatch"
                    style={{ background: bg }}
                    onClick={() => updateAvatarBackground(bg)}
                  ></div>
                ))}
              </div>
              <div className="edit-buttons-container">
                <button className="save-username-btn" onClick={handleSaveUsername}>
                  Save
                </button>
                <button className="cancel-username-btn" onClick={handleCancelEdit}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <h2 className="profile-username">{userName}</h2>
              <p className="profile-email">{email}</p>
            </>
          )}
        </div>

        {/* List of cards */}
        <div className="profile-options">
          {cardData.map((card, index) => (
            <StatusCard
              key={index}
              text={card.text}
              locked={card.locked}
              icon={card.icon}
              isClicked={clickedIndex === index && !card.locked}
              onClick={() => handleCardClick(index)}
            />
          ))}
        </div>
      </div>

      <TabBar />
    </>
  );
}
