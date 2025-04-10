import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";  
import { Lock, Unlock , Gem} from "lucide-react";
import "../css/GemsPage.css";
import { useNavigate } from "react-router-dom";
import axios from "../axios";
import logo from "../assets/logo1.png";
import TabBar from "./TabBar";

export default function GemsPage() {
  const [gems, setGems] = useState(0);
  const { accessToken} = useAuth();
  const navigate = useNavigate();

  function goToCard() {
    navigate("/cardView");
  }

  function goToGems() {
    navigate("/gems");
  }

 
  useEffect(() => {
    async function fetchGems() {
      try {
        const response = await axios.get("/api/getUserGems", {
           headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (response.data && typeof response.data.gems === "number") {
          setGems(response.data.gems);
        } else {
          setGems(0);
        }
      } catch (error) {
        console.error("Error fetching gems:", error);
        setGems(0);
      }
    }

    fetchGems();
  }, []);

  const rewardTiers = [
    { cost: 250, name: "Streak Freeze" },
    { cost: 500, name: "Streak Freeze" },
    { cost: 1500, name: "Streak Freeze" },
    { cost: 2500, name: "Streak Freeze" },
    { cost: 5000, name: "Streak Freeze" },
  ];

  return (
    <>
    <div className="gems-page-container">

<header className="gritphase-header">
        <img
          src={logo}
          alt="Logo"
          className="logo-gritPhases-task"
          onClick={goToCard}
        />
  
        <div
          className="gems-display"
          onClick={goToGems}
          style={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            marginLeft: "auto",
          }}
        >
          <Gem size={30} color="#00bcd4" />
          <span style={{ marginLeft: "0.5rem", fontWeight: "bold", fontSize: "1.2rem" }}>
            {gems}
          </span>
        </div>
      </header>

   
      <div className="communityhead" style={{width: "100%"}}>       
        <h2 className="community-title" style={{gap: "0.5rem"}}><Gem />Gems</h2>
      </div> 


      <div className="profile-options" style={{paddingLeft: "1rem", paddingRight: "1rem" }}>
          {rewardTiers.map((tier, index) => {
            const isUnlocked = gems >= tier.cost;
            return (
              <div key={index} className="profile-option" style={{height: "4rem"}}>
                <div className="option-left">
                  {isUnlocked ? (
                    <Unlock size={20} color="#28a745" />
                  ) : (
                    <Gem size={20} color="#00bcd4" />
                  )}
                  <span className="option-text">
                    {tier.cost} - {tier.name}
                  </span>
                </div>
                <div className="option-right">
                  {isUnlocked ? (
                    <span className="unlock-label">Unlocked</span>
                  ) : (
                    <span className="lock-label"><Lock /></span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <TabBar />
    </>
  );
}
