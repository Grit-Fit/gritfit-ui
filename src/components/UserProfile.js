import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/UserProfile.css";
import settingsIcon from "../assets/setting.png";
import calorieIcon from "../assets/calculator.png";
import referIcon from "../assets/refer.png";
import rewardsIcon from "../assets/reward.png";
import supportIcon from "../assets/support.png";
import logo from "../assets/logo1.png";
import "../css/CardView.css";
import TabBar from "./TabBar";
import { useAuth } from "../context/AuthContext";
import axios from "../axios";
import { Lock, ChevronRight } from "lucide-react";

export default function UserProfile() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [clickedIndex, setClickedIndex] = useState(null);
  const { accessToken, refreshAuthToken } = useAuth(); 

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
        setUserName(response.data.username || "Harvey Williams");
        setEmail(response.data.email || "");
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    }

    if (accessToken) {
      fetchUserData();
    }
  }, [accessToken]);

  // Each item now has { text, locked, icon }
  const cardData = [
    { text: "Settings", locked: false, icon: settingsIcon },
    { text: "Custom Calorie Calculator", locked: false, icon: calorieIcon },
    { text: "Refer a Friend", locked: true, icon: referIcon },
    { text: "Rewards", locked: true, icon: rewardsIcon },
    { text: "FAQs", locked: false, icon: supportIcon },
  ];

  // Subcomponent for each row
  function StatusCard({ text, locked, isClicked, icon, onClick }) {
    const classNames = ["profile-option"];
    if (locked) classNames.push("locked");
    if (isClicked) classNames.push("clicked");

    return (
      <div className={classNames.join(" ")} onClick={onClick}>
        {/* Left side: icon + text */}
        <div className="option-left">
          <img src={icon} alt={text} className="option-icon" />
          <span className="option-text">{text}</span>
        </div>

        {/* Right side: lock or chevron */}
        <div className="option-right">
          {locked ? <Lock size={18} /> : <ChevronRight size={18} />}
        </div>
      </div>
    );
  }

  // Handle card clicks
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

  return (
    <>
      <header className="gritphase-header">
        <img src={logo} alt="Logo" className="logo-gritPhases-task" />
        <div className="phase-row" />
      </header>

      <div className="userprofile-container">
        <div className="profile-header">
          <div className="profile-avatar">U</div>
          <h2 className="profile-username">{userName}</h2>
          <p className="profile-email">{email}</p>
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
