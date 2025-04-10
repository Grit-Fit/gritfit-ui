import React, { useState, useEffect } from "react";
import TabBar from "./TabBar";
import FriendsPage from "./FriendsPage";   
import ChatsPage from "./ChatsPage";
import { MessageSquareText, ContactRound, Gem } from "lucide-react";       
import "../css/Community.css"; 
import logo from "../assets/logo1.png";
import { useNavigate } from "react-router-dom";
import axios from "../axios";
import { useAuth } from "../context/AuthContext";

export default function Community() {
  const [activeTab, setActiveTab] = useState("friends");
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

  return (
    <div className="community-container">
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

      <div className="communityhead">       
        <h2 className="community-title">Community</h2>
        <div className="community-toggle-container">
          <button
            className={`community-toggle-btn ${activeTab === "friends" ? "active" : ""}`}
            onClick={() => setActiveTab("friends")}
            disabled={activeTab === "friends"}
          >
            <ContactRound />
            Friends
          </button>
          <button
            className={`community-toggle-btn ${activeTab === "chats" ? "active" : ""}`}
            onClick={() => setActiveTab("chats")}
            disabled={activeTab === "chats"}
          >
            <MessageSquareText />
            Chats
          </button>
        </div>
      </div> 

      {activeTab === "friends" && <FriendsPage />}
      {activeTab === "chats" && <ChatsPage />}

      <TabBar />
    </div>
  );
}
