// src/components/HelpChatPage.js
import React, { useEffect, useState } from "react";
import axios from "../axios";
import { useAuth } from "../context/AuthContext";

const API_URL =  "https://api.gritfit.site/api";

export default function HelpChatPage({ sessionId }) {
  const { accessToken } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const [error, setError] = useState(null);

  
  useEffect(() => {
    fetchMessages();
  }, [sessionId]);

  async function fetchMessages() {
    setError(null);
    try {
      const resp = await axios.get(
        `${API_URL}/helpMessages/${sessionId}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
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
        `${API_URL}/sendHelpMessage`,
        {
          sessionId: sessionId,
          content: newMsg.trim(),
        },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setNewMsg("");
   
      fetchMessages();
    } catch (err) {
      setError("Could not send message. " + err.message);
    }
  }

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Help Chat</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ border: "1px solid #ccc", height: "300px", overflowY: "auto", marginBottom: "1rem" }}>
        {messages.map((m) => (
          <div key={m.id} style={{ margin: "0.25rem 0" }}>
            <strong>{m.sender_id}:</strong> {m.content}
          </div>
        ))}
      </div>

      <input
        type="text"
        value={newMsg}
        onChange={(e) => setNewMsg(e.target.value)}
        placeholder="Type your help message"
      />
      <button onClick={sendMessage}>Send</button>
    </div>

  );
}
