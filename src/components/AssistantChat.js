// src/pages/AssistantChat.js
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { hydrationTips, proteinTips, motivationLines } from "../data/assistantData";
import { ChevronLeft, MessagesSquare } from "lucide-react";
import logo from "../assets/logo1.png";
import "../css/ChatDetail.css";
import TabBar from "./TabBar";
import FeedbackPrompt from "../components/FeedbackPrompt";        
import { AuthContext } from "../context/AuthContext";            

export default function AssistantChat() {
  /* ─────────────────────────────── basics ───────────────────────────── */
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const userId   = user?.userid || user?.id || "anon";

  /* one‑time flag */
  const feedbackKey = `gfitAssistFb_${userId}`;
  const askedBefore = !!localStorage.getItem(feedbackKey);

  /* ────────────────────────────── state ─────────────────────────────── */
  const [messages, setMessages] = useState([
    { id: 1, sender: "assistant",
      text: ["Hi! I'm GFit Assist. How can I help you today?"] },
  ]);

  const [selectedTopic, setSelectedTopic] = useState(null);
  const [showFB, setShowFB]               = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);   // user clicked a tip

  /* ───────────────────────────── helpers ───────────────────────────── */
  const getRandomLine = (arr) => arr[Math.floor(Math.random()*arr.length)];
  const getTopicArray = (t) =>
    t==="hydration"?hydrationTips : t==="protein"?proteinTips :
    t==="motivation"?motivationLines : [];

  /* add / remove tip bubbles */
  const addAssistantBubble = (lines) => setMessages((p)=>[
      ...p, { id:2, sender:"assistant", text:lines } ]);
  const removeTipsBubble   = () =>
      setMessages((p)=>p.filter((m)=>m.id!==2));

  /* ───────────────────────── topic toggle ────────────────────────── */
  const toggleTopic = (topic) => {
    setHasInteracted(true);

    if (selectedTopic===topic) { removeTipsBubble(); setSelectedTopic(null); return; }
    if (selectedTopic!==null)  removeTipsBubble();

    addAssistantBubble([ getRandomLine(getTopicArray(topic)) ]);
    setSelectedTopic(topic);
  };

  /* ───────────────────────── back nav ───────────────────────────── */
  const leave = () => navigate(-1);
  const handleBack = () => {
    if (!askedBefore && hasInteracted && !showFB) {
      setShowFB(true);
    } else {
      leave();
    }
  };
  const closeFeedback = () => {
    localStorage.setItem(feedbackKey,"1");   // never ask again
    setShowFB(false);
    leave();
  };

  /* ─────────────────────────── UI ──────────────────────────────── */
  return (
    <>
      <div className="chat-detail-container">
        {/* Header */}
        <header className="gritphase-header">
          <ChevronLeft className="backIcon" onClick={handleBack}/>
          <img src={logo} alt="Logo" className="logo-gritPhases-header"
               style={{marginRight:"18rem"}} onClick={handleBack}/>
        </header>

        {/* Page title */}
        <div className="chathead">
          <h2 className="community-title" style={{gap:"1rem"}}>
            <MessagesSquare/> GFit Assist Chat
          </h2>
        </div>

        {/* Messages */}
        <div className="messages-container">
          <div className="watermark"><img src={logo} alt="Logo"/></div>

          <div className="messages-list">
            {messages.map((m)=>(
              <div key={m.id}
                   className={m.sender==="user"
                     ?"chat-message-row mine":"chat-message-row their"}>
                {m.sender!=="user" && (
                  <div className="avatar-bubble" style={{background:"white"}}>
                    <img src={logo} alt="logo"/>
                  </div>
                )}
                <div className="message-bubble" style={{background:"white"}}>
                  {m.text.map((line,i)=><div key={i}>{line}</div>)}
                </div>
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="chat-input-row" style={{justifyContent:"center"}}>
            <button className="chat-send-btn"
                    onClick={()=>toggleTopic("hydration")}>Hydration Tips</button>
            <button className="chat-send-btn"
                    onClick={()=>toggleTopic("protein")}>Protein Tips</button>
            <button className="chat-send-btn"
                    onClick={()=>toggleTopic("motivation")}>Motivation</button>
          </div>
        </div>
        <button
          className="px-4 py-2 rounded bg-black text-white text-sm"
          onClick={() => setShowFB(true)}  
          style={{marginRight: "auto", marginLeft: "auto", width:"80%"}}
        >
          Give feedback
        </button>
      </div>

      <TabBar/>

      {/* Feedback modal */}
      {showFB && (
        <FeedbackPrompt
          feature="GFIT_ASSIST"
          question="How helpful was GFit Assist?"
          placeholder="What could be improved?"
          onClose={closeFeedback}
        />
      )}
    </>
  );
}
