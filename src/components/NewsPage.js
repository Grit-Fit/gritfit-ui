
import React, { useEffect, useState } from "react";
import axios from "../axios";
import { ChevronLeft, Newspaper } from "lucide-react";
import logo from "../assets/logo1.png";
import "../css/AssistantChat.css"; 
import TabBar from "./TabBar";

export default function NewsPage() {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get("/api/whatsNewList");
        setNewsList(data);
      } catch (err) {
        console.error("Failed to load news:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="chat-detail-container">
      <header className="gritphase-header">
        <ChevronLeft className="backIcon" onClick={() => window.history.back()} />
        <img
          src={logo}
          alt="Logo"
          className="logo-gritPhases-header"
          onClick={() => window.history.back()}
          style={{ marginRight: "18rem" }}
        />
      </header>

        {/* Page title */}
        <div className="chathead">
          <h2 className="community-title" style={{gap:"1rem"}}>
            <Newspaper size={32} />GFit News
          </h2>
        </div>

      {loading ? (
        <p>Loading news…</p>
      ) : newsList.length === 0 ? (
        <p>No news available.</p>
      ) : (
        <div className="messages-container">
        <div className="messages-list">
          {newsList.map(({ key, title, bullets, created_at }) => (
            <div key={key} className="message-bubble" style={{marginTop:"1rem"}}>
              <h3 className="news-card-title">{title}</h3>
              <ul className="news-card-bullets">
                {bullets.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        </div>
      )}

      <TabBar />
    </div>
  );
}
