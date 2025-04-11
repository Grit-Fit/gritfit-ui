// src/pages/ChatDetail.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../axios";
import { useAuth } from "../context/AuthContext";
import TabBar from "./TabBar";
import "../css/ChatDetail.css";
import { User, ChevronLeft, MessageSquareText } from "lucide-react";
import logo from "../assets/logo1.png";

export default function ChatDetail() {
  const { sessionId } = useParams();
  const { accessToken, user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const [error, setError] = useState(null);

  // Modal state for displaying rating feedback
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

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
      // Assume messages are returned sorted by created_at (oldest first)
      setMessages(resp.data.messages || []);
    } catch (err) {
      setError("Could not fetch messages: " + err.message);
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
      setError("Could not send message: " + err.message);
    }
  }

  // Determine the help requester based on the very first message
  const helpRequesterId = messages.length > 0 ? messages[0].sender_id : null;
  const isHelpSeeker = user.id === helpRequesterId;
  // Find index of the very first friend message (i.e. message not sent by help requester)
  const firstFriendMessageIndex = messages.findIndex(m => m.sender_id !== helpRequesterId);

  // Called when the user clicks one of the rating buttons:
  async function markMessageRating(messageId, rating) {
    setError(null);
    try {
      await axios.post(
        "/api/markMessageHelpful",
        { messageId, rating }, // rating: "helpful", "somewhat", or "not"
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      fetchMessages(); // Refresh messages after rating

      // Set modal feedback based on the rating choice:
      if (rating === "helpful") {
        setModalMessage("Awesome! You found this truly helpful. Your friend has received 10 gems.");
      } else if (rating === "somewhat") {
        setModalMessage("Thanks for the partial help! Your friend has earned 5 gems for their effort.");
      } else if (rating === "not") {
        setModalMessage("No worries, you can always look out for solutions on GFit Assist Chat.");
      }
      setShowModal(true);
    } catch (err) {
      const serverErr = err?.response?.data?.error || "Could not rate message.";
      setError(serverErr);
    }
  }

  function goBack() {
    navigate(-1);
  }

  // Determine if any message in this chat already has a rating
  const chatAlreadyRated = messages.some((m) =>
    ["helpful", "somewhat", "not"].includes(m.rating)
  );

  return (
    <>
      <div className="chat-detail-container">
        {/* Header */}
        <header className="gritphase-header">
          <ChevronLeft className="backIcon" onClick={goBack} />
          <img
            src={logo}
            alt="Logo"
            className="logo-gritPhases-header"
            onClick={goBack}
            style={{ marginRight: "18rem" }}
          />
        </header>

        <div className="chathead">
          <h2 className="community-title">
            <MessageSquareText /> Chats
          </h2>
        </div>

        {error && <p className="chat-error">{error}</p>}

        <div className="messages-container">
          <div className="watermark">
            <img src={logo} alt="Logo" />
          </div>
          <div className="messages-list">
            {messages.map((m, index) => {
              const isMyMessage = m.sender_id === user.id;
              const rowClass = isMyMessage
                ? "chat-message-row mine"
                : "chat-message-row their";

              const friendName = m.senderName || "";
              const friendInitials = friendName
                ? friendName.slice(0, 2).toUpperCase()
                : <User size={18} />;
              const myName = user?.username || "";
              const myInitials = myName
                ? myName.slice(0, 2).toUpperCase()
                : "Me";

              // Determine if this message is the first friend message (the only one that's rateable)
              const canRate =
                isHelpSeeker &&
                !isMyMessage &&
                (index === firstFriendMessageIndex) &&
                !chatAlreadyRated &&
                !m.rating;

              return (
                <div key={m.id} className={rowClass}>
                  {/* Friend's avatar on the left; mine on the right */}
                  {!isMyMessage && <div className="avatar-bubble">{friendInitials}</div>}

                  {/* Message content container (stacks bubble and rating options vertically) */}
                  <div className="message-content">
                    <div className="message-bubble">
                      {m.content.split("\n").map((line, idx) => (
                        <div key={idx}>{line}</div>
                      ))}
                    </div>

                    {/* Only the first friend message is rateable */}
                    {canRate && (
                      <div className="rating-buttons-container">
                        <button
                          className="rating-btn helpful-btn"
                          onClick={() => markMessageRating(m.id, "helpful")}
                        >
                          Helpful
                        </button>
                        <button
                          className="rating-btn somewhat-btn"
                          onClick={() => markMessageRating(m.id, "somewhat")}
                        >
                          Somewhat
                        </button>
                        <button
                          className="rating-btn nothelpful-btn"
                          onClick={() => markMessageRating(m.id, "not")}
                        >
                          Not Helpful
                        </button>
                      </div>
                    )}
                    {m.rating && (
                      <div className="marked-helpful-label">
                        Rated: {m.rating}
                      </div>
                    )}
                  </div>

                  {isMyMessage && <div className="avatar-bubble">{myInitials}</div>}
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

      {/* Modal for displaying rating feedback */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p>{modalMessage}</p>
            <button onClick={() => setShowModal(false)} className="close-modal-btn">
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
}
