import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../axios";
import { useAuth } from "../context/AuthContext";
import TabBar from "./TabBar";
import "../css/ChatDetail.css";
import { User, ChevronLeft, MessagesSquare } from "lucide-react";
import logo from "../assets/logo1.png";

export default function ChatDetail() {
  const { sessionId } = useParams();
  const { accessToken, user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchMessages();
    // eslint-disable-next-line
  }, [sessionId]);

  async function fetchMessages() {
    setError(null);
    try {
      const resp = await axios.get(`/api/helpMessages/${sessionId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setMessages(resp.data.messages || []);
    } catch (err) {
      setError("Could not fetch messages. " + err.message);
    }
  }

  async function sendMessage() {
    if (!newMsg.trim()) return;
    setError(null);
    try {
      await axios.post(
        "/api/sendHelpMessage",
        { sessionId, content: newMsg.trim() },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setNewMsg("");
      fetchMessages(); 
    } catch (err) {
      setError("Could not send message as you have reached your Help Messages limit!");
    }
  }

  function goBack() {
    navigate(-1);
  }

  return (
<>
  <div className="chat-detail-container">

  <header className="gritphase-header">
        <ChevronLeft className="backIcon" onClick={goBack} />
        <img
          src={logo}
          alt="Logo"
          className="logo-gritPhases-header"
          style={{ marginRight: "18rem"}}
          onClick={goBack}
        />
      </header>


    <div className="chathead">
      <h2 className="community-title" style={{ gap: "1rem" }}>
        <MessagesSquare /> Chats
      </h2>
    </div>

    {error && <p className="chat-error">{error}</p>}


    <div className="messages-container">

    <div className="watermark"><img src={logo} alt="Logo" /></div>
      
      <div className="messages-list">
        {messages.map((m) => {
          const isMyMessage = m.sender_id === user.id;
          const rowClass = isMyMessage ? "chat-message-row mine" : "chat-message-row their";

          const friendName = m.senderName || "";
          const friendInitials = friendName
            ? friendName.slice(0, 2).toUpperCase()
            : <User size={18} />;

          const myName = user?.username || "";
          const myInitials = myName
            ? myName.slice(0, 2).toUpperCase()
            : "Me";

          const lines = m.content.split("\n");

          return (
            <div key={m.id} className={rowClass}>
 
              {!isMyMessage && (
                <div className="avatar-bubble">
                  {friendInitials}
                </div>
              )}


              <div className="message-bubble">
                {lines.map((line, idx) => (
                  <div key={idx}>{line}</div>
                ))}
              </div>

              {isMyMessage && (
                <div className="avatar-bubble">
                  {myInitials}
                </div>
              )}
            </div>
          );
        })}
      </div>


      <div className="chat-input-row">
        <input
          type="text"
          className="chat-text-input"
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          placeholder="Type your message"
        />
        <button className="chat-send-btn" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  </div>

  <TabBar />
</>

  );
}
