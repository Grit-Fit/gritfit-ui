import React, { useEffect, useState } from "react";
import axios from "../axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function FriendChatList() {
  const { accessToken, user } = useAuth();
  const navigate = useNavigate();
  const [friendGroups, setFriendGroups] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMySessions();
 
  }, []);

  async function fetchMySessions() {
    setError(null);
    try {
      const resp = await axios.get("/api/myHelpSessions", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const allSessions = resp.data.sessions || [];

      // 1) Group sessions by "friendId"
      //    If I'm user_a, friend is user_b, and vice versa
      const grouped = {};
      allSessions.forEach((sess) => {
        const friendId = (sess.user_a === user.id) ? sess.user_b : sess.user_a;
        const friendName = (sess.user_a === user.id)
          ? sess.user_b_profile?.username
          : sess.user_a_profile?.username;

        if (!grouped[friendId]) {
          grouped[friendId] = {
            friendId,
            friendName,
            sessions: [],
          };
        }
        grouped[friendId].sessions.push(sess);
      });

      // 2) Convert grouped object into an array
      const groupsArray = Object.values(grouped);
      setFriendGroups(groupsArray);
    } catch (err) {
      setError("Could not load chat sessions. " + err.message);
    }
  }

  function goToFriendSessions(friendId, friendName, sessions) {
    navigate("/friendSessions", {
      state: { friendId, friendName, sessions },
    });
  }

  return (
    <div style={{ padding: "1rem" }}>
      <h2>My Chats (by Friend)</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {friendGroups.map((group) => (
        <div
          key={group.friendId}
          style={{
            border: "1px solid #ccc",
            marginBottom: "0.5rem",
            padding: "0.5rem",
            cursor: "pointer",
          }}
          onClick={() =>
            goToFriendSessions(group.friendId, group.friendName, group.sessions)
          }
        >
          <p style={{ fontWeight: "bold" }}>{group.friendName}</p>
          <small>{group.sessions.length} session(s)</small>
        </div>
      ))}
    </div>
  );
}
