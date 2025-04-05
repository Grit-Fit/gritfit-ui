
import React, { useState } from "react";
import axios from "../axios";
import { useAuth } from "../context/AuthContext";

const API_URL =  "https://api.gritfit.site/api";

export default function AskHelp({ currentTaskDetailId, myFriends }) {
  const { accessToken } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [error, setError] = useState(null);

  async function handleAskHelp() {
    if (!currentTaskDetailId || !myFriends?.length) return;
    setError(null);

    try {
      const resp = await axios.post(
        `${API_URL}/createHelpSessions`,
        {
          taskdetailid: currentTaskDetailId,
          friendIds: myFriends, // array of userIds
        },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setSessions(resp.data.sessions);
      alert("Help requests sent to all friends!");
    } catch (err) {
      setError("Could not create help sessions. " + err.message);
    }
  }

  return (
    <div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button onClick={handleAskHelp}>Ask for Help</button>

      {sessions.map((s) => (
        <p key={s.id}>
          Session with friend: {s.user_b} (sessionId: {s.id})
        </p>
      ))}
    </div>
  );
}
