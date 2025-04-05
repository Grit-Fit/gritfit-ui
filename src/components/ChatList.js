import React, { useEffect, useState } from "react";
import axios from "../axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function MyHelpChats() {
  const { accessToken, user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyHelpSessions();
  }, []);

  async function fetchMyHelpSessions() {
    setError(null);
    try {
      const resp = await axios.get("/api/myHelpSessions", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setSessions(resp.data.sessions || []);
    } catch (err) {
      setError("Failed to load chat sessions: " + err.message);
    }
  }

  function getFriendName(session) {
    // If I'm user_a, the friend is user_b; else I'm user_b => friend is user_a
    if (session.user_a === user.id) {
      // friend is user_b
      return session.user_b_profile?.username || "Unknown Friend";
    } else {
      // friend is user_a
      return session.user_a_profile?.username || "Unknown Friend";
    }
  }

  function handleSessionClick(sessionId) {
    navigate(`/chat/${sessionId}`);
  }

  return (
    <div style={{ padding: "1rem" }}>
      <h2>My Help Chats</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {sessions.map((sess) => (
        <div
          key={sess.id}
          style={{ border: "1px solid #ccc", marginBottom: "0.5rem", padding: "0.5rem" }}
          onClick={() => handleSessionClick(sess.id)}
        >
          <p><strong>Chat with:</strong> {getFriendName(sess)}</p>
          <p>
            <strong>Task:</strong>{" "}
            {sess.taskdetail?.taskdesc || "No task desc"}
          </p>
          <small>(Session ID: {sess.id})</small>
        </div>
      ))}
    </div>
  );
}