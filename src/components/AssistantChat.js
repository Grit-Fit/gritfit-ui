
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { hydrationTips, proteinTips, motivationLines } from "../data/assistantData";
import { ChevronLeft, User, MessagesSquare } from "lucide-react";
import logo from "../assets/logo1.png";
import "../css/ChatDetail.css"; 
import TabBar from "./TabBar";

export default function AssistantChat() {
  const navigate = useNavigate();


  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "assistant",
      text: ["Hi! I'm GFit Assist. How can I help you today?"],
    },
  ]);

  // Track which topic is currently displayed (if any)
  // "hydration" | "protein" | "motivation" | null
  const [selectedTopic, setSelectedTopic] = useState(null);

  function goBack() {
    navigate(-1);
  }

  // Return a single random line from the array
  function getRandomLine(linesArray) {
    const index = Math.floor(Math.random() * linesArray.length);
    return linesArray[index];
  }

  // Each topic array
  function getTopicArray(topic) {
    if (topic === "hydration") return hydrationTips;
    if (topic === "protein") return proteinTips;
    if (topic === "motivation") return motivationLines;
    return [];
  }

  function toggleTopic(topic) {
    // If user clicks the same topic again, close it
    if (selectedTopic === topic) {
      removeTipsBubble();
      setSelectedTopic(null);
      return;
    }


    if (selectedTopic !== null) {
      removeTipsBubble();
    }


    const topicArray = getTopicArray(topic);
    const randomLine = getRandomLine(topicArray);
    addAssistantBubble([randomLine]); 

    setSelectedTopic(topic);
  }

  function addAssistantBubble(lines) {
    const tipsBubble = {
      id: 2, 
      sender: "assistant",
      text: lines,
    };
    setMessages((prev) => [...prev, tipsBubble]);
  }

  function removeTipsBubble() {
    // remove message with id=2 if it exists
    setMessages((prev) => prev.filter((msg) => msg.id !== 2));
  }

  return (
    <>
      <div className="chat-detail-container">
        {/* Header row */}
        <header className="chat-header">
          <img src={logo} alt="Logo" className="logo-gritPhases-task" onClick={goBack}/>
        </header>

        {/* Title Section */}
        <div className="chathead">
          <h2 className="community-title" style={{ gap: "1rem" }}>
            <MessagesSquare /> GFit Assist Chat
          </h2>
        </div>

        {/* Messages container */}
        <div className="messages-container">
          <div className="watermark">
            <img src={logo} alt="Logo" />
          </div>

          <div className="messages-list">
            {messages.map((m) => {
              const isMyMessage = (m.sender === "user");
              const rowClass = isMyMessage
                ? "chat-message-row mine"
                : "chat-message-row their";

              return (
                <div key={m.id} className={rowClass}>
                  {!isMyMessage && (
                    <div className="avatar-bubble" style={{ backgroundColor: "white" }}>
                      <img src={logo} alt="Logo"/>
                    </div>
                  )}

                  <div className="message-bubble" style={{ backgroundColor: "white" }}>
                    {m.text.map((line, idx) => (
                      <div key={idx}>{line}</div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

         
          <div className="chat-input-row" style={{ justifyContent: "center" }}>
            <button
              className="chat-send-btn"
              onClick={() => toggleTopic("hydration")}
            >
              Hydration Tips
            </button>
            <button
              className="chat-send-btn"
              onClick={() => toggleTopic("protein")}
            >
              Protein Tips
            </button>
            <button
              className="chat-send-btn"
              onClick={() => toggleTopic("motivation")}
            >
              Motivation
            </button>
          </div>
        </div>
      </div>
      <TabBar />
    </>
  );
}
