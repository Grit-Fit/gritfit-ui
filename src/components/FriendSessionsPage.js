// src/pages/FriendSessionsPage.js
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function FriendSessionsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { friendId, friendName, sessions } = location.state || {};

  if (!friendId || !sessions) {
    return <p>Error: No friend sessions found.</p>;
  }

  function openChat(sessionId) {
    // navigate to /chat/:sessionId
    navigate(`/chat/${sessionId}`);
  }

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Chats with {friendName}</h2>

      {sessions.map((sess) => {
        const isMyRequest = (sess.user_a === user.id);
        
        const label = isMyRequest
          ? "You asked for help with this task"
          : `${friendName} asked you for help`;

        const taskdesc = sess.taskdetail?.taskdesc || "No task desc available";

        return (
          <div
            key={sess.id}
            style={{
              border: "1px solid #ccc",
              marginBottom: "0.5rem",
              padding: "0.5rem",
              cursor: "pointer",
            }}
            onClick={() => openChat(sess.id)}
          >
            <p style={{ fontStyle: "italic" }}>{label}</p>
            <p>
              <strong>Task:</strong> {taskdesc}
            </p>
          </div>
        );
      })}
    </div>
  );
}
