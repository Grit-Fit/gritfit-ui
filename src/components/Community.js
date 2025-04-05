// src/pages/Community.js (simplified)
import React, { useState } from "react";
import TabBar from "./TabBar";
import FriendsPage from "./FriendsPage";   
import ChatsPage from "./ChatsPage";
import { MessageSquareText, ContactRound, UsersRound } from "lucide-react";       
import "../css/Community.css"; 
import logo from "../assets/logo1.png";

export default function Community() {
  const [activeTab, setActiveTab] = useState("friends");

  return (
    <div className="community-container">
            <header className="gritphase-header">
              <img src={logo} alt="Logo" className="logo-gritPhases-task" />
            </header>

     <div class = "communityhead">       
      <h2 className="community-title"> Community</h2>

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
