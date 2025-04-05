// src/pages/ChatsPage.js
import React, { useEffect, useState } from "react";
import axios from "../axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import TabBar from "./TabBar";
import { UsersRound } from "lucide-react";
import "../css/ChatsPage.css"; 
import logo from "../assets/logo1.png";

export default function ChatsPage() {
  const { accessToken, user } = useAuth();
  const [friendGroups, setFriendGroups] = useState([]);
  const [error, setError] = useState(null);
  const [expandedFriendId, setExpandedFriendId] = useState(null);
  const navigate = useNavigate();

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

      // Group sessions by friendId
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

      const groupsArray = Object.values(grouped);
      setFriendGroups(groupsArray);
    } catch (err) {
      setError("Could not load sessions. " + err.message);
    }
  }

  function toggleFriend(friendId) {
    setExpandedFriendId((prev) => (prev === friendId ? null : friendId));
  }

  function openChat(sessionId) {
    navigate(`/chat/${sessionId}`);
  }

  function getAvatarColorClass(friendId) {
    const colors = ["color-1", "color-2", "color-3", "color-4", "color-5"];
    let hash = 0;
    for (let i = 0; i < friendId.length; i++) {
      hash = friendId.charCodeAt(i) + ((hash << 5) - hash);
      hash = hash & hash;
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  }

  /***************************************
   * NEW: open the GFit Assistant
   ***************************************/
  function openAssistant() {
    navigate("/assistant");
  }

  return (
    <>
      <div className="chats-container">
        {error && <p className="error-text">{error}</p>}

        {/* PERMANENT GFIT ASSIST ROW */}
        <div className="friend-group-card">
          <div className="friend-group-header" onClick={openAssistant}>
            <div className="friend-avatar" style={{background: "white"}}>
              <img src={logo} alt="Logo" className="logo-gritPhases-task" />
            </div>
            GFit Assist
          </div>
        </div>
        {/* END OF PERMANENT ASSIST */}

        {friendGroups.map((group) => {
          const avatarColorClass = getAvatarColorClass(group.friendId || "");
          return (
            <div key={group.friendId} className="friend-group-card">
              <div
                className="friend-group-header"
                onClick={() => toggleFriend(group.friendId)}
              >
                <div className={`friend-avatar ${avatarColorClass}`}>
                  <UsersRound />
                </div>
                {group.friendName}
              </div>

              {expandedFriendId === group.friendId && (
                <div className="friend-group-sessions">
                  {group.sessions.map((sess) => {
                    const isMyRequest = sess.user_a === user.id;
                    const label = isMyRequest
                      ? "You asked for help"
                      : `${group.friendName} asked you for help`;

                    const taskDesc = sess.taskdetails?.taskdesc || "(No task desc)";

                    return (
                      <div
                        key={sess.id}
                        className="session-card"
                        onClick={() => openChat(sess.id)}
                      >
                        <p className="session-label">{label}</p>
                        <p className="session-taskdesc">
                          <strong>Task:</strong> {taskDesc}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <TabBar />
    </>
  );
}
